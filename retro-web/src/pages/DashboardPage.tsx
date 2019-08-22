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
}

export class DashboardPage extends React.Component<any, DashboardPageState> {
  static contextType = UserAuthContext;
  state = {
    isNewUser: null,
    isFetchingRetroBoards: true,
    listOfRetroBoards: [],
    isCreatingRetroBoard: false,
    user: null
  };
  async componentDidMount() {
    const user = await Firebase.fetchUserById(this.context.userAuthAccount.uid);
    if (!user || !user.workspaceId) {
      await this.setState({ isNewUser: true });
    } else {
      const listOfRetroBoards = await Firebase.fetchAllRetroBoards();
      this.setState({
        user,
        listOfRetroBoards,
        isNewUser: false,
        isFetchingRetroBoards: false
      });
    }
  }
  handleOnClickCreateRetro = async () => {
    this.setState({ isCreatingRetroBoard: true });
    const newRetroBoardId = await Firebase.createRetroBoard();
    await this.setState({ isCreatingRetroBoard: false });
    this.props.history.push(`/dashboard/team/retro-boards/${newRetroBoardId}`);
  };
  render() {
    const {
      isFetchingRetroBoards,
      listOfRetroBoards,
      isNewUser,
      isCreatingRetroBoard,
      user
    } = this.state;

    if (isNewUser) {
      return <Redirect to="/onboarding" />;
    }

    return (
      <div className="dashboard-page container-fluid full-height">
        <Row>
          <Col lg="2" className="bg-light full-height py-4 shadow-sm">
            <WorkspaceName user={user} />
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

const WorkspaceName = ({ user }: { user: RetroUser | null }) => {
  const hasWorkspaceDisplayName = user && user.workspaceDisplayName;

  return (
    <div className="workspace-name">
      <div
        className={
          hasWorkspaceDisplayName
            ? "font-weight-bold text-secondary"
            : "text-light"
        }
      >
        {user && user.workspaceDisplayName
          ? user.workspaceDisplayName
          : "Workspace"}
      </div>
      <small className={hasWorkspaceDisplayName ? "text-muted" : "text-light"}>
        {user && user.displayName}
      </small>
    </div>
  );
};
