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
import { EditButton } from "../components/EditButton";
import { LoadingText } from "../components/LoadingText";
import { EditableText } from "../components/EditableText";
// import { UserAvatar } from "../components/UserAvatar";
import { ThumbsUpIcon } from "../components/ThumbsUpIcon";
// Types
import { RetroItem, RetroItemsMap, RetroItemType } from "../types/retro-item";
import { RetroColumnType, RetroColumn } from "../types/retro-column";
import { RetroStateValues, RetroStateStatus } from "../hooks/use-retro-state";
import { RetroItemModal } from "./RetroItemModal";
import { WorkspaceUser, WorkspaceUsersMap } from "../types/workspace-user";
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
  onDeleteItem: (
    retroItemId: RetroItem["id"],
    columnType: RetroItem["type"]
  ) => Promise<void>;
  onCombine: (
    groupContainerRetroItem: RetroItem,
    groupedRetroItem: RetroItem
  ) => Promise<void>;
  onUpdateGroupDescription: (id: string, text: string) => void;
}

export function RetroBoard({
  retroState,
  users,
  retroItems,
  onAddItem,
  onEditItem,
  onLikeItem,
  onUnlikeItem,
  onDragDrop,
  onCombine,
  onDeleteItem,
  onUpdateGroupDescription
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

  const handleCombineItems = (groupContainerId: string, retroItemId: string) => {
    if (!retroItems) {
      return;
    }
    let groupContainerRetroItem = retroItems[groupContainerId];
    let groupedRetroItem = retroItems[retroItemId];
    onCombine(groupContainerRetroItem, groupedRetroItem);
    return;
  };

  const handleOnDragEnd = (dropResult: DropResult) => {
    if (dropResult.combine) {
      handleCombineItems(dropResult.combine.draggableId, dropResult.draggableId);
      return;
    }

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
          onDeleteItem={onDeleteItem}
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
                retroItemsMap={retroItems || {}}
                onUpdateGroupDescription={onUpdateGroupDescription}
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
  onUpdateGroupDescription: (id: string, text: string) => void;
  retroItemsMap: RetroItemsMap;
}

export const RetroList: React.FC<RetroListProps> = ({
  title,
  type,
  items,
  users,
  onClickAdd,
  onClickLike,
  onClickUnlike,
  onClickEdit,
  retroItemsMap,
  onUpdateGroupDescription
}) => {
  return (
    <div className="flex flex-col border border-red shadow shadow-red">
      <div className="bg-white flex px-4 pt-2 pb-4 justify-between items-end mb-2 border border-red">
        <p className="text-blue font-bold text-sm">{title}</p>
        <AddButton className="self-end" onClick={onClickAdd} />
      </div>
      <Droppable droppableId={type} isCombineEnabled>
        {(provided) => {
          return (
            <ul
              ref={provided.innerRef}
              className="m-0 p-0 overflow-auto h-full"
              {...provided.droppableProps}
            >
              {items.map((item: RetroItem, index) => {
                return item.itemType === RetroItemType.GROUP_CONTAINER ? (
                  <RetroItemGroup
                    key={item.id}
                    index={index}
                    retroItem={item}
                    onClickLike={onClickLike}
                    onClickUnlike={onClickUnlike}
                    retroItemsMap={retroItemsMap}
                    onUpdateGroupDescription={onUpdateGroupDescription}
                  />
                ) : (
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
            className={`flex content-center justify-between p-2 mb-1 mx-2 bg-white text-blue text-sm active:outline-none focus:outline-none ${
              snapshot.isDragging
                ? "shadow shadow-blue border border-blue bg-pink-1/2"
                : "border border-red"
            }
            ${snapshot.combineTargetFor ? "bg-pink-1/2" : "bg-white"}`}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div className="flex content-center">
              <div>
                <Linkify>
                  <span>{content}</span>
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

type RetroItemGroupPropsT = {
  index: number;
  retroItem: RetroItem;
  onClickLike: any;
  onClickUnlike: any;
  retroItemsMap: RetroItemsMap;
  onUpdateGroupDescription: (id: string, text: string) => void;
};

function RetroItemGroup({
  retroItem,
  index,
  onClickLike,
  onClickUnlike,
  retroItemsMap,
  onUpdateGroupDescription
}: RetroItemGroupPropsT) {
  const currentUser = useCurrentUser();
  const currentUserId = currentUser.auth!.uid;

  const handleLikeItem = () => {
    const input = { id: retroItem.id, userId: currentUserId };
    // Toggle the like button.
    retroItem.likedBy[currentUserId] ? onClickUnlike(input) : onClickLike(input);
    return;
  };

  const handleUpdateGroupDescription = (text: string) => {
    onUpdateGroupDescription(retroItem.id, text);
    return;
  };

  return (
    <Draggable draggableId={retroItem.id} index={index} isDragDisabled={false}>
      {(provided, snapshot) => {
        return (
          <li
            ref={provided.innerRef}
            className={`flex justify-between p-2 mb-1 mx-2 bg-white text-blue text-sm active:outline-none focus:outline-none ${
              snapshot.isDragging
                ? "shadow shadow-blue border border-blue bg-pink-1/2"
                : "border border-red"
            }
              ${snapshot.combineTargetFor ? "bg-pink-1/2" : "bg-white"}`}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div className="flex flex-col flex-grow">
              <div>
                <EditableText
                  defaultValue={retroItem.groupDescription}
                  onSubmit={handleUpdateGroupDescription}
                />
              </div>

              <div>
                <Linkify>
                  <ul>
                    <li className="mb-2">
                      <span>{retroItem.content}</span>
                    </li>
                    {retroItem.groupedRetroItemIds?.map((id) => {
                      return (
                        <li key={id} className="mb-2">
                          <span>{retroItemsMap[id].content}</span>
                        </li>
                      );
                    })}
                  </ul>
                </Linkify>
              </div>
            </div>

            <div>
              <div className="flex ml-2 items-center">
                <LikeButton
                  likeCount={retroItem.likeCount}
                  likedBy={retroItem.likedBy}
                  currentUserId={currentUserId}
                  onClick={handleLikeItem}
                />
              </div>
            </div>
          </li>
        );
      }}
    </Draggable>
  );
}
