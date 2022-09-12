import * as React from "react";
import { CheckIcon } from "@heroicons/react/solid";
import { RetroStateStatus, useRetroState } from "../hooks/use-retro-state";

export type RetroStep = {
  id: string;
  name: "Reflect" | "Vote" | "Discuss" | "Review";
  status: "current" | "upcoming" | "complete";
};

// Eventually we will have more stages, but for now only supporting
// Brainstorm and Vote.
const steps: RetroStep[] = [
  { id: "01", name: "Reflect", status: "current" },
  // { id: "02", name: "Group",  status: "upcoming" },
  { id: "02", name: "Vote", status: "upcoming" },
  { id: "03", name: "Discuss", status: "upcoming" },
  { id: "04", name: "Review", status: "upcoming" }
];

function reducer(
  state: RetroStep[],
  action: { type: string; payload: RetroStep["name"] }
): RetroStep[] {
  switch (action.type) {
    case "change": {
      const index = steps.findIndex((step) => step.name === action.payload);
      return state.map((step, stepIdx) => {
        if (stepIdx === index) {
          return { ...step, status: "current" };
        }
        if (stepIdx < index) {
          return { ...step, status: "complete" };
        }
        if (stepIdx > index) {
          return { ...step, status: "upcoming" };
        }
        return step;
      });
    }
    default: {
      return state;
    }
  }
}

export function RetroBoardStageStepper({
  retroId,
  isOwner
}: {
  retroId: string;
  isOwner: boolean;
}) {
  const { state: retro, handleChangeStage } = useRetroState(retroId);
  const retroStage = retro?.data?.stage;
  const [state, dispatch] = React.useReducer(reducer, steps);

  React.useEffect(() => {
    if (retro.status !== RetroStateStatus.LOADING && !retroStage) {
      // retroStage isn't present on older retros, so we default to brainstorm
      // for backwards compatibility.
      handleChangeStage("Reflect");
      return;
    }
    dispatch({ type: "change", payload: retroStage! });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retro.status, retroStage]);

  return (
    <nav aria-label="retro-stage">
      <ol className="md:flex md:divide-y-0">
        {state.map((step, stepIdx) => (
          <li
            key={step.name}
            className="relative md:flex-1 md:flex"
            onClick={() => {
              if (!isOwner) {
                return;
              }
              handleChangeStage(step.name);
            }}
          >
            {step.status === "complete" ? (
              <div className="group flex items-center w-full">
                <span className="px-3 py-2 flex items-center text-sm font-medium">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue rounded-full group-hover:bg-blue">
                    <CheckIcon className="w-6 h-6 text-white" aria-hidden="true" />
                  </span>
                  <span
                    className={`ml-2 text-sm font-medium text-blue ${
                      isOwner ? "hover:underline cursor-pointer" : ""
                    }`}
                  >
                    {step.name}
                  </span>
                </span>
              </div>
            ) : step.status === "current" ? (
              <div
                className="px-3 py-2 flex items-center text-sm font-medium"
                aria-current="step"
              >
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center border-2 border-blue rounded-full">
                  <span className="text-blue">{step.id}</span>
                </span>
                <span
                  className={`ml-2 text-sm font-medium text-blue ${
                    isOwner ? "hover:underline cursor-pointer" : ""
                  }`}
                >
                  {step.name}
                </span>
              </div>
            ) : (
              <div className="group flex items-center">
                <span className="px-3 py-2 flex items-center text-sm font-medium ">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center border-2 border-gray rounded-full">
                    <span className="text-gray">{step.id}</span>
                  </span>
                  <span
                    className={`ml-2 text-sm font-medium text-gray group-hover:text-gray ${
                      isOwner ? "hover:underline cursor-pointer" : ""
                    }`}
                  >
                    {step.name}
                  </span>
                </span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
