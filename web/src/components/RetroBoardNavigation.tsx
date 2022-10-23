/* This example requires Tailwind CSS v2.0+ */
import React from "react";
import { ClockIcon, CogIcon, MenuAlt1Icon } from "@heroicons/react/outline";
import { LinkIcon } from "@heroicons/react/solid";
import { RetroBoardStageStepper } from "./RetroBoardStageStepper";
import moment from "moment";
import { useRetroCountdownTimer } from "../hooks/use-retro-countdown-timer";
import { RetroCountdownTimer } from "./RetroCountdownTimer";
import { UserMenu } from "./UserMenu";

export function RetroBoardNavigation(props: any) {
  const timer = useRetroCountdownTimer(props.retroId);
  const [isCopied, setIsCopied] = React.useState(false);
  async function handleCopyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }

  return (
    <nav className="bg-white border-b border-blue py-1">
      <>
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20 justify-between">
            <div>
              <div className="flex items-center my-2">
                {/* Logo & Name */}
                <div className="flex items-center">
                  <button
                    onClick={props.handleToggleSidePanel}
                    className="h-8 w-8 flex items-center justify-center shadow-red bg-blue text-white border border-red hover:bg-pink-1/2 active:transform-1 focus:outline-none"
                  >
                    {props.isFacilitator ? (
                      <CogIcon className="h-6 w-6" />
                    ) : (
                      <MenuAlt1Icon className="h-6 w-6" />
                    )}
                  </button>
                </div>
                <div className="hidden md:ml-4 md:mr-2 md:block">
                  <div>
                    <h2 className="text-blue text-sm">{props.name}</h2>
                    <p className="text-xs text-gray">
                      {props.workspaceName} &#11825;{" "}
                      {moment(props.createdAt.toDate()).format("L")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stepper */}
            <div className="flex flex-col items-center">
              <RetroBoardStageStepper
                isOwner={props.isFacilitator}
                retroId={props.retroId}
              />
              <span className="inline-flex items-center rounded-md bg-grayLight px-2 py-0.5 text-sm font-medium text-gray mt-1">
                {props.isFacilitator
                  ? "✨ You are the facilitator ✨"
                  : "You are a guest"}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center">
              <div
                className={`mr-2 ease-in-out shadow-blue ${
                  timer.isTimerOpen ? "absolute" : "hidden"
                }`}
                style={{ top: "70px", right: "160px" }}
              >
                <RetroCountdownTimer timer={timer} />
              </div>
              <div className="flex">
                <button
                  type="button"
                  className="p-1 bg-blue text-white hover:bg-pink focus:outline-none"
                  onClick={timer.toggleTimer}
                >
                  <span className="sr-only">Timer</span>
                  <ClockIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="block flex-shrink-0 ml-4">
                <button
                  onClick={handleCopyLink}
                  type="button"
                  className="h-8 w-32 text-center inline-flex content-center items-center bg-blue text-white hover:bg-pink px-2 py-1 text-sm focus:outline-none"
                >
                  <LinkIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                  <span>{isCopied ? "Copied!" : "Copy link"}</span>
                </button>
              </div>
              <div className="ml-4">
                <UserMenu isFacilitator={props.isFacilitator} />
              </div>
            </div>
          </div>
        </div>
      </>
    </nav>
  );
}
