import * as React from "react";
import { Retro } from "../types/retro";
import moment from "moment";
import { ThumbDownIcon, ThumbUpIcon } from "@heroicons/react/outline";

interface RetroCardProps {
  retro: Retro;
  onClick: () => void;
}
export function RetroCard({ retro, onClick }: RetroCardProps) {
  const createdAt = retro.createdAt ? retro.createdAt.toDate() : new Date();

  return (
    <div
      onClick={onClick}
      className="flex border border-blue cursor-pointer flex-col mx-auto lg:mx-4 my-4 w-5/12 h-64"
      style={{ minWidth: "360px" }}
    >
      <div className="flex bg-pink p-3 items-baseline w-full">
        <p className="flex w-full justify-between text-sm text-blue font-black">
          <span>{retro.name}</span>
          <span className="text-xs font-light hidden lg:block">
            {moment(createdAt).format("LLL")}
          </span>
        </p>
      </div>
      <div className="flex flex-col justify-around h-full w-full p-4">
        <div className="flex items-center">
          <ThumbUpIcon className="h-6 w-6 text-blue" />
          <p className="ml-2 text-blue text-sm">{retro.retroItemsData.goodCount} Good</p>
        </div>
        <div className="flex items-center">
          <ThumbDownIcon className="h-6 w-6 text-blue" />
          <p className="ml-2 text-blue text-sm">{retro.retroItemsData.badCount} Bad</p>
        </div>
      </div>
    </div>
  );
}
