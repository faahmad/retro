import * as React from "react";
import { WorkspaceUser, WorkspaceUsersMap } from "../types/workspace-user";
import { Workspace } from "../types/workspace";
import { useUpdateWorkspaceUser } from "../hooks/use-update-workspace-user";
import { Modal } from "../components/Modal";
import { Button } from "../components/Button";
import { useRemoveWorkspaceUser } from "../hooks/use-remove-workspace-user";
import { ErrorMessageBanner } from "../components/ErrorMessageBanner";
import { InviteUserToWorkspaceModal } from "../components/InviteUserToWorkspaceModal";
import { useGetWorkspace } from "../hooks/use-get-workspace";
import { useCurrentUser } from "../hooks/use-current-user";
import { WorkspaceInvite, WorkspaceInviteStatus } from "../types/workspace-invite";
import moment from "moment";

type ActionSetT = { type: "set"; email: string; userId: string };
type ActionUnsetT = { type: "unset"; email: null; userId: null };
type ActionT = ActionSetT | ActionUnsetT;

export function WorkspaceUsersTable({
  workspaceId,
  users
}: {
  workspaceId: Workspace["id"];
  users: WorkspaceUser[];
}) {
  const workspaceState = useGetWorkspace();
  const [errorMessage, setErrorMessage] = React.useState("");
  const currentUser = useCurrentUser();
  const updateWorkspaceUser = useUpdateWorkspaceUser(workspaceId);
  const removeWorkspaceUser = useRemoveWorkspaceUser(workspaceId);
  const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false);

  const handleToggleInviteModal = () => {
    setIsInviteModalOpen((prevIsInviteModalOpen) => !prevIsInviteModalOpen);
  };

  async function handleChangeRole(
    workspaceUserId: WorkspaceUser["userId"],
    role: WorkspaceUser["userRole"]
  ) {
    try {
      await updateWorkspaceUser(workspaceUserId, { userRole: role });
    } catch (error) {
      // @ts-ignore
      setErrorMessage(error.message);
    }
  }

  async function handleRemoveWorkspaceUser(workspaceUserId: WorkspaceUser["userId"]) {
    try {
      await removeWorkspaceUser(workspaceUserId);
    } catch (error) {
      // @ts-ignore
      setErrorMessage(error.message);
    }
  }

  const [state, dispatch] = React.useReducer(
    (state, action: ActionT) => {
      const map = {
        set: (action: ActionT) => ({
          ...state,
          isModalOpen: true,
          email: action.email,
          userId: action.userId
        }),
        unset: () => ({
          ...state,
          isModalOpen: false,
          email: null,
          userId: null
        })
      };
      return map[action.type](action) || state;
    },
    {
      isModalOpen: false,
      email: null,
      userId: null
    }
  );
  function handleOpen({ email, userId }: { email: string; userId: string }) {
    return dispatch({ type: "set", email, userId });
  }
  function handleClose() {
    return dispatch({ type: "unset", email: null, userId: null });
  }

  return (
    <React.Fragment>
      <InviteUserToWorkspaceModal
        workspaceId={workspaceId}
        workspaceName={workspaceState.name}
        workspaceOwnerId={workspaceState.ownerId}
        workspaceURL={workspaceState.url}
        userCount={users.length}
        invitedUserCount={workspaceState.invitedUsers.length}
        isOpen={isInviteModalOpen}
        onRequestClose={handleToggleInviteModal}
        onClick={handleToggleInviteModal}
      />
      <Modal isOpen={state.isModalOpen} onRequestClose={handleClose}>
        <div className="text-blue flex flex-col">
          <h2 className="text-lg mb-2 font-bold">Remove {state.email}?</h2>
          <p>
            Are you sure you want to remove this person from the workspace? They will no
            longer have access to the retrospectives.
          </p>
          <div className="space-y-48">
            <Button className="mr-8" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              className="bg-red text-white border-white shadow-red"
              onClick={() => {
                handleRemoveWorkspaceUser(state.userId);
                handleClose();
              }}
            >
              Remove
            </Button>
          </div>
        </div>
      </Modal>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl text-blue font-bold">Team members</h2>
        <div className="flex items-baseline">
          <p className="text-blue font-black hidden lg:block">Invite Member</p>
          <button
            disabled={false}
            onClick={handleToggleInviteModal}
            className="h-10 w-10 bg-blue text-white ml-3 border border-red shadow shadow-red text-2xl hover:bg-pink-1/2 active:transform-1 focus:outline-none"
          >
            +
          </button>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow shadow-red overflow-hidden border border-red">
              <table className="min-w-full divide-y divide-red">
                <thead className="text-blue">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider"
                    >
                      Role
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.userId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue">
                        {user.userDisplayName || "--"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue">
                        {user.userEmail || "--"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue">
                        {user.userId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-blue">
                        <select
                          className="border border-blue px-2"
                          value={user.userRole}
                          onChange={(event) => {
                            const role = event.target.value as WorkspaceUser["userRole"];
                            handleChangeRole(user.userId, role);
                          }}
                        >
                          <option value="member">member</option>
                          <option value="owner">owner</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs underline text-red">
                        {user.userId !== currentUser?.auth?.uid ? (
                          <button
                            className="hover:text-pink"
                            onClick={() =>
                              handleOpen({
                                email: user.userEmail || "--",
                                userId: user.userId
                              })
                            }
                          >
                            Remove
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <WorkspaceInvitesTable
        invites={workspaceState.invitedUsers}
        usersMap={workspaceState.users}
      />
      {errorMessage && (
        <div className="mt-4">
          <ErrorMessageBanner
            title="Oops, something went wrong. Our bad. Please try again."
            message={errorMessage}
          />
        </div>
      )}
    </React.Fragment>
  );
}

function WorkspaceInvitesTable({
  invites,
  usersMap
}: {
  invites: WorkspaceInvite[];
  usersMap: WorkspaceUsersMap;
}) {
  const pendingInvites = invites.filter(
    (invite) => invite.status !== WorkspaceInviteStatus.ACCEPTED
  );
  return (
    <div className="mt-6">
      <h2 className="text-xl text-blue font-bold">
        Pending invites ({pendingInvites.length})
      </h2>

      {pendingInvites.length === 0 ? (
        <p className="text-blue">There are no pending invites.</p>
      ) : (
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow shadow-red overflow-hidden border border-red">
                <table className="min-w-full divide-y divide-red">
                  <thead className="text-blue">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider"
                      >
                        Invited by
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider"
                      >
                        Sent at
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingInvites.map((invite) => {
                      const invitedBy = usersMap[invite.invitedByUserId];

                      return (
                        <tr key={invite.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue">
                            {invite.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue">
                            {invite.status}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue">
                            {invitedBy?.userDisplayName || invitedBy?.userEmail || "--"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-blue">
                            {invite.createdAt
                              ? moment(invite.createdAt.toDate()).format("L")
                              : "--"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-xs underline text-red">
                            {null}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
