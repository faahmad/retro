import * as React from "react";
import { Row, Col } from "reactstrap";
import { Firebase } from "../lib/Firebase";
import { boolean } from "yup";
import { InviteUserModal } from "../components/InviteUserModal";

interface WorkspaceMembersPageProps {
  match: {
    params: {
      workspaceId: RetroWorkspace["uid"];
    };
  };
}

interface WorkspaceMembersPageState {
  workspace: RetroWorkspace | null;
  workspaceUsers: RetroUser[];
  isModalOpen: boolean;
}

export class WorkspaceMembersPage extends React.Component<
  WorkspaceMembersPageProps,
  WorkspaceMembersPageState
> {
  state: WorkspaceMembersPageState = {
    workspace: null,
    workspaceUsers: [],
    isModalOpen: false
  };
  async componentDidMount() {
    const { workspaceId } = this.props.match.params;
    const workspace = await Firebase.fetchWorkspaceById(workspaceId);
    const workspaceUsers = await Firebase.fetchUsersByWorkspaceId(workspaceId);
    if (workspace && workspaceUsers) {
      this.setState({ workspace, workspaceUsers });
    }
    return;
  }
  handleOpenModal = () => {
    this.setState({ isModalOpen: true });
  };
  handleSubmit = async (email: string) => {
    const { workspace } = this.state;
    if (!workspace) return;
    await Firebase.sendWorkspaceInviteByEmail(workspace.uid, email);
    this.setState({ isModalOpen: false });
    const updatedWorkspace = await Firebase.fetchWorkspaceById(workspace.uid);
    this.setState({ workspace: updatedWorkspace! });
  };
  render() {
    const { workspace, workspaceUsers, isModalOpen } = this.state;
    if (!workspace) return <div>Loading...</div>;
    console.log(workspace);
    return (
      <div className="workspace-members container py-4">
        {isModalOpen && (
          <InviteUserModal
            workspaceDisplayName={workspace.displayName}
            isOpen={this.state.isModalOpen}
            onToggle={() => this.setState({ isModalOpen: false })}
            onSubmit={this.handleSubmit}
          />
        )}
        <Row>
          <Col lg="8">
            <div className="d-flex align-items-end justify-content-between mb-2">
              <h3 className="m-0">Members</h3>
              <button
                className="btn btn-sm btn-primary"
                onClick={this.handleOpenModal}
              >
                Invite People
              </button>
            </div>
            {!workspace && <span>Loading...</span>}
            {workspace && (
              <React.Fragment>
                <ul className="workspace-members__list list-unstyled">
                  {workspaceUsers.map((user: RetroUser) => {
                    return (
                      <MemberListItem
                        key={user.uid}
                        user={user}
                        userType={workspace.users[user.uid]}
                      />
                    );
                  })}
                </ul>
                {workspaceUsers.length === 1 && (
                  <div className="small mt-2">
                    <span className="text-muted">
                      Retros are better with other people,{" "}
                    </span>
                    <span
                      className="text-primary cursor-pointer hover-underline"
                      onClick={this.handleOpenModal}
                    >
                      invite them
                    </span>
                    .
                  </div>
                )}
              </React.Fragment>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

interface MemberListItemProps {
  user: RetroUser;
  userType: RetroWorkspaceUserType;
}

const MemberListItem: React.FC<MemberListItemProps> = ({ user, userType }) => {
  return (
    <li className="d-flex align-items-center justify-content-between border rounded p-2">
      <div className="d-flex">
        <img
          alt="user-avatar"
          className="rounded-circle mr-2"
          style={{ height: 40, width: 40 }}
          src={user.photoURL}
        />
        <div className="d-flex flex-column">
          <span className="text-dark">{user.displayName}</span>
          <span className="small text-muted">{user.email}</span>
        </div>
      </div>
      <div>
        <span className="text-capitalize">{userType}</span>
      </div>
    </li>
  );
};
