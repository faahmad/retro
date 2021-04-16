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

export const RetroBoardPage: React.FC<RouteComponentProps> = () => {
  useAnalyticsPage(AnalyticsPage.RETRO_BOARD);
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
    handleDeleteItem
  } = useRetroState(params.retroId);
  const workspaceState = useWorkspaceState();
  const { data, status, error } = state;

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
        <PageContainer>
          <RetroHeader
            id={data.id}
            name={data.name}
            createdAt={data.createdAt}
            ownerId={data.createdById}
          />
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
