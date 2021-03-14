/* eslint-disable no-unused-vars */
// @ts-nocheck
import * as React from "react";
import { DragDropContext, Draggable, DropResult, Droppable } from "react-beautiful-dnd";
import { v4 as uuidV4 } from "uuid";
import Linkify from "react-linkify";
import analytics from "analytics.js";
// Contexts
import { CurrentUserContext } from "../contexts/CurrentUserContext";
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
import { Retro } from "../types/retro";
import { RetroStateValues, RetroStateStatus } from "../hooks/use-retro-state";
import { RetroItemModal } from "./RetroItemModal";

interface RetroBoardProps {
  state: RetroStateValues;
  retroItems: RetroItemsMap | null;
  onAddItem: any;
}

export function RetroBoard({ state, retroItems, onAddItem }: RetroBoardProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [
    columnTypeToAddItemTo,
    setColumnTypeToAddItemTo
  ] = React.useState<RetroColumnType>(RetroColumnType.GOOD);
  if (state.status === RetroStateStatus.LOADING) {
    return <LoadingText />;
  }

  const handleCloseModal = () => {
    return setIsModalOpen(false);
  };

  const handleAddItem = ({ content, type }) => {
    return onAddItem({ content, type, workspaceId: state.data?.workspaceId });
  };

  const handleClickEdit = () => {};

  // const handleEditItem = (item, column) => {
  //   return Promise.resolve();
  // };

  const handleLikeItem = () => {};

  // const handleDeleteItem = () => {
  //   return Promise.resolve();
  // };

  const handleOnDragEnd = () => {
    return;
  };

  const { data } = state;

  return (
    <React.Fragment>
      {isModalOpen && (
        <RetroItemModal
          column={data?.columns[columnTypeToAddItemTo] || RetroColumnType.GOOD}
          isOpen={isModalOpen}
          columnType={columnTypeToAddItemTo}
          // initialRetroItem={initialRetroItem}
          onToggle={handleCloseModal}
          onAddItem={handleAddItem}
          // onEdit={() => {}}
          // onDelete={handleDeleteItem}
        />
      )}
      <div className="retro-board__grid">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          {data?.columnOrder.map((columnType: RetroColumnType) => {
            const column = data?.columns[columnType];
            const items = column.retroItemIds.map(
              (itemId: RetroItem["id"]) => retroItems[itemId]
            );
            return (
              <RetroList
                title={column.title}
                key={columnType}
                type={columnType}
                items={items}
                handleOnClickAdd={() => {
                  setIsModalOpen(true);
                  setColumnTypeToAddItemTo(columnType);
                  return;
                }}
                handleOnClickLike={handleClickEdit}
                handleOnClickEdit={handleLikeItem}
              />
            );
          })}
        </DragDropContext>
      </div>
    </React.Fragment>
  );
}

// interface RetroBoardProps {
//   id: Retro["id"];
//   isActive: boolean | null;
// }
// interface RetroBoardState {
//   lastUpdatedAt: Date;
//   isFetching: boolean;
//   retroBoard: Retro;
//   isModalOpen: boolean;
//   columnTypeToAddItemTo: RetroColumnType | null;
//   initialRetroItem?: RetroItem;
// }

// export class OldRetroBoard extends React.Component<RetroBoardProps, RetroBoardState> {
//   static contextType = CurrentUserContext;
//   unsubscribeFromRetroBoardFn: any;
//   // TODO: Fix this typing.
//   constructor(props: any) {
//     super(props);
//     this.state = {
//       lastUpdatedAt: new Date() as RetroBoardState["lastUpdatedAt"],
//       isFetching: true as RetroBoardState["isFetching"],
//       retroBoard: null as any,
//       isModalOpen: false as RetroBoardState["isModalOpen"],
//       columnTypeToAddItemTo: null as RetroBoardState["columnTypeToAddItemTo"],
//       initialRetroItem: undefined
//     };
//     this.unsubscribeFromRetroBoardFn = null;
//   }

//   // async componentDidMount() {
//   //   this.unsubscribeFromRetroBoardFn = subscribeToRetroBoardById(
//   //     this.props.id,
//   //     this.handleSetRetroBoardState
//   //   );
//   //   await this.setState({ isFetching: false });
//   //   return;
//   // }

//   componentWillUnmount() {
//     if (this.unsubscribeFromRetroBoardFn) {
//       this.unsubscribeFromRetroBoardFn();
//     }
//   }

//   handleSetRetroBoardState = async (retroBoard: Retro | undefined) => {
//     if (!retroBoard) {
//       return;
//     }
//     await this.setState({ retroBoard });
//   };

//   handleAddItemToColumn = async (
//     { content, isAnonymous }: CreateRetroItemParams,
//     column: string
//   ) => {
//     if (!this.props.isActive) {
//       return;
//     }

//     const newItem: RetroItem = {
//       content,
//       isAnonymous,
//       id: uuidV4(),
//       likedBy: {},
//       likeCount: 0,
//       createdByUserId: this.context.auth.uid,
//       createdAt: new Date()
//     };

//     const prevColumn = this.state.retroBoard.columns[column];
//     const newItemIds = [...prevColumn.itemIds, newItem.id];
//     const newColumn = {
//       ...prevColumn,
//       itemIds: newItemIds
//     };

//     // YUCK! FIXME! DRY ME!
//     await this.setState((prevState) => ({
//       retroBoard: {
//         ...prevState.retroBoard,
//         items: { ...prevState.retroBoard.retroItems, [newItem.id]: newItem },
//         columns: {
//           ...prevState.retroBoard.columns,
//           [newColumn.type]: {
//             ...prevColumn,
//             itemIds: newItemIds
//           }
//         }
//       }
//     }));

//     // await updateRetroBoardById(this.state.retroBoard.id, this.state.retroBoard);

//     analytics.track("Retro Item Added", { content, column, isAnonymous });

//     return;
//   };

//   handleEditItem = async (item: RetroItem, _columnType: any) => {
//     if (!this.props.isActive) {
//       return;
//     }

//     await this.setState((prevState) => ({
//       retroBoard: {
//         ...prevState.retroBoard,
//         items: { ...prevState.retroBoard.items, [item.id]: item }
//       }
//     }));

//     // await updateRetroBoardById(this.state.retroBoard.id, this.state.retroBoard);

//     analytics.track("Retro Item Edited", { ...item });

//     return;
//   };

//   handleDeleteItem = async (itemId: RetroItem["id"], columnType: string) => {
//     if (!this.props.isActive) {
//       return;
//     }

//     const { retroBoard } = this.state;

//     const items = retroBoard.items;
//     delete items[itemId];

//     const prevColumn = retroBoard.columns[columnType];
//     const newItemIds = prevColumn.itemIds.filter((id) => id !== itemId);

//     await this.setState((prevState) => ({
//       initialRetroItem: undefined,
//       retroBoard: {
//         ...prevState.retroBoard,
//         items,
//         columns: {
//           ...prevState.retroBoard.columns,
//           [columnType]: {
//             ...prevColumn,
//             itemIds: newItemIds
//           }
//         }
//       }
//     }));

//     // await updateRetroBoardById(this.state.retroBoard.id, this.state.retroBoard);

//     analytics.track("Retro Item Deleted", { id: itemId, column: columnType });

//     return;
//   };

//   handleOnClickLike = async (itemId: RetroItem["id"]) => {
//     if (!this.props.isActive) {
//       return;
//     }

//     const { uid } = this.context.auth;
//     const item = this.state.retroBoard.items[itemId];

//     const newLikedBy = item.likedBy;
//     if (item.likedBy[uid]) {
//       delete newLikedBy[uid];
//     } else {
//       item.likedBy[uid] = true;
//     }

//     const newItem = {
//       ...item,
//       likedBy: newLikedBy
//     };

//     await this.setState((prevState) => ({
//       retroBoard: {
//         ...(prevState.retroBoard || {}),
//         items: {
//           ...prevState.retroBoard.items,
//           [newItem.id]: {
//             ...newItem,
//             likeCount: Object.keys(newItem.likedBy).length
//           }
//         }
//       }
//     }));

//     // updateRetroBoardById(this.state.retroBoard.id, this.state.retroBoard);

//     analytics.track("Retro Item Liked", { id: itemId, userId: uid });

//     return;
//   };

//   handleOnDragEnd = async (dropResult: DropResult) => {
//     if (!this.props.isActive) {
//       return;
//     }

//     const { destination, source, draggableId } = dropResult;

//     if (!destination) {
//       return;
//     }

//     if (
//       destination.droppableId === source.droppableId &&
//       destination.index === source.index
//     ) {
//       return;
//     }

//     const start = this.state.retroBoard.columns[source.droppableId];
//     const finish = this.state.retroBoard.columns[destination.droppableId];

//     if (start === finish) {
//       const newItemIds = [...start.itemIds];
//       newItemIds.splice(source.index, 1);
//       newItemIds.splice(destination.index, 0, draggableId);

//       const newColumn = {
//         ...start,
//         itemIds: newItemIds
//       };

//       await this.setState((prevState) => ({
//         ...prevState,
//         retroBoard: {
//           ...prevState.retroBoard,
//           columns: {
//             ...prevState.retroBoard.columns,
//             [newColumn.type]: newColumn
//           }
//         }
//       }));
//     } else {
//       const startItemIds = [...start.itemIds];
//       startItemIds.splice(source.index, 1);
//       const newStart = {
//         ...start,
//         itemIds: startItemIds
//       };

//       const finishItemIds = [...finish.itemIds];
//       finishItemIds.splice(destination.index, 0, draggableId);
//       const newFinish = {
//         ...finish,
//         itemIds: finishItemIds
//       };

//       await this.setState((prevState) => ({
//         ...prevState,
//         retroBoard: {
//           ...prevState.retroBoard,
//           columns: {
//             ...prevState.retroBoard.columns,
//             [newStart.type]: newStart,
//             [newFinish.type]: newFinish
//           }
//         }
//       }));
//     }

//     // updateRetroBoardById(this.state.retroBoard.id, this.state.retroBoard);

//     analytics.track("Retro Item Moved", {
//       start: start.type,
//       end: finish.type
//     });

//     return;
//   };

//   handleOnClickEdit = (
//     columnType: string,
//     initialRetroItem: RetroBoardState["initialRetroItem"]
//   ) => {
//     if (!this.props.isActive) {
//       return;
//     }

//     this.setState({
//       initialRetroItem,
//       isModalOpen: true,
//       columnTypeToAddItemTo: columnType
//     });
//   };

//   handleToggleModal = () => {
//     if (!this.props.isActive) {
//       return;
//     }
//     this.setState({
//       isModalOpen: false,
//       columnTypeToAddItemTo: null,
//       initialRetroItem: undefined
//     });
//   };

//   render() {
//     const {
//       isFetching,
//       retroBoard,
//       isModalOpen,
//       columnTypeToAddItemTo,
//       initialRetroItem
//     } = this.state;

//     return (
//       <React.Fragment>
//         {isFetching && <LoadingText />}
//         {isModalOpen && (
//           <RetroItemModal
//             column={retroBoard.columns[columnTypeToAddItemTo || "good"]}
//             isOpen={isModalOpen}
//             columnType={columnTypeToAddItemTo}
//             initialRetroItem={initialRetroItem}
//             onToggle={this.handleToggleModal}
//             onSubmit={this.handleAddItemToColumn}
//             onEdit={this.handleEditItem}
//             onDelete={this.handleDeleteItem}
//           />
//         )}
//         {retroBoard && (
//           <React.Fragment>
//             <div className="retro-board__grid">
//               <DragDropContext onDragEnd={this.handleOnDragEnd}>
//                 {retroBoard.columnOrder.map((columnType: RetroColumn["type"]) => {
//                   const column = retroBoard.columns[columnType];
//                   const items = column.itemIds.map(
//                     (itemId: RetroItem["id"]) => retroBoard.items[itemId]
//                   );
//                   return (
//                     <RetroList
//                       title={column.title}
//                       key={columnType}
//                       type={columnType}
//                       items={items}
//                       handleOnClickAdd={() => {
//                         if (!this.props.isActive) {
//                           return;
//                         }
//                         this.setState({
//                           isModalOpen: true,
//                           columnTypeToAddItemTo: columnType
//                         });
//                         return;
//                       }}
//                       handleOnClickLike={this.handleOnClickLike}
//                       handleOnClickEdit={this.handleOnClickEdit}
//                     />
//                   );
//                 })}
//               </DragDropContext>
//             </div>
//           </React.Fragment>
//         )}
//       </React.Fragment>
//     );
//   }
// }

interface RetroListProps {
  title: RetroColumn["title"];
  type: RetroColumn["type"];
  items: any[];
  handleOnClickAdd: () => void;
  handleOnClickLike: (itemId: RetroItem["id"]) => void;
  handleOnClickEdit: (columnType: string, initialRetroItem: RetroItem) => void;
}

export const RetroList: React.FC<RetroListProps> = ({
  title,
  type,
  items,
  handleOnClickAdd,
  handleOnClickLike,
  handleOnClickEdit
}) => {
  return (
    <div className="flex flex-col border border-red shadow shadow-red">
      <div className="bg-white flex px-4 pt-2 pb-4 justify-between items-end mb-2 border border-red">
        <p className="text-blue font-bold text-sm">{title}</p>
        <AddButton className="self-end" onClick={handleOnClickAdd} />
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
                    handleOnClickLike={handleOnClickLike}
                    handleOnClickEdit={() => handleOnClickEdit(type, item)}
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
    handleOnClickLike: (itemId: RetroItem["id"]) => void;
    handleOnClickEdit: () => void;
  }
> = ({
  id,
  content,
  isAnonymous,
  likedBy,
  likeCount,
  createdByDisplayName,
  createdByUserId,
  createdByPhotoURL,
  handleOnClickLike,
  handleOnClickEdit,
  index
}) => {
  const currentUser = useCurrentUser();
  const authAccount = currentUser.auth!;

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
              <UserAvatar
                displayName={createdByDisplayName}
                photoURL={createdByPhotoURL}
                isAnonymous={isAnonymous}
              />
              <div>
                <Linkify>
                  <span className="text-break">{content}</span>
                </Linkify>
              </div>
            </div>

            <div className="flex ml-2 items-center">
              {createdByUserId === authAccount.uid && (
                <EditButton onClick={handleOnClickEdit} />
              )}
              <LikeButton
                likeCount={likeCount}
                likedBy={likedBy}
                currentUserId={authAccount.uid}
                onClick={() => handleOnClickLike(id)}
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
          <ThumbsUpIcon filled={likedBy[currentUserId]} />
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
