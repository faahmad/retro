/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import * as React from "react";
import { DragDropContext, Draggable, DropResult, Droppable } from "react-beautiful-dnd";
import Linkify from "react-linkify";
import analytics from "analytics.js";
// Hooks
import { useCurrentUser } from "../hooks/use-current-user";
// Components
import { AddButton } from "../components/AddButton";
import { LoadingText } from "../components/LoadingText";
import { UserAvatar } from "../components/UserAvatar";
import { ThumbsUpIcon } from "../components/ThumbsUpIcon";
import { PencilEditIcon } from "../components/PencilEditIcon";
// Types
import { RetroItem, RetroItemsMap } from "../types/retro-item";
import { RetroColumnType, RetroColumn } from "../types/retro-column";
import { RetroStateValues, RetroStateStatus } from "../hooks/use-retro-state";
import { RetroItemModal } from "./RetroItemModal";
import { WorkspaceUser, WorkspaceUsersMap } from "../types/workspace-user";
import { User } from "../types/user";
import { AnalyticsEvent, useAnalyticsEvent } from "../hooks/use-analytics-event";

interface RetroBoardProps {
  retroState: RetroStateValues;
  users: WorkspaceUsersMap;
  retroItems: RetroItemsMap | null;
  onAddItem: ({
    content,
    type,
    workspaceId
  }: {
    content: RetroItem["content"];
    type: RetroItem["type"];
    workspaceId: RetroItem["workspaceId"];
  }) => void;
  onEditItem: (retroItemId: RetroItem["id"], content: RetroItem["content"]) => void;
  onDragDrop: any;
  onLikeItem: any;
  onUnlikeItem: any;
}

export function RetroBoard({
  retroState,
  users,
  retroItems,
  onAddItem,
  onEditItem,
  onLikeItem,
  onUnlikeItem,
  onDragDrop
}: RetroBoardProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [
    columnTypeToAddItemTo,
    setColumnTypeToAddItemTo
  ] = React.useState<RetroColumnType>(RetroColumnType.GOOD);
  const [retroItem, setRetroItem] = React.useState<RetroItem | null>(null);
  const trackEvent = useAnalyticsEvent();

  if (retroState.status === RetroStateStatus.LOADING) {
    return <LoadingText />;
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    trackEvent(AnalyticsEvent.RETRO_ITEM_MODAL_CLOSED);
  };

  /**
   * Opens the creation modal.
   */
  const handleOnClickAdd = (columnType: RetroColumnType) => {
    setRetroItem(null);
    setColumnTypeToAddItemTo(columnType);
    setIsModalOpen(true);
    trackEvent(AnalyticsEvent.RETRO_ITEM_MODAL_OPENED);
    return;
  };

  /**
   * Creates a new item.
   */
  const handleAddItem = ({
    content,
    type
  }: {
    content: RetroItem["content"];
    type: RetroItem["type"];
  }) => {
    if (!retroState.data) {
      return;
    }
    return onAddItem({ content, type, workspaceId: retroState.data.workspaceId });
  };

  /**
   * Opens the edit modal.
   */
  const handleOnClickEdit = (retroItem: RetroItem) => {
    setColumnTypeToAddItemTo(retroItem.type);
    setRetroItem(retroItem);
    setIsModalOpen(true);
  };

  /**
   * Edits an existing item.
   */
  const handleEditItem = (retroItemId: RetroItem["id"], content: string) => {
    onEditItem(retroItemId, content);
    return;
  };

  // const handleDeleteItem = () => {
  //   return Promise.resolve();
  // };

  const handleOnDragEnd = (dropResult: DropResult) => {
    const { destination, source, draggableId: retroItemId } = dropResult;

    // Invalid.
    if (!destination || !retroState || !retroState.data) {
      return;
    }

    const prevColumnType = source.droppableId;
    const nextColumnType = destination.droppableId;

    // If you drag and drop in the same exact spot, return early.
    if (prevColumnType === nextColumnType && destination.index === source.index) {
      return;
    }

    const prevColumn = retroState.data.columns[source.droppableId as RetroColumnType];
    const nextColumn =
      retroState.data.columns[destination.droppableId as RetroColumnType];

    // When dropping in the same column, update the order of the items.
    if (prevColumn === nextColumn) {
      const nextItemIds = [...prevColumn.retroItemIds];
      nextItemIds.splice(source.index, 1);
      nextItemIds.splice(destination.index, 0, retroItemId);
      const updatedPrevColumn = {
        ...prevColumn,
        retroItemIds: nextItemIds
      };
      onDragDrop({
        retroItemId,
        prevColumnType,
        prevColumn: updatedPrevColumn
      });
      return;
    } else {
      // When moving between columns.
      const prevColumnItemIds = [...prevColumn.retroItemIds];
      prevColumnItemIds.splice(source.index, 1);
      const updatedPrevColumn = {
        ...prevColumn,
        retroItemIds: prevColumnItemIds
      };
      const nextColumnItemIds = [...nextColumn.retroItemIds];
      nextColumnItemIds.splice(destination.index, 0, retroItemId);
      const updatedNextColumn = {
        ...nextColumn,
        retroItemIds: nextColumnItemIds
      };
      onDragDrop({
        retroItemId,
        prevColumnType: prevColumn.type,
        prevColumn: updatedPrevColumn,
        nextColumnType: nextColumn.type,
        nextColumn: updatedNextColumn
      });
      // We're only tracking when the item is moved between columns.
      analytics.track("Retro Item Moved", {
        start: prevColumn.type,
        end: nextColumn.type
      });
      return;
    }
  };

  const { data } = retroState;

  if (!data) {
    return <div className="text-blue">Loading...</div>;
  }

  return (
    <React.Fragment>
      {isModalOpen && (
        <RetroItemModal
          columnTitle={data.columns[columnTypeToAddItemTo]["title"]}
          isOpen={isModalOpen}
          columnType={columnTypeToAddItemTo}
          onToggle={handleCloseModal}
          onAddItem={handleAddItem}
          retroItem={retroItem}
          onEditItem={handleEditItem}
          // onDelete={handleDeleteItem}
        />
      )}
      <div className="retro-board__grid">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          {data?.columnOrder.map((columnType: RetroColumnType) => {
            const column = data?.columns[columnType];
            let items: RetroItem[] = [];
            column?.retroItemIds.reduce((acc, id) => {
              if (retroItems) {
                acc.push(retroItems[id]);
              }
              return acc;
            }, items);
            return (
              <RetroList
                title={column.title}
                key={columnType}
                type={columnType}
                items={items}
                users={users}
                onClickAdd={() => handleOnClickAdd(columnType)}
                onClickEdit={handleOnClickEdit}
                onClickLike={onLikeItem}
                onClickUnlike={onUnlikeItem}
              />
            );
          })}
        </DragDropContext>
      </div>
    </React.Fragment>
  );
}

interface RetroListProps {
  title: RetroColumn["title"];
  type: RetroColumn["type"];
  items: any[];
  users: WorkspaceUsersMap;
  onClickAdd: () => void;
  onClickLike: (input: any) => void;
  onClickUnlike: (input: any) => void;
  onClickEdit: (retroItem: RetroItem) => void;
}

export const RetroList: React.FC<RetroListProps> = ({
  title,
  type,
  items,
  users,
  onClickAdd,
  onClickLike,
  onClickUnlike,
  onClickEdit
}) => {
  return (
    <div className="flex flex-col border border-red shadow shadow-red">
      <div className="bg-white flex px-4 pt-2 pb-4 justify-between items-end mb-2 border border-red">
        <p className="text-blue font-bold text-sm">{title}</p>
        <AddButton className="self-end" onClick={onClickAdd} />
      </div>
      <Droppable droppableId={type}>
        {(provided) => {
          return (
            <ul
              ref={provided.innerRef}
              className="m-0 p-0 overflow-auto h-full"
              {...provided.droppableProps}
            >
              {items.map((item: RetroItem, index) => {
                return (
                  <RetroListItem
                    key={item.id}
                    index={index}
                    author={users[item.createdByUserId]}
                    onClickLike={onClickLike}
                    onClickUnlike={onClickUnlike}
                    onClickEdit={() => onClickEdit(item)}
                    {...item}
                  />
                );
              })}
              {provided.placeholder}
            </ul>
          );
        }}
      </Droppable>
    </div>
  );
};

export const RetroListItem: React.FC<
  RetroItem & {
    index: number;
    author: WorkspaceUser;
    onClickLike: (input: any) => void;
    onClickUnlike: (input: any) => void;
    onClickEdit: () => void;
  }
> = ({
  id,
  content,
  likedBy,
  likeCount,
  author,
  createdByUserId,
  onClickLike,
  onClickUnlike,
  onClickEdit,
  index
}) => {
  const currentUser = useCurrentUser();
  const authAccount = currentUser.auth!;

  const handleLikeItem = () => {
    const userId = currentUser!.data!.id;
    const input = { id, userId };
    // Toggle the like button.
    likedBy[userId] ? onClickUnlike(input) : onClickLike(input);
    return;
  };

  return (
    <Draggable draggableId={id} index={index} isDragDisabled={false}>
      {(provided, snapshot) => {
        return (
          <li
            ref={provided.innerRef}
            className={`retro-list-item flex content-center justify-between p-2 mb-1 mx-2 bg-white text-blue text-sm active:outline-none focus:outline-none ${
              snapshot.isDragging
                ? "shadow shadow-blue border border-blue bg-pink-1/2"
                : "border border-red"
            }`}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div className="flex content-center">
              {author && (
                <UserAvatar
                  displayName={author.userDisplayName || author.userEmail}
                  photoURL={author.userPhotoURL}
                  isAnonymous={false}
                />
              )}
              <div>
                <Linkify>
                  <span className="text-break">{content}</span>
                </Linkify>
              </div>
            </div>

            <div className="flex ml-2 items-center">
              {createdByUserId === authAccount.uid && (
                <EditButton onClick={onClickEdit} />
              )}
              <LikeButton
                likeCount={likeCount}
                likedBy={likedBy}
                currentUserId={authAccount.uid}
                onClick={handleLikeItem}
              />
            </div>
          </li>
        );
      }}
    </Draggable>
  );
};

interface LikeButtonProps {
  likeCount: number;
  likedBy: RetroItem["likedBy"];
  currentUserId: string;
  onClick: () => void;
}

const LikeButton = ({ likeCount, likedBy, currentUserId, onClick }: LikeButtonProps) => {
  return (
    <div className="flex items-center content-center">
      <span>{likeCount}</span>
      <button
        className="rounded-full focus:outline-none active:transform-1 h-8 w-8"
        onClick={onClick}
      >
        <div className="flex content-center items-center">
          <ThumbsUpIcon filled={!!likedBy[currentUserId] || false} />
        </div>
      </button>
    </div>
  );
};

interface EditButtonProps {
  onClick: () => void;
}

const EditButton: React.FC<EditButtonProps> = ({ onClick }) => {
  return (
    <div className="flex items-center justify-center mr-2">
      <button
        className="rounded-full h-8 w-8 focus:outline-none active:transform-1"
        onClick={onClick}
      >
        <div className={`flex justify-center items-end`}>
          <PencilEditIcon />
        </div>
      </button>
    </div>
  );
};
