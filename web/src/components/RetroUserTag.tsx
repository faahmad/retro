import React from "react";
import { RetroUserType } from "../types/retro";
import { WorkspaceUser } from "../types/workspace-user";
import { UserAvatar } from "./UserAvatar";

interface RetroUserTagProps {
  retroUserType: RetroUserType;
  workspaceUser: WorkspaceUser;
}

export function RetroUserTag({ workspaceUser, retroUserType }: RetroUserTagProps) {
  return (
    <div
      key={workspaceUser?.userId}
      className="relative flex items-center bg-white px-3 py-2"
    >
      <div className="flex-shrink-0">
        <UserAvatar
          photoURL={workspaceUser?.userPhotoURL as string}
          displayName={workspaceUser?.userDisplayName as string}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          <p className="text-sm font-medium">{workspaceUser?.userDisplayName}</p>
          <p className="truncate text-xs text-gray">{retroUserType}</p>
        </div>
      </div>
    </div>
  );
}
