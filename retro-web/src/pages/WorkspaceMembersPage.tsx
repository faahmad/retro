import * as React from "react";
import { Firebase } from "../lib/Firebase";

interface WorkspaceMembersPageProps {
  match: {
    params: {
      workspaceId: RetroWorkspace["uid"];
    };
  };
}

interface WorkspaceMembersPageState {
  workspaceUsers: RetroUser[];
}

export class WorkspaceMembersPage extends React.Component<
  WorkspaceMembersPageProps,
  WorkspaceMembersPageState
> {
  state = {
    workspaceUsers: []
  };
  async componentDidMount() {
    const { workspaceId } = this.props.match.params;
    const workspaceUsers = await Firebase.fetchUsersByWorkspaceId(workspaceId);
    if (workspaceUsers) {
      this.setState({ workspaceUsers });
    }
    return;
  }

  render() {
    return (
      <div className="workspace-members container py-4">
        <h1>Members</h1>
        <ul className="workspace-members__list">
          {this.state.workspaceUsers.map((user: RetroUser) => {
            console.log(user);
            return <li key={user.uid}>{user.displayName}</li>;
          })}
        </ul>
      </div>
    );
  }
}
