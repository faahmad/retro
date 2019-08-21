import * as React from "react";
import { Link } from "react-router-dom";
import { Firebase } from "../lib/Firebase";
import { UserConsumer } from "../components/UserContext";

interface DashboardPageState {
  isFetching: boolean;
  listOfRetroBoards: RetroBoard[];
  isCreating: boolean;
}

export class DashboardPage extends React.Component<any, DashboardPageState> {
  state = {
    isFetching: true,
    listOfRetroBoards: [],
    isCreating: false
  };

  async componentDidMount() {
    const listOfRetroBoards = await Firebase.fetchAllRetroBoards();
    this.setState({ listOfRetroBoards, isFetching: false });
  }

  handleOnClickCreateRetro = async () => {
    this.setState({ isCreating: true });
    const newRetroBoardId = await Firebase.createRetroBoard();
    await this.setState({ isCreating: false });
    this.props.history.push(`/dashboard/team/retro-boards/${newRetroBoardId}`);
  };

  render() {
    const { isFetching, listOfRetroBoards, isCreating } = this.state;
    return (
      <div className="dashboard-page container">
        <UserConsumer>
          {userContext => {
            console.log("userContext", userContext.user);
            return (
              <React.Fragment>
                <h3>Your Retros</h3>
                {isFetching && <span>Loading...</span>}
                {!isFetching && listOfRetroBoards.length === 0 && (
                  <span>You don't have any retros! </span>
                )}
                <ul className="dashboard-page__retro-board-list">
                  {listOfRetroBoards.map((retroBoard: RetroBoard) => {
                    return (
                      <li key={retroBoard.uid}>
                        <Link
                          to={`/dashboard/team/retro-boards/${retroBoard.uid}`}
                        >
                          {retroBoard.uid}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <button
                  disabled={isCreating}
                  className="btn btn-primary font-weight-bold"
                  onClick={this.handleOnClickCreateRetro}
                >
                  {!isCreating ? "Create a Retro" : "Creating..."}
                </button>
              </React.Fragment>
            );
          }}
        </UserConsumer>
      </div>
    );
  }
}
