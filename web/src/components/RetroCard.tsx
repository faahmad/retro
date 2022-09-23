import * as React from "react";
import { Retro, RetroUserType } from "../types/retro";
import moment from "moment";
import { ThumbDownIcon, ThumbUpIcon, TrashIcon } from "@heroicons/react/outline";
import { WorkspaceUsersMap } from "../types/workspace-user";
import { RetroUserTag } from "./RetroUserTag";
import { ArrowRightIcon } from "@heroicons/react/solid";
import { User } from "../types/user";

interface RetroCardProps {
  currentUserId: User["id"];
  retro: Retro;
  workspaceUsersMap: WorkspaceUsersMap;
  onClick: () => void;
  onClickDelete: () => void;
  isWorkspaceAdmin: boolean;
}
export function RetroCard({
  retro,
  workspaceUsersMap,
  onClick,
  currentUserId,
  onClickDelete,
  isWorkspaceAdmin
}: RetroCardProps) {
  const createdAt = retro.createdAt ? retro.createdAt.toDate() : new Date();

  const facilitatorId =
    Object.keys(retro.userIds).find(
      (userId) => retro.userIds[userId] === RetroUserType.FACILITATOR
    ) || retro.createdById;

  const isFacilitator = currentUserId === facilitatorId;

  return (
    <div
      className="flex border border-blue flex-col mx-auto lg:mx-4 my-4 w-5/12 h-64"
      style={{ minWidth: "360px" }}
    >
      <div className="bg-pink p-3 w-full flex justify-between items-center">
        <div>
          <p className="flex w-full text-sm text-blue font-black">
            <span>{retro.name}</span>
          </p>
          <p>
            <span className="text-blue text-xs font-light hidden lg:block">
              {moment(createdAt).format("L")}
            </span>
          </p>
        </div>
        <div>
          {isFacilitator || isWorkspaceAdmin ? (
            <button className="h-5 w-5 cursor-pointer" onClick={onClickDelete}>
              <TrashIcon className="h-5 w-5 text-gray hover:text-blue" />
            </button>
          ) : null}
        </div>
      </div>
      <div className="flex-1">
        <div>
          {facilitatorId && (
            <RetroUserTag
              workspaceUser={workspaceUsersMap[facilitatorId]}
              retroUserType={RetroUserType.FACILITATOR}
            />
          )}
        </div>
        <div className="flex w-full p-4">
          <div className="flex items-center">
            <ThumbUpIcon className="h-6 w-6 text-blue" />
            <p className="ml-2 text-blue text-sm">
              {retro.retroItemsData.goodCount} Good
            </p>
          </div>
          <div className="flex items-center ml-10">
            <ThumbDownIcon className="h-6 w-6 text-blue" />
            <p className="ml-2 text-blue text-sm">{retro.retroItemsData.badCount} Bad</p>
          </div>
        </div>
      </div>
      <div className="px-2 py-3 flex justify-end">
        <button
          className="h-12 w-32 bg-blue text-white uppercase cursor-pointer font-black hover:shadow hover:shadow-pink flex items-center justify-center cursor-pointer"
          onClick={onClick}
        >
          Open{" "}
          <span className="ml-2">
            <ArrowRightIcon className="h-4 w-4" />
          </span>
        </button>
      </div>
    </div>
  );
}
