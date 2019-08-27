import * as React from "react";
import { Row, Col } from "reactstrap";
import { Firebase } from "../lib/Firebase";
import { InviteUserModal } from "../components/InviteUserModal";
import moment from "moment";

interface WorkspaceMembersPageProps {
  match: {
    params: {
      workspaceId: RetroWorkspace["uid"];
    };
  };
}

interface WorkspaceMembersPageState {
  workspace: RetroWorkspace | null;
  workspaceUsers: { [userId: string]: RetroUser };
  invitedUsers: RetroInvitedUser[];
  isModalOpen: boolean;
}

export class WorkspaceMembersPage extends React.Component<
  WorkspaceMembersPageProps,
  WorkspaceMembersPageState
> {
  state: WorkspaceMembersPageState = {
    workspace: null,
    workspaceUsers: {},
    invitedUsers: [],
    isModalOpen: false
  };
  async componentDidMount() {
    const { workspaceId } = this.props.match.params;
    const workspacePromise = Firebase.fetchWorkspaceById(workspaceId);
    const workspaceUsersPromise = Firebase.fetchUsersByWorkspaceId(workspaceId);
    const invitedUsersPromise = Firebase.fetchInvitedUsersByWorkspaceId(
      workspaceId
    );

    const [
      workspace = null,
      workspaceUsers = {},
      invitedUsers = []
    ] = await Promise.all([
      workspacePromise,
      workspaceUsersPromise,
      invitedUsersPromise
    ]);

    this.setState({ workspace, workspaceUsers, invitedUsers });
  }
  handleOpenModal = () => {
    this.setState({ isModalOpen: true });
  };
  handleSubmit = async (email: string) => {
    const { workspace } = this.state;
    if (!workspace) return;
    await Firebase.inviteUserByEmailToWorkspace(email.trim(), workspace.uid);
    this.setState({ isModalOpen: false });
    const updatedInvitedUsers = await Firebase.fetchInvitedUsersByWorkspaceId(
      workspace.uid
    );
    this.setState({ invitedUsers: updatedInvitedUsers! });
  };
  render() {
    const { workspace, workspaceUsers, isModalOpen, invitedUsers } = this.state;
    if (!workspace) return <div>Loading...</div>;
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
                  {Object.keys(workspaceUsers).map((userId: string) => {
                    const user = workspaceUsers[userId];
                    return (
                      <MemberListItem
                        key={user.uid}
                        user={user}
                        userType={workspace.users[user.uid]}
                      />
                    );
                  })}
                </ul>
                <h3 className="mt-4">Invited Users</h3>
                <ul className="workspace-members__list list-unstyled">
                  {invitedUsers.map((invitedUser: RetroInvitedUser) => {
                    const invitedBy = workspaceUsers[invitedUser.invitedBy];
                    const invitedByDisplayName =
                      invitedBy.displayName || invitedBy.email;

                    return (
                      <InvitedUserListItem
                        key={invitedUser.email}
                        invitedUser={invitedUser}
                        invitedByDisplayName={invitedByDisplayName}
                      />
                    );
                  })}
                </ul>
                {invitedUsers.length === 0 && (
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
    <li className="d-flex align-items-center justify-content-between border rounded p-2 mb-1">
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
        <span className="text-capitalize text-muted">{userType}</span>
      </div>
    </li>
  );
};

interface InvitedUserListItemProps {
  invitedUser: RetroInvitedUser;
  invitedByDisplayName: string;
}

const InvitedUserListItem: React.FC<InvitedUserListItemProps> = ({
  invitedUser,
  invitedByDisplayName
}) => {
  return (
    <li className="d-flex align-items-center justify-content-between border rounded p-2 text-muted small mb-1">
      <div className="d-flex">
        <div className="d-flex flex-column">
          <span className="text-dark">{invitedUser.email}</span>
          <span>Invited by {invitedByDisplayName}</span>
        </div>
      </div>
      <div className="d-flex flex-column text-right">
        <span>{!invitedUser.hasAcceptedInvite ? `Sent` : `Accepted`}</span>
        <span>
          {!invitedUser.hasAcceptedInvite
            ? moment(invitedUser.dateInviteWasSent.toDate()).calendar()
            : ""}
        </span>
      </div>
    </li>
  );
};
