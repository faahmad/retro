import * as React from "react";
import { Link } from "react-router-dom";
import { Firebase } from "../lib/Firebase";

export class DashboardPage extends React.Component<any, any> {
  state = {
    isFetching: true,
    listOfRetroBoards: []
  };

  async componentDidMount() {
    const listOfRetroBoards = await Firebase.fetchAllRetroBoards();
    this.setState({ listOfRetroBoards, isFetching: false });
  }

  render() {
    const { isFetching, listOfRetroBoards } = this.state;
    console.log(listOfRetroBoards);
    return (
      <div className="dashboard-page container">
        <h1>Dashboard Page</h1>
        {isFetching && <span>Loading...</span>}
        {!isFetching && listOfRetroBoards.length === 0 && (
          <span>
            You don't have any retro boards! Click here to create one.
          </span>
        )}
        <ul className="dashboard-page__retro-board-list">
          {listOfRetroBoards.map((retroBoard: any) => {
            return (
              <li key={retroBoard.uid}>
                <Link to={`/dashboard/team/retro-boards/${retroBoard.uid}`}>
                  {retroBoard.uid}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
