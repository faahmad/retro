import * as React from "react";
import { Button } from "./Button";
import { RetroCountdownTimer } from "./RetroCountdownTimer";
import { useRetroCountdownTimer } from "../hooks/use-retro-countdown-timer";

interface RetroBoardActionsProps {
  retroId: string;
}

export function RetroBoardActions(props: RetroBoardActionsProps) {
  const timer = useRetroCountdownTimer(props.retroId);

  return (
    <div className="flex">
      <div className="flex p-4 mb-4 border border-red items-center justify-center">
        <Button
          style={{ width: "10rem" }}
          className={`text-blue w-20 ml-4 ${
            timer.isTimerOpen ? "bg-blue text-white" : ""
          }`}
          onClick={timer.toggleTimer}
        >
          <div className="flex items-end justify-center w-full">
            <span className="mr-1">{timer.isTimerOpen ? "Cancel" : "Timer"}</span>
          </div>
        </Button>
        <div className="ml-2">
          {timer.isTimerOpen ? <RetroCountdownTimer timer={timer} /> : null}
        </div>
      </div>
    </div>
  );
}
