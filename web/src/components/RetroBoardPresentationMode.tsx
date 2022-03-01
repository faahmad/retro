import { ThumbUpIcon } from "@heroicons/react/outline";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/solid";
import * as React from "react";
import { useParams } from "react-router-dom";
import { useCurrentUser } from "../hooks/use-current-user";
import { useRetroItemsListener } from "../hooks/use-retro-items-listener";
import { RetroStateStatus, useRetroState } from "../hooks/use-retro-state";
import { RetroItem } from "../types/retro-item";

export function RetroBoardPresentationMode() {
  const params = useParams<{ retroId: string }>();
  const { data } = useRetroItemsListener(params.retroId);
  const { state: retro, handleChangePresentationIndex } = useRetroState(params.retroId);
  const retroItems = Object.values(data || {}).sort((a, b) => b.likeCount - a.likeCount);
  const currentUser = useCurrentUser();
  const isOwner = retro?.data?.createdById === currentUser?.data?.id;
  const index = retro?.data?.presentationModeIndex || 0;

  React.useEffect(() => {
    if (retro.status !== RetroStateStatus.LOADING) {
      // Reset the index to 0 on mount.
      handleChangePresentationIndex(0);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasPrevious = index !== undefined && index > 0;
  const hasNext = index !== undefined && index + 1 !== retroItems.length;
  const disabledStyles =
    "text-gray border-gray bg-white active:transform-0 hover:bg-white";

  if (!retroItems.length) {
    return (
      <div className="my-16 h-screen">
        <p className="text-xl text-blue">No Items</p>
      </div>
    );
  }

  return (
    <div className="mt-16 h-screen">
      <div className="max-w-3xl mx-auto">
        <React.Fragment>
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <p className="text-xs text-gray">
                {index! + 1} of {retroItems.length} - ordered by likes
              </p>
            </div>
            {isOwner ? (
              <div className="flex">
                <button
                  disabled={!hasPrevious}
                  onClick={() => handleChangePresentationIndex(index! - 1)}
                  className={`h-10 w-10 flex items-center justify-center bg-blue text-white border border-red text-2xl hover:bg-pink-1/2 active:transform-1 focus:outline-none ${
                    !hasPrevious ? disabledStyles : ""
                  }`}
                >
                  <ArrowLeftIcon className="h-8 w-8" />
                </button>

                {/* Spacer */}
                <div className="mx-2" />

                <button
                  disabled={!hasNext}
                  onClick={() => handleChangePresentationIndex(index! + 1)}
                  className={`h-10 w-10 flex items-center justify-center bg-blue text-white border border-red text-2xl hover:bg-pink-1/2 active:transform-1 focus:outline-none ${
                    !hasNext ? disabledStyles : ""
                  }`}
                >
                  <ArrowRightIcon className="h-8 w-8" />
                </button>
              </div>
            ) : null}
          </div>

          <RetroBoardPresentationCard retroItem={retroItems[index!]} />
        </React.Fragment>
      </div>
    </div>
  );
}

function RetroBoardPresentationCard({ retroItem }: { retroItem: RetroItem }) {
  const typeMap: any = {
    good: "went well",
    bad: "needs improvement",
    actions: "action item"
  };

  return (
    <div className="bg-white overflow-hidden shadow shadow-blue border border-blue divide-y divide-gray-200">
      <div className="px-4 py-5 sm:p-6">
        <p className="text-blue text-lg">{retroItem.content}</p>
      </div>
      <div className="px-4 py-4 sm:px-6">
        <div className="flex justify-between">
          <div className="flex items-center">
            <ThumbUpIcon className="text-gray h-6 w-6 mr-1" />
            <span className="text-gray">{retroItem.likeCount}</span>
          </div>
          <div className="text-sm bg-white text-blue border border-blue shadow shadow-blue p-1">
            {typeMap[retroItem.type]}
          </div>
        </div>
      </div>
    </div>
  );
}
