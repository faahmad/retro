import * as React from "react";
import { Link, Redirect } from "react-router-dom";
import { Firebase } from "../lib/Firebase";
import { UserAuthContext } from "../components/UserAuthContext";
import { Row, Col } from "reactstrap";
import { Sidebar } from "../components/SideBar";
import moment from "moment";

interface DashboardPageState {
  isNewUser: boolean | null;
  isFetchingRetroBoards: boolean;
  listOfRetroBoards: RetroBoard[];
  isCreatingRetroBoard: boolean;
  user: RetroUser | null;
  workspaceDisplayName: RetroWorkspace["displayName"] | null;
}

export class DashboardPage extends React.Component<any, DashboardPageState> {
  static contextType = UserAuthContext;
  state = {
    isNewUser: null,
    isFetchingRetroBoards: true,
    listOfRetroBoards: [],
    isCreatingRetroBoard: false,
    user: null,
    workspaceDisplayName: null
  };
  async componentDidMount() {
    const user = await Firebase.fetchUserById(this.context.userAuthAccount.uid);
    if (!user || !user.workspaceId) {
      await this.setState({ isNewUser: true });
    } else {
      const workspace = await Firebase.fetchWorkspaceById(user.workspaceId);
      await this.setState({
        user,
        isNewUser: false,
        workspaceDisplayName: workspace ? workspace.displayName : null
      });
      const listOfRetroBoards = await Firebase.fetchAllRetroBoardsByWorkspaceId(
        user.workspaceId
      );
      await this.setState({
        listOfRetroBoards: listOfRetroBoards || [],
        isFetchingRetroBoards: false
      });
    }
  }
  handleOnClickCreateRetro = async () => {
    const user: any = this.state.user;
    if (!user) {
      return;
    }
    this.setState({ isCreatingRetroBoard: true });
    const newRetroBoardId = await Firebase.createRetroBoard(user.workspaceId);
    await this.setState({ isCreatingRetroBoard: false });
    this.props.history.push(`/dashboard/team/retro-boards/${newRetroBoardId}`);
  };
  render() {
    const {
      isFetchingRetroBoards,
      listOfRetroBoards,
      isNewUser,
      isCreatingRetroBoard,
      user,
      workspaceDisplayName
    } = this.state;

    console.log(workspaceDisplayName);

    if (isNewUser) {
      return <Redirect to="/onboarding" />;
    }

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
            <Sidebar />
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
                          to={`/dashboard/team/retro-boards/${retroBoard.uid}`}
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
