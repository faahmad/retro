import { ThumbUpIcon } from "@heroicons/react/outline";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  XCircleIcon
} from "@heroicons/react/solid";
import * as React from "react";
import { useParams } from "react-router-dom";
import { useActionItemHelpers } from "../hooks/use-action-item-helpers";
import { useCurrentUser } from "../hooks/use-current-user";
import { useRetroItemsListener } from "../hooks/use-retro-items-listener";
import { RetroStateStatus, useRetroState } from "../hooks/use-retro-state";
import { RetroItem } from "../types/retro-item";
import { ActionItemI } from "../types/action-item";
import moment from "moment";

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

  if (!retro.data) {
    return (
      <div className="my-16 h-screen">
        <p className="text-xl text-blue">Loading...</p>
      </div>
    );
  }

  if (!retroItems.length) {
    return (
      <div className="my-16 h-screen">
        <p className="text-xl text-blue">No Items</p>
      </div>
    );
  }

  return (
    <div className="mt-16 h-screen flex w-max">
      <div className="max-w-3xl w-full">
        <React.Fragment>
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <p className="text-xs text-gray">
                {index! + 1} of {retroItems.length} - ordered by votes
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
      <div className="w-8 w-full p-8">
        <ActionItemsList
          isOwner={isOwner}
          workspaceId={retro.data.workspaceId}
          retroId={retro.data.id}
        />
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

export function ActionItemsList({
  retroId,
  workspaceId,
  isOwner,
  hideForm
}: {
  retroId?: string;
  workspaceId: string;
  isOwner: boolean;
  hideForm?: boolean;
}) {
  const [showCompleted, setShowCompleted] = React.useState(false);
  const { actionItems, createActionItem, toggleActionItemStatus } = useActionItemHelpers(
    workspaceId
  );

  async function handleSubmit(event: any) {
    if (!retroId) {
      return;
    }

    event.preventDefault();
    const form = event.target;
    await createActionItem({ content: form.content.value, workspaceId, retroId });
    form.reset();
    return;
  }

  return (
    <>
      <div className="border border-blue p-4">
        <div className="mb-4">
          <h3 className="text-xl text-blue">Team actions</h3>
          <p className="text-gray">Actions we agree to take on as a team.</p>
        </div>

        {isOwner && !hideForm && (
          <form className="mb-4" onSubmit={handleSubmit}>
            <label htmlFor="content" className="block text-sm font-medium text-blue">
              Action item
            </label>
            <div className="flex mt-1">
              <input
                type="text"
                name="content"
                id="content"
                className="shadow-sm block w-full border border-blue h-12 px-2"
                placeholder="What do we need to do?"
              />
              <button
                type="submit"
                className="border border-blue px-4 text-white bg-blue"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>

      <div
        style={{ maxHeight: "75%" }}
        className="border border-blue p-4 overflow-scroll"
      >
        <div className="mb-3 space-y-5">
          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <input
                id="showCompleted"
                name="showCompleted"
                aria-describedby="showCompleted-description"
                type="checkbox"
                className="h-4 w-4 text-red border-white"
                checked={showCompleted}
                onChange={(event) => {
                  setShowCompleted(event.target.checked);
                }}
              />
            </div>
            <div className="pl-2 text-sm">
              <label htmlFor="showCompleted" className="font-bold text-blue">
                Show completed
              </label>
            </div>
          </div>
        </div>
        {actionItems.length ? (
          <ul>
            {actionItems
              .filter((item: ActionItemI) => {
                if (showCompleted) {
                  return item;
                }
                return item.status === "open";
              })
              .map((item: ActionItemI) => {
                let createdAt = item?.createdAt?.toDate();
                return (
                  <li
                    key={item.id}
                    className={`border border-blue p-2 mb-2 ${
                      item.status === "complete" ? "bg-green" : ""
                    }`}
                  >
                    <div className="flex">
                      <button
                        className="mr-2"
                        disabled={!isOwner}
                        onClick={() => {
                          toggleActionItemStatus(item.id, item.status);
                        }}
                      >
                        {item.status === "open" ? (
                          <CheckCircleIcon className="text-green h-6 w-6" />
                        ) : (
                          <XCircleIcon className="text-blue h-6 w-6" />
                        )}
                      </button>

                      <div>
                        <p className="text-blue text-sm">{item.content}</p>
                        {createdAt && (
                          <p className="text-gray text-xs">
                            Created {moment(createdAt).format("L")}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
          </ul>
        ) : (
          <p className="text-gray text-xs">...</p>
        )}
      </div>
    </>
  );
}
