import * as React from "react";
import { PageContainer } from "../components/PageContainer";
import { ChatIcon, FlagIcon, StarIcon, ThumbUpIcon } from "@heroicons/react/solid";
import { CalendarIcon } from "@heroicons/react/outline";
import { useActionItemHelpers } from "../hooks/use-action-item-helpers";
import { useParams } from "react-router-dom";
import { useRetroState } from "../hooks/use-retro-state";
import { ActionItemI } from "../types/action-item";
import { Retro } from "../types/retro";
import moment from "moment";
import { UserAvatar } from "../components/UserAvatar";
import { useRetroItemsListener } from "../hooks/use-retro-items-listener";
import { useGetWorkspace } from "../hooks/use-get-workspace";
import { RetroItem } from "../types/retro-item";
import { WorkspaceUsersMap } from "../types/workspace-user";
import { LoadingPage } from "./LoadingPage";

export function RetroReviewPage() {
  const params = useParams<{ retroId: string }>();
  const { data } = useRetroItemsListener(params.retroId);
  const retroItems = Object.values(data || {});
  const { state: retro } = useRetroState(params.retroId);
  const workspaceState = useGetWorkspace();
  const { actionItems } = useActionItemHelpers(workspaceState.id);

  if (!retro.data) {
    return (
      <PageContainer>
        <LoadingPage />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Stats retroItems={retroItems} retro={retro.data} actionItems={actionItems} />
      <Participants userIds={retro.data.userIds} workspaceUsers={workspaceState.users} />
      <ActionItems retroId={params.retroId} actionItems={actionItems} />
    </PageContainer>
  );
}

export function Stats(props: {
  retro: Retro;
  retroItems: RetroItem[];
  actionItems: ActionItemI[];
}) {
  const retroId = props.retro.id;

  // Action items
  const newActionItemsCount = props.actionItems.filter((item) => item.retroId === retroId)
    .length;
  const existingOpenActionItemsCount = props.actionItems.filter(
    (item) => item.retroId !== retroId && item.status === "open"
  ).length;

  // Votes
  const voteCount = props.retroItems.reduce((count, item) => {
    count += item.likeCount;
    return count;
  }, 0);
  const participationMap = props.retroItems.reduce((map, item) => {
    return Object.assign({}, map, item.likedBy);
  }, {});
  const participantCount = Object.keys(participationMap).length;

  // Ideas
  const { goodCount, badCount } = props.retro.retroItemsData;
  function getItemCountSubtitle({
    goodCount,
    badCount
  }: {
    goodCount: number;
    badCount: number;
  }) {
    let subtitles = [];

    if (goodCount) {
      subtitles.push(`${goodCount} went well`);
    }

    if (badCount) {
      subtitles.push(`${badCount} improvements`);
    }

    if (!subtitles.length) {
      return "no ideas";
    }

    return subtitles.join(", ");
  }

  const stats = [
    {
      id: 1,
      name: "ideas added",
      stat: props.retroItems.length,
      icon: ChatIcon,
      subtitle: getItemCountSubtitle({ goodCount, badCount })
    },
    {
      id: 2,
      name: "votes cast",
      stat: voteCount,
      icon: ThumbUpIcon,
      subtitle: `by ${participantCount} ${participantCount === 1 ? "person" : "people"}`
    },
    {
      id: 3,
      name: "new actions",
      stat: newActionItemsCount,
      icon: FlagIcon,
      subtitle: `${existingOpenActionItemsCount} existing`
    }
  ];

  return (
    <div>
      <h3 className="text-lg text-blue font-medium leading-6 text-gray-900">Summary</h3>

      <dl className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.id}
            className="relative text-blue border border-blue overflow-hidden rounded-lg bg-white px-4 pt-5 shadow sm:px-6 sm:pt-6"
          >
            <dt className="flex">
              <div className="absolute rounded-md bg-blue p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
            </dt>
            <dd className="ml-16 pb-6 sm:pb-7">
              <p className="truncate text-sm font-medium flex items-baseline">
                <span className="text-2xl font-semibold mr-2">{item.stat}</span>
                {item.name}
              </p>
              {item.subtitle && (
                <p className="text-xs font-medium text-gray">{item.subtitle}</p>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Participants(props: {
  userIds: Retro["userIds"];
  workspaceUsers: WorkspaceUsersMap;
}) {
  const users = Object.keys(props.userIds).map((userId) => props.workspaceUsers[userId]);

  return (
    <div className="mt-8">
      <h3 className="text-lg text-blue font-medium leading-6">Participants</h3>

      <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-4 text-blue">
        {users.map((user) => (
          <div
            key={user?.userId}
            className="relative flex items-center rounded-lg border border-blue bg-white px-3 py-2"
          >
            <div className="flex-shrink-0">
              <UserAvatar
                photoURL={user?.userPhotoURL as string}
                displayName={user?.userDisplayName as string}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="focus:outline-none">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium">{user?.userDisplayName}</p>
                {user?.userRole === "owner" && (
                  <p className="truncate text-xs text-gray">Facilitator</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionItems({
  actionItems,
  retroId
}: {
  actionItems: ActionItemI[];
  retroId: Retro["id"];
}) {
  const openActionItems: ActionItemI[] = actionItems.filter(
    (actionItem: ActionItemI) => actionItem.status === "open"
  );

  return (
    <div className="mt-8 mb-16 bg-white text-blue">
      <h3 className="text-lg text-blue font-medium leading-6 text-gray-900">
        Action items
      </h3>

      <ul className="mt-2 divide-y divide-gray-200">
        {openActionItems.map((actionItem) => (
          <li key={actionItem.id}>
            <div className="block border border-blue">
              <div className="flex items-center px-4 py-4 sm:px-6">
                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                  <div className="truncate">
                    <div className="flex text-sm">
                      <p className="truncate font-medium">{actionItem.content}</p>
                    </div>
                    <div className="mt-2 flex">
                      <div className="flex items-center text-xs text-gray">
                        <CalendarIcon
                          className="mr-1 h-4 w-4 flex-shrink-0 text-gray"
                          aria-hidden="true"
                        />
                        <p>
                          Created{" "}
                          <time dateTime={actionItem.createdAt.toDate()}>
                            {moment(actionItem.createdAt.toDate()).format("L")}
                          </time>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-5 flex-shrink-0">
                  {actionItem.retroId === retroId ? (
                    <span className="inline-flex items-center rounded-full bg-pink-1/2 px-2 py-1 text-xs font-medium text-gray-800">
                      <StarIcon className="mr-1 h-2 w-2 text-blue" /> New
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
