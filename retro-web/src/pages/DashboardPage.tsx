import * as React from "react";
import { Link, Redirect, Switch } from "react-router-dom";
import { Firebase } from "../lib/Firebase";
import { UserAuthContext } from "../components/UserAuthContext";
import { Row, Col, Alert } from "reactstrap";
import { Sidebar } from "../components/SidebarComponent";
import moment from "moment";
import { LoadingText } from "../components/LoadingText";
import Octicon, { Alert as AlertIcon } from "@primer/octicons-react";

import { PrivateRoute } from "../components/PrivateRoute";

import { BillingPage } from "../pages/BillingPage";

interface DashboardPageState {
  isFetchingUser: boolean;
  user: RetroUser | null;
  workspace: RetroWorkspace | null;
  workspaceSubscription: Partial<RetroWorkspaceSubscription> | null;
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
      workspaceSubscription: null,
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
    const workspaceSubscription = await Firebase.fetchWorkspaceSubscriptionById(
      user.workspaceId!
    );
    await this.setState({
      user,
      workspace: workspace || null,
      workspaceSubscription: workspaceSubscription || null,
      listOfRetroBoards: listOfRetroBoards || [],
      isFetchingRetroBoards: false
    });
    await this.setState({ isFetchingUser: false });
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
      console.log("no workspace");
      return <Redirect to="/onboarding" />;
    }

    console.log(this.state);

    const user = this.state.user!;
    const {
      workspace,
      isFetchingRetroBoards,
      listOfRetroBoards,
      isCreatingRetroBoard,
      workspaceSubscription
    } = this.state;

    return (
      <div className="dashboard-page container-fluid full-height">
        <Switch>
          <PrivateRoute
            exact
            path={`/dashboard/:workspaceId/billing`}
            component={BillingPage}
          />
        </Switch>
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
            <Sidebar
              workspaceId={user.workspaceId || "workspace"}
              isWorkspaceOwner={workspace!.users[user.uid] === "owner"}
            />
          </Col>
          <Col lg="8" className="py-4">
            {workspaceSubscription!.subscriptionStatus === "trialing" && (
              <Alert color="warning">
                <div className="d-flex align-items-center">
                  <Octicon size="small" icon={AlertIcon} />
                  <div className="d-flex ml-3 flex-column small">
                    <span className="font-weight-bold">Account Status</span>
                    <span>
                      {`Your free 30 day trial ends on ${moment(
                        workspaceSubscription!.trialEnd!
                      ).calendar()}.`}{" "}
                      <Link to={`/dashboard/${workspace!.uid}/billing`}>
                        Click here to upgrade your account.
                      </Link>
                    </span>
                  </div>
                </div>
              </Alert>
            )}
            <div className="d-flex justify-content-between">
              <h3>Your Retros</h3>
              {workspace && workspace.users[user.uid] === "owner" && (
                <button
                  disabled={isCreatingRetroBoard}
                  className="btn btn-primary font-weight-bold"
                  onClick={this.handleOnClickCreateRetro}
                >
                  {!isCreatingRetroBoard ? "Create a Retro" : "Creating..."}
                </button>
              )}
            </div>
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
