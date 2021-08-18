import * as React from "react";
import { RouteComponentProps, useParams } from "react-router-dom";
import moment from "moment";
import { Footer } from "../components/Footer";
import { PageContainer } from "../components/PageContainer";
import { useRetroState, RetroStateStatus } from "../hooks/use-retro-state";
import { Retro } from "../types/retro";
import { useUpdateRetro } from "../hooks/use-update-retro";
import {
  useRetroItemsListener,
  RetroItemsListenerStatus
} from "../hooks/use-retro-items-listener";
import { RetroBoard } from "../components/RetroBoard";
import { useWorkspaceState } from "../hooks/use-workspace-state";
import { WorkspaceStateStatus } from "../contexts/WorkspaceStateContext";
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
  const workspaceState = useWorkspaceState();
  const { data, status, error } = state;
  const { settings } = useUserSettings();

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
        <PageContainer
          className={settings?.isFullscreen ? "my-16 px-8 m-auto" : undefined}
        >
          <RetroHeader
            id={data.id}
            name={data.name}
            createdAt={data.createdAt}
            ownerId={data.createdById}
          />
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
  id: string;
  name: string;
  createdAt: any;
  ownerId: string;
}
function RetroHeader({ id, name, createdAt, ownerId }: RetroHeaderProps) {
  const [localName, setLocalName] = React.useState(name);
  const handleOnChange = (event: any) => {
    return setLocalName(event.currentTarget.value);
  };

  const [isEditing, setisEditing] = React.useState(false);
  const handleToggleEditing = () => {
    return setisEditing((prevState) => !prevState);
  };
  const inputRef = React.useRef(null);
  React.useEffect(() => {
    if (isEditing) {
      // @ts-ignore
      inputRef.current.focus();
    }
  }, [isEditing]);

  const updateRetro = useUpdateRetro();
  const trackEvent = useAnalyticsEvent();
  const currentUser = useCurrentUser();
  const handleSave = async () => {
    await updateRetro(id, { name: localName });
    trackEvent(AnalyticsEvent.RETRO_UPDATED, {
      retroId: id,
      createdAt,
      fields: ["name"],
      location: AnalyticsPage.RETRO_BOARD,
      updatedBy: currentUser.auth?.uid === ownerId ? "retro-owner" : "member"
    });
    handleToggleEditing();
    return;
  };

  return (
    <div className="flex text-blue items-baseline justify-between mb-8">
      <div className="flex flex-col flex-grow flex-nowrap">
        {!isEditing ? (
          <h1 className="text-4xl font-bold">{name || "Retro Board"}</h1>
        ) : (
          <input
            ref={inputRef}
            type="text"
            name="name"
            value={localName}
            onChange={handleOnChange}
            className="border border-red my-1 h-12 w-4/5 lg:w-full max-w-md outline-none text-xl px-1"
          />
        )}
        <span className="text-xs font-normal">
          Created {moment(createdAt.toDate()).format("L")}
        </span>
      </div>
      {!isEditing ? (
        <button
          aria-label="edit title button"
          className="flex items-center px-4 border border blue"
          onClick={handleToggleEditing}
        >
          <span>Edit</span>
        </button>
      ) : (
        <button
          className="flex items-center px-4 bg-blue text-white"
          onClick={handleSave}
        >
          Save
        </button>
      )}
    </div>
  );
}
