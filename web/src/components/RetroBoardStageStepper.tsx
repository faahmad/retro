import * as React from "react";
import { CheckIcon } from "@heroicons/react/solid";
import { useRetroState } from "../hooks/use-retro-state";

export type RetroStep = {
  id: string;
  name: "Brainstorm" | "Vote" | "Discuss";
  status: "current" | "upcoming" | "complete";
};

// Eventually we will have more stages, but for now only supporting
// Brainstorm and Vote.
const steps: RetroStep[] = [
  { id: "01", name: "Brainstorm", status: "current" },
  // { id: "02", name: "Group",  status: "upcoming" },
  { id: "02", name: "Vote", status: "upcoming" },
  { id: "03", name: "Discuss", status: "upcoming" }
  // { id: "05", name: "Review",  status: "upcoming" }
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

export function RetroBoardStageStepper({ retroId }: { retroId: string }) {
  const { state: retro, handleChangeStage } = useRetroState(retroId);
  const retroStage = retro?.data?.stage;
  const [state, dispatch] = React.useReducer(reducer, steps);

  React.useEffect(() => {
    if (!retroStage) {
      // retroStage isn't present on older retros, so we default to brainstorm
      // for backwards compatibility.
      handleChangeStage("Brainstorm");
      return;
    }
    dispatch({ type: "change", payload: retroStage });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retroStage]);

  return (
    <nav aria-label="retro-stage">
      <ol className="border border-gray divide-y divide-gray md:flex md:divide-y-0">
        {state.map((step, stepIdx) => (
          <li
            key={step.name}
            className="relative md:flex-1 md:flex"
            onClick={() => handleChangeStage(step.name)}
          >
            {step.status === "complete" ? (
              <div className="group flex items-center w-full">
                <span className="px-6 py-4 flex items-center text-sm font-medium">
                  <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue rounded-full group-hover:bg-blue">
                    <CheckIcon className="w-6 h-6 text-white" aria-hidden="true" />
                  </span>
                  <span className="ml-4 text-sm font-medium text-blue hover:underline">
                    {step.name}
                  </span>
                </span>
              </div>
            ) : step.status === "current" ? (
              <div
                className="px-6 py-4 flex items-center text-sm font-medium"
                aria-current="step"
              >
                <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-blue rounded-full">
                  <span className="text-blue">{step.id}</span>
                </span>
                <span className="ml-4 text-sm font-medium text-blue hover:underline">
                  {step.name}
                </span>
              </div>
            ) : (
              <div className="group flex items-center">
                <span className="px-6 py-4 flex items-center text-sm font-medium ">
                  <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-gray rounded-full">
                    <span className="text-gray">{step.id}</span>
                  </span>
                  <span className="ml-4 text-sm font-medium text-gray group-hover:text-gray hover:underline">
                    {step.name}
                  </span>
                </span>
              </div>
            )}

            {stepIdx !== steps.length - 1 ? (
              <>
                {/* Arrow separator for lg screens and up */}
                <div
                  className="hidden md:block absolute top-0 right-0 h-full w-5"
                  aria-hidden="true"
                >
                  <svg
                    className="h-full w-full text-gray"
                    viewBox="0 0 22 80"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 -2L20 40L0 82"
                      vectorEffect="non-scaling-stroke"
                      stroke="currentcolor"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
