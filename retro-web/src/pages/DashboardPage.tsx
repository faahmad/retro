import * as React from "react";
import { Link, Redirect } from "react-router-dom";
import { Firebase } from "../lib/Firebase";
import { UserAuthContext } from "../components/UserAuthContext";
import { Row, Col } from "reactstrap";
import { Sidebar } from "../components/SidebarComponent";
import moment from "moment";
import { LoadingText } from "../components/LoadingText";

interface DashboardPageState {
  isFetchingUser: boolean;
  user: RetroUser | null;
  workspace: RetroWorkspace | null;
  isFetchingRetroBoards: boolean;
  listOfRetroBoards: RetroBoard[];
  isCreatingRetroBoard: boolean;
}

export class DashboardPage extends React.Component<any, DashboardPageState> {
  static contextType = UserAuthContext;

  constructor(props: any) {
    super(props);
    const locationState = props.location.state;

    this.state = {
      isFetchingUser: true,
      user: locationState ? locationState.user : null,
      workspace: null,
      isFetchingRetroBoards: true,
      listOfRetroBoards: [],
      isCreatingRetroBoard: false
    };
  }

  async componentDidMount() {
    const { userAuthAccount } = this.context;

    const isNewUser =
      userAuthAccount.metadata.creationTime ===
      userAuthAccount.metadata.lastSignInTime;

    if (isNewUser && !this.state.user) {
      await Firebase.createUserDoc(this.context.userAuthAccount);
    }

    const user = await Firebase.fetchUserById(userAuthAccount.uid);

    if (user && !user.workspaceId) {
      const invitedUserData = await Firebase.fetchInvitedUserByEmail(
        user.email
      );

      if (invitedUserData) {
        this.handleAddInvitedUserToWorkspace(user, invitedUserData);
        return;
      }
      this.setState({ isFetchingUser: false });
    }

    if (user && user.workspaceId) {
      this.handleFetchWorkspaceAndRetroBoards(user);
    }
    return;
  }

  handleAddInvitedUserToWorkspace = async (
    newUser: any,
    invitedUserData: RetroInvitedUser
  ) => {
    await Firebase.updateUserDoc(newUser.uid, {
      workspaceId: invitedUserData!.workspaceId
    });

    await Firebase.addUserIdAndUserTypeToWorkspace(
      newUser!.uid,
      invitedUserData!.userType,
      invitedUserData!.workspaceId
    );
    await Firebase.updateInvitedUserAfterSignUp(invitedUserData!.uid);

    newUser = await Firebase.fetchUserById(newUser!.uid);
    this.handleFetchWorkspaceAndRetroBoards(newUser!);

    return;
  };

  handleFetchWorkspaceAndRetroBoards = async (user: RetroUser) => {
    if (!user) {
      return;
    }
    const workspace = await Firebase.fetchWorkspaceById(user.workspaceId!);
    const listOfRetroBoards = await Firebase.fetchAllRetroBoardsByWorkspaceId(
      user.workspaceId!
    );
    await this.setState({
      user,
      isFetchingUser: false,
      workspace: workspace ? workspace : null,
      listOfRetroBoards: listOfRetroBoards || [],
      isFetchingRetroBoards: false
    });
    return;
  };

  handleOnClickCreateRetro = async () => {
    const user = this.state.user;
    if (!user || !user.workspaceId) {
      return;
    }
    this.setState({ isCreatingRetroBoard: true });
    const newRetroBoardId = await Firebase.createRetroBoard(user.workspaceId);
    await this.setState({ isCreatingRetroBoard: false });
    this.props.history.push(
      `/dashboard/${user.workspaceId}/retro-boards/${newRetroBoardId}`
    );
  };

  render() {
    if (this.state.isFetchingUser) return <LoadingText />;
    if (
      !this.state.isFetchingUser &&
      (!this.state.user || !this.state.user.workspaceId)
    ) {
      return <Redirect to="/onboarding" />;
    }

    const user = this.state.user!;
    const {
      workspace,
      isFetchingRetroBoards,
      listOfRetroBoards,
      isCreatingRetroBoard
    } = this.state;

    return (
      <div className="dashboard-page container-fluid full-height">
        <Row>
          <Col lg="2" className="bg-light full-height py-4 shadow-sm">
            <div className="workspace-name">
              <div
                className={
                  workspace && workspace.displayName
                    ? "font-weight-bold text-secondary"
                    : "text-light"
                }
              >
                {workspace && workspace.displayName
                  ? workspace.displayName
                  : "Workspace"}
              </div>
              <UserDisplayName user={user} />
            </div>
            <hr />
            <Sidebar workspaceId={user.workspaceId || "workspace"} />
          </Col>
          <Col lg="8" className="py-4">
            <h3>Your Retros</h3>
            {isFetchingRetroBoards && <span>Loading...</span>}
            {!isFetchingRetroBoards && listOfRetroBoards.length === 0 && (
              <span>You don't have any retros! </span>
            )}
            {!isFetchingRetroBoards && (
              <React.Fragment>
                <ul className="dashboard-page__retro-board-list">
                  {listOfRetroBoards.map((retroBoard: RetroBoard) => {
                    return (
                      <li key={retroBoard.uid}>
                        <Link
                          to={`/dashboard/${retroBoard.workspaceId}/retro-boards/${retroBoard.uid}`}
                        >
                          {moment(retroBoard.createdAt.toDate()).format(
                            "dddd - MMMM Mo, YYYY - h:mm a"
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                {workspace && workspace.users[user.uid] === "owner" && (
                  <button
                    disabled={isCreatingRetroBoard}
                    className="btn btn-primary font-weight-bold"
                    onClick={this.handleOnClickCreateRetro}
                  >
                    {!isCreatingRetroBoard ? "Create a Retro" : "Creating..."}
                  </button>
                )}
              </React.Fragment>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const UserDisplayName = ({ user }: { user: RetroUser | null }) => {
  if (!user) {
    return null;
  }
  return (
    <div className="d-flex flex-column mt-1">
      <small className="text-muted">{user.email}</small>
    </div>
  );
};
