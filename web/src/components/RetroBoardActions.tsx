import * as React from "react";
import { Button } from "./Button";
import { ThumbsUpIcon } from "./ThumbsUpIcon";

interface RetroBoardActionsProps {
  onSortByLikes: () => void;
}

export function RetroBoardActions(props: RetroBoardActionsProps) {
  return (
    <div className="flex">
      <div className="flex p-4 mb-4 border border-red items-center">
        <Button
          style={{ width: "10rem" }}
          className="text-blue w-20"
          onClick={props.onSortByLikes}
        >
          <div className="flex items-end justify-center w-full">
            <span className="mr-1">Sort By</span>
            <ThumbsUpIcon filled={true} />
          </div>
        </Button>
      </div>
    </div>
  );
}
