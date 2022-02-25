import * as React from "react";
import { RouteComponentProps, useHistory, useParams } from "react-router-dom";
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
import { useUserSettings } from "../components/RetroBoardUserSettings";
import { RetroBoardSidePanel } from "../components/RetroBoardSidePanel";

import { AdjustmentsIcon, ArrowSmLeftIcon } from "@heroicons/react/outline";
import { RetroBoardStageStepper } from "../components/RetroBoardStageStepper";
import { RetroBoardPresentationMode } from "../components/RetroBoardPresentationMode";

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
  const history = useHistory();

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

  const isOwner = data?.createdById === currentUser?.data?.id;

  if (status === RetroStateStatus.SUCCESS && data !== null) {
    return (
      <React.Fragment>
        <RetroBoardSidePanel isOpen={isSidePanelOpen} toggle={handleToggleSidePanel} />

        <PageContainer
          className={settings?.isFullscreen ? "my-8 px-8 m-auto" : "my-8 px-8 m-auto"}
        >
          <button
            onClick={() => history.goBack()}
            className="h-10 w-10 mb-4 flex items-center justify-center bg-white text-blue text-2xl hover:bg-pink-1/2 active:transform-1 focus:outline-none"
          >
            <ArrowSmLeftIcon className="h-8 w-8" />
          </button>
          <div className="flex text-blue items-center justify-between mb-8">
            <RetroHeader name={data.name} createdAt={data.createdAt} />
            {isOwner ? (
              <button
                onClick={handleToggleSidePanel}
                className="h-10 w-10 flex items-center justify-center bg-blue text-white ml-3 border border-red shadow shadow-red text-2xl hover:bg-pink-1/2 active:transform-1 focus:outline-none"
              >
                <AdjustmentsIcon className="h-8 w-8" />
              </button>
            ) : null}
          </div>
          {isOwner ? (
            <div className="flex justify-between items-center flex-wrap">
              <div className="mr-4">
                <RetroBoardStageStepper retroId={params.retroId} />
              </div>
              {data?.stage === "Brainstorm" || data?.stage === "Vote" ? (
                <RetroBoardActions
                  retroId={data.id}
                  onSortByLikes={handleSortAllItemsByLikes}
                />
              ) : null}
            </div>
          ) : null}
          {data?.stage === "Discuss" ? (
            <RetroBoardPresentationMode />
          ) : (
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
          )}
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
      <h1 className="text-2xl font-bold">{name || "Retro Board"}</h1>
      <span className="text-xs font-normal">
        Created {moment(createdAt.toDate()).format("L")}
      </span>
    </div>
  );
}
