import * as React from "react";

interface WorkspaceInviteURLPageProps {
  match: any;
}

export class WorkspaceInviteURLPage extends React.Component<
  WorkspaceInviteURLPageProps,
  {}
> {
  render() {
    return (
      <div className="workspace-invite-url-page container py-4">
        <h1>Workspace: {this.props.match.params.workspaceId}</h1>
      </div>
    );
  }
}
