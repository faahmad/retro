import * as React from "react";
import { RouteComponentProps, useParams } from "react-router-dom";
import moment from "moment";
import { Footer } from "../components/Footer";
import { PageContainer } from "../components/PageContainer";
import { useRetroState, RetroStateStatus } from "../hooks/use-retro-state";
import { Retro } from "../types/retro";
import {
  useRetroItemsListener,
  RetroItemsListenerStatus
} from "../hooks/use-retro-items-listener";
import { RetroBoard } from "../components/RetroBoard";
import { useGetWorkspace, WorkspaceStateStatus } from "../hooks/use-get-workspace";
import { AnalyticsPage, useAnalyticsPage } from "../hooks/use-analytics-page";
import { AnalyticsEvent, useAnalyticsEvent } from "../hooks/use-analytics-event";
import { useCurrentUser } from "../hooks/use-current-user";
import { RetroItemsMap, RetroItem } from "../types/retro-item";
import { RetroColumnType } from "../types/retro-column";
import { RetroBoardActions } from "../components/RetroBoardActions";
import {
  RetroBoardUserSettings,
  useUserSettings
} from "../components/RetroBoardUserSettings";
import { RetroBoardSidePanel } from "../components/RetroBoardSidePanel";

import { AdjustmentsIcon } from "@heroicons/react/outline";

export const RetroBoardPage: React.FC<RouteComponentProps> = () => {
  useAnalyticsPage(AnalyticsPage.RETRO_BOARD);
  const trackEvent = useAnalyticsEvent();
  const params = useParams<{ retroId: Retro["id"] }>();
  // Important! useRetroItemsListener has to come first!
  // Not the best, I know. But it's MVP!
  const retroItems = useRetroItemsListener(params.retroId);
  const {
    state,
    handleAddItem,
    handleDragDrop,
    handleEditItem,
    handleLikeItem,
    handleUnlikeItem,
    handleDeleteItem,
    handleUpdateColumnItems
  } = useRetroState(params.retroId);
  const workspaceState = useGetWorkspace();
  const { data, status, error } = state;
  const { settings } = useUserSettings();
  const currentUser = useCurrentUser();

  // add conditional, if (currentUser.auth === null) return <userNameModal/>
  /**
   * Current thought process:

    link takes the user to workspace
    if not authed, then a modal opens prompting for a username (coniditonal in the RetroBoardPage component)
    on submission create an anon user with username
    then get returning userId and create a workspace_user with workspaceId and userId
   */

  const [isSidePanelOpen, setIsSidePanelOpen] = React.useState(false);
  function handleToggleSidePanel() {
    setIsSidePanelOpen(!isSidePanelOpen);
  }

  const sortByLikes = (retroItems: RetroItemsMap, retroItemIds: RetroItem["id"][]) => {
    return retroItemIds.sort((a, b) => retroItems[b].likeCount - retroItems[a].likeCount);
  };
  const getColumnItems = (columnType: RetroColumnType) => {
    if (!data) {
      return [];
    }
    return data.columns[columnType].retroItemIds;
  };

  const handleSortAllItemsByLikes = () => {
    if (!retroItems.data || !data) {
      return;
    }
    const updateColumnItemsInput = {
      [RetroColumnType.GOOD]: sortByLikes(
        retroItems.data,
        getColumnItems(RetroColumnType.GOOD)
      ),
      [RetroColumnType.BAD]: sortByLikes(
        retroItems.data,
        getColumnItems(RetroColumnType.BAD)
      ),
      [RetroColumnType.ACTIONS]: sortByLikes(
        retroItems.data,
        getColumnItems(RetroColumnType.ACTIONS)
      ),
      [RetroColumnType.QUESTIONS]: sortByLikes(
        retroItems.data,
        getColumnItems(RetroColumnType.QUESTIONS)
      )
    };
    trackEvent(AnalyticsEvent.RETRO_ITEMS_SORTED, {
      method: "likeCount"
    });
    handleUpdateColumnItems(updateColumnItemsInput);
    return;
  };

  if (
    status === RetroStateStatus.LOADING ||
    retroItems.status === RetroItemsListenerStatus.LOADING ||
    workspaceState.status === WorkspaceStateStatus.LOADING
  ) {
    return (
      <PageContainer>
        <p className="text-blue">Fetching retro...</p>
      </PageContainer>
    );
  }

  if (status === RetroStateStatus.ERROR) {
    return (
      <PageContainer>
        <p className="text-blue">{error?.message}</p>
      </PageContainer>
    );
  }

  if (status === RetroStateStatus.SUCCESS && data !== null) {
    return (
      <React.Fragment>
        <RetroBoardSidePanel isOpen={isSidePanelOpen} toggle={handleToggleSidePanel} />
        <PageContainer
          className={settings?.isFullscreen ? "my-16 px-8 m-auto" : undefined}
        >
          <div className="flex text-blue items-baseline justify-between mb-8">
            <RetroHeader name={data.name} createdAt={data.createdAt} />
            {data?.createdById === currentUser?.data?.id ? (
              <button
                onClick={handleToggleSidePanel}
                className="h-10 w-10 flex items-center justify-center bg-blue text-white ml-3 border border-red shadow shadow-red text-2xl hover:bg-pink-1/2 active:transform-1 focus:outline-none"
              >
                <AdjustmentsIcon className="h-8 w-8" />
              </button>
            ) : null}
          </div>
          <div className="flex justify-between flex-wrap">
            <RetroBoardActions
              retroId={data.id}
              onSortByLikes={handleSortAllItemsByLikes}
            />
            <RetroBoardUserSettings />
          </div>
          <RetroBoard
            retroState={state}
            users={workspaceState.users}
            retroItems={retroItems.data}
            onAddItem={handleAddItem}
            onDeleteItem={handleDeleteItem}
            onEditItem={(retroItemId, content) =>
              handleEditItem({ content, id: retroItemId })
            }
            onLikeItem={handleLikeItem}
            onUnlikeItem={handleUnlikeItem}
            onDragDrop={handleDragDrop}
          />
        </PageContainer>
        <Footer />
      </React.Fragment>
    );
  }

  // This should never happen TBH.
  return null;
};

interface RetroHeaderProps {
  name: string;
  createdAt: any;
}
function RetroHeader({ name, createdAt }: RetroHeaderProps) {
  // const [localName, setLocalName] = React.useState(name);
  // const handleOnChange = (event: any) => {
  //   return setLocalName(event.currentTarget.value);
  // };

  // const [isEditing, setisEditing] = React.useState(false);
  // const handleToggleEditing = () => {
  //   return setisEditing((prevState) => !prevState);
  // };
  // const inputRef = React.useRef(null);
  // React.useEffect(() => {
  //   if (isEditing) {
  //     // @ts-ignore
  //     inputRef.current.focus();
  //   }
  // }, [isEditing]);

  // const updateRetro = useUpdateRetro();
  // const trackEvent = useAnalyticsEvent();
  // const currentUser = useCurrentUser();
  // const handleSave = async () => {
  //   await updateRetro(id, { name: localName });
  //   trackEvent(AnalyticsEvent.RETRO_UPDATED, {
  //     retroId: id,
  //     createdAt,
  //     fields: ["name"],
  //     location: AnalyticsPage.RETRO_BOARD,
  //     updatedBy: currentUser.auth?.uid === ownerId ? "retro-owner" : "member"
  //   });
  //   handleToggleEditing();
  //   return;
  // };

  return (
    <div className="flex flex-col flex-grow flex-nowrap">
      <h1 className="text-4xl font-bold">{name || "Retro Board"}</h1>
      <span className="text-xs font-normal">
        Created {moment(createdAt.toDate()).format("L")}
      </span>
    </div>
  );
}
