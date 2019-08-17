import * as React from "react";
import { Link } from "react-router-dom";
import { Firebase } from "../lib/Firebase";

interface DashboardPageState {
  isFetching: boolean;
  listOfRetroBoards: RetroBoard[];
}

export class DashboardPage extends React.Component<any, DashboardPageState> {
  state = {
    isFetching: true,
    listOfRetroBoards: []
  };

  async componentDidMount() {
    const listOfRetroBoards = await Firebase.fetchAllRetroBoards();
    this.setState({ listOfRetroBoards, isFetching: false });
  }

  handleOnClickCreateRetro = async () => {
    const newRetroBoardId = await Firebase.createRetroBoard();
    this.props.history.push(`/dashboard/team/retro-boards/${newRetroBoardId}`);
  };

  render() {
    const { isFetching, listOfRetroBoards } = this.state;
    return (
      <div className="dashboard-page container mt-5">
        <h3>Your Retros</h3>
        {isFetching && <span>Loading...</span>}
        {!isFetching && listOfRetroBoards.length === 0 && (
          <span>You don't have any retros! </span>
        )}
        <ul className="dashboard-page__retro-board-list">
          {listOfRetroBoards.map((retroBoard: RetroBoard) => {
            return (
              <li key={retroBoard.uid}>
                <Link to={`/dashboard/team/retro-boards/${retroBoard.uid}`}>
                  {retroBoard.uid}
                </Link>
              </li>
            );
          })}
        </ul>
        <button
          className="btn btn-primary font-weight-bold"
          onClick={this.handleOnClickCreateRetro}
        >
          Create a Retro
        </button>
      </div>
    );
  }
}
