import * as React from "react";
import { Link, Redirect } from "react-router-dom";
import { Firebase } from "../lib/Firebase";
import { UserAuthContext } from "../components/UserAuthContext";
import { Row, Col } from "reactstrap";
import { Sidebar } from "../components/Sidebar";
import moment from "moment";
import { LoadingText } from "../components/LoadingText";

interface DashboardPageState {
  isFetchingUser: boolean;
  user: RetroUser | null;
  workspaceDisplayName: RetroWorkspace["displayName"] | null;
  isFetchingRetroBoards: boolean;
  listOfRetroBoards: RetroBoard[];
  isCreatingRetroBoard: boolean;
}

export class DashboardPage extends React.Component<any, DashboardPageState> {
  static contextType = UserAuthContext;
  state: DashboardPageState = {
    isFetchingUser: true,
    user: null,
    workspaceDisplayName: null,
    isFetchingRetroBoards: true,
    listOfRetroBoards: [],
    isCreatingRetroBoard: false
  };
  async componentDidMount() {
    const { userAuthAccount } = this.context;
    const user = await Firebase.fetchUserById(userAuthAccount.uid);
    console.log("componentDidMount user", user);
    if (!user || !user.workspaceId) {
      console.log("user doesn't exist");
      const invitedUser = await Firebase.fetchInvitedUserByEmail(
        userAuthAccount.email
      );

      if (invitedUser) {
        console.log("user has an invite");
        this.handleCreateUserThatHasAnInvite(userAuthAccount, invitedUser);
        return;
      }
      console.log("user doesn't have an invite");
      this.setState({ isFetchingUser: false });
    } else {
      console.log("user exists");
      this.handleFetchWorkspaceAndRetroBoards(user);
    }
    return;
  }

  handleCreateUserThatHasAnInvite = async (
    userAuthAccount: any,
    invitedUser: RetroInvitedUser
  ) => {
    let newUser;
    newUser = await Firebase.createUserDoc(userAuthAccount);

    await Firebase.updateUserDoc(userAuthAccount.uid, {
      workspaceId: invitedUser!.workspaceId
    });
    await Firebase.addUserIdAndUserTypeToWorkspace(
      newUser!.uid,
      invitedUser!.userType,
      invitedUser!.workspaceId
    );
    await Firebase.updateInvitedUserAfterSignUp(invitedUser!.uid);

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
      workspaceDisplayName: workspace ? workspace.displayName : null,
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
      console.log("render", this.state);
      return <Redirect to="/onboarding" />;
    }

    const user = this.state.user!;
    const {
      workspaceDisplayName,
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
                  workspaceDisplayName
                    ? "font-weight-bold text-secondary"
                    : "text-light"
                }
              >
                {workspaceDisplayName ? workspaceDisplayName : "Workspace"}
              </div>
              <UserDisplayName user={user} />
            </div>
            <hr />
            <Sidebar workspaceId={user.workspaceId || "workspace"} />
          </Col>
          <Col lg="10" className="py-4">
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
                <button
                  disabled={isCreatingRetroBoard}
                  className="btn btn-primary font-weight-bold"
                  onClick={this.handleOnClickCreateRetro}
                >
                  {!isCreatingRetroBoard ? "Create a Retro" : "Creating..."}
                </button>
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
  return <small className="text-muted">{user.displayName || user.email}</small>;
};
