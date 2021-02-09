// @ts-nocheck
/* eslint-disable */
import * as React from "react";
import { RouteComponentProps, useParams } from "react-router-dom";
import { DragDropContext, Draggable, DropResult, Droppable } from "react-beautiful-dnd";
import { v4 as uuidV4 } from "uuid";
import moment from "moment";
import { AddButton } from "../components/AddButton";
import { LoadingText } from "../components/LoadingText";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import Linkify from "react-linkify";
import { Footer } from "../components/Footer";
import ReactModal from "react-modal";
import { Button } from "../components/Button";
import { ThumbsUpIcon } from "../components/ThumbsUpIcon";
import pencilIcon from "../assets/icons/pencil.svg";
import { PageContainer } from "../components/PageContainer";
import { RetroItem } from "../types/retro-item";
import { useRetroState, RetroStateStatus } from "../hooks/use-retro-state";
import analytics from "analytics.js";
import { UserAvatar } from "../components/UserAvatar";
import { OptimizelyFeature } from "@optimizely/react-sdk";
import { useCurrentUser } from "../hooks/use-current-user";
import { Retro } from "../types/retro";
import { RetroColumnType } from "../types/retro-column";
import { PencilEditIcon } from "../components/PencilEditIcon";
import { useUpdateRetro } from "../hooks/use-update-retro";

export const RetroBoardPage: React.FC<RouteComponentProps> = () => {
  const params = useParams<{ retroId: Retro["id"] }>();
  const retroState = useRetroState(params.retroId);

  if (retroState.status === RetroStateStatus.LOADING) {
    return (
      <PageContainer>
        <p className="text-blue">Fetching retro...</p>
      </PageContainer>
    );
  }

  return (
    <React.Fragment>
      <PageContainer>
        <RetroHeader
          id={retroState.id}
          name={retroState.name}
          createdAt={retroState.createdAt}
        />
        {/* <RetroBoard id={params.retroId} isActive={isActive} /> */}
      </PageContainer>
      <Footer />
    </React.Fragment>
  );
};

interface RetroHeaderProps {
  id: string;
  name: string;
  createdAt: any;
}
function RetroHeader({ id, name, createdAt }: RetroHeaderProps) {
  const [localName, setLocalName] = React.useState(name);
  const handleOnChange = (event) => {
    return setLocalName(event.currentTarget.value);
  };

  const [isEditing, setisEditing] = React.useState(false);
  const handleToggleEditing = () => {
    return setisEditing((prevState) => !prevState);
  };
  const inputRef = React.useRef(null);
  React.useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const updateRetro = useUpdateRetro();
  const handleSave = async () => {
    await updateRetro(id, { name: localName });
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

// type CreateRetroItemParams = {
//   content: RetroItem["content"];
//   isAnonymous: RetroItem["isAnonymous"];
// };
// export class RetroBoard extends React.Component<RetroBoardProps, RetroBoardState> {
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

// interface RetroListProps {
//   title: RetroColumn["title"];
//   type: RetroColumn["type"];
//   items: any[];
//   handleOnClickAdd: () => void;
//   handleOnClickLike: (itemId: RetroItem["id"]) => void;
//   handleOnClickEdit: (columnType: string, initialRetroItem: RetroItem) => void;
// }

// export const RetroList: React.FC<RetroListProps> = ({
//   title,
//   type,
//   items,
//   handleOnClickAdd,
//   handleOnClickLike,
//   handleOnClickEdit
// }) => {
//   return (
//     <div className="flex flex-col border border-red shadow shadow-red">
//       <div className="bg-white flex px-4 pt-2 pb-4 justify-between items-end mb-2 border border-red">
//         <p className="text-blue font-bold text-sm">{title}</p>
//         <AddButton className="self-end" onClick={handleOnClickAdd} />
//       </div>
//       <Droppable droppableId={type}>
//         {(provided) => {
//           return (
//             <ul
//               ref={provided.innerRef}
//               className="m-0 p-0 overflow-auto h-full"
//               {...provided.droppableProps}
//             >
//               {items.map((item: RetroItem, index) => {
//                 return (
//                   <RetroListItem
//                     key={item.id}
//                     index={index}
//                     handleOnClickLike={handleOnClickLike}
//                     handleOnClickEdit={() => handleOnClickEdit(type, item)}
//                     {...item}
//                   />
//                 );
//               })}
//               {provided.placeholder}
//             </ul>
//           );
//         }}
//       </Droppable>
//     </div>
//   );
// };

// export const RetroListItem: React.FC<
//   RetroItem & {
//     index: number;
//     handleOnClickLike: (itemId: RetroItem["id"]) => void;
//     handleOnClickEdit: () => void;
//   }
// > = ({
//   id,
//   content,
//   isAnonymous,
//   likedBy,
//   likeCount,
//   createdByDisplayName,
//   createdByUserId,
//   createdByPhotoURL,
//   handleOnClickLike,
//   handleOnClickEdit,
//   index
// }) => {
//   const currentUser = useCurrentUser();
//   const authAccount = currentUser.auth!;

//   return (
//     <Draggable draggableId={id} index={index} isDragDisabled={false}>
//       {(provided, snapshot) => {
//         return (
//           <li
//             ref={provided.innerRef}
//             className={`retro-list-item flex content-center justify-between p-2 mb-1 mx-2 bg-white text-blue text-sm active:outline-none focus:outline-none ${
//               snapshot.isDragging
//                 ? "shadow shadow-blue border border-blue bg-pink-1/2"
//                 : "border border-red"
//             }`}
//             {...provided.draggableProps}
//             {...provided.dragHandleProps}
//           >
//             <div className="flex content-center">
//               <UserAvatar
//                 displayName={createdByDisplayName}
//                 photoURL={createdByPhotoURL}
//                 isAnonymous={isAnonymous}
//               />
//               <div>
//                 <Linkify>
//                   <span className="text-break">{content}</span>
//                 </Linkify>
//               </div>
//             </div>

//             <div className="flex ml-2 items-center">
//               {createdByUserId === authAccount.uid && (
//                 <EditButton onClick={handleOnClickEdit} />
//               )}
//               <LikeButton
//                 likeCount={likeCount}
//                 likedBy={likedBy}
//                 currentUserId={authAccount.uid}
//                 onClick={() => handleOnClickLike(id)}
//               />
//             </div>
//           </li>
//         );
//       }}
//     </Draggable>
//   );
// };

// interface LikeButtonProps {
//   likeCount: number;
//   likedBy: RetroItem["likedBy"];
//   currentUserId: string;
//   onClick: () => void;
// }

// const LikeButton = ({ likeCount, likedBy, currentUserId, onClick }: LikeButtonProps) => {
//   return (
//     <div className="flex items-center content-center">
//       <span>{likeCount}</span>
//       <button
//         className="rounded-full focus:outline-none active:transform-1 h-8 w-8"
//         onClick={onClick}
//       >
//         <div className="flex content-center items-center">
//           <ThumbsUpIcon filled={likedBy[currentUserId]} />
//         </div>
//       </button>
//     </div>
//   );
// };

// interface EditButtonProps {
//   onClick: () => void;
// }

// const EditButton: React.FC<EditButtonProps> = ({ onClick }) => {
//   return (
//     <div className="flex items-center justify-center mr-2">
//       <button
//         className="rounded-full h-8 w-8 focus:outline-none active:transform-1"
//         onClick={onClick}
//       >
//         <div className={`flex justify-center items-end`}>
//           <img src={pencilIcon} alt="edit pencil" />
//         </div>
//       </button>
//     </div>
//   );
// };

// interface RetroItemModalProps {
//   isOpen: boolean;
//   column: RetroColumn;
//   columnType: string | null;
//   onToggle: () => void;
//   onSubmit: (params: CreateRetroItemParams, column: string) => Promise<void>;
//   initialRetroItem?: RetroItem;
//   onEdit: (item: RetroItem, column: string) => Promise<void>;
//   onDelete: (itemId: RetroItem["id"], column: string) => Promise<void>;
// }

// interface RetroItemModalState {
//   columnType: string | "";
//   content: RetroItem["content"];
//   isAnonymous: RetroItem["isAnonymous"];
//   isSubmitting: boolean;
// }

// export class RetroItemModal extends React.Component<
//   RetroItemModalProps,
//   RetroItemModalState
// > {
//   constructor(props: RetroItemModalProps) {
//     super(props);
//     this.state = {
//       columnType: props.columnType || "",
//       content: props.initialRetroItem ? props.initialRetroItem.content : "",
//       isAnonymous: false,
//       isSubmitting: false
//     };
//   }
//   handlePostAnonymously = () => {
//     this.setState({ isAnonymous: true }, () => this.handleSubmit());
//     return;
//   };

//   handleSubmit = async () => {
//     const { content, columnType, isAnonymous } = this.state;
//     const { initialRetroItem } = this.props;
//     if (!content) {
//       return;
//     }
//     if (!columnType) {
//       return;
//     }
//     this.setState({ isSubmitting: true });
//     if (!initialRetroItem) {
//       await this.props.onSubmit({ content, isAnonymous }, columnType);
//     } else {
//       await this.props.onEdit({ ...initialRetroItem, content, isAnonymous }, columnType);
//     }
//     await this.setState({ isSubmitting: false });
//     this.props.onToggle();
//     return;
//   };
//   handleDelete = async () => {
//     const { onDelete, initialRetroItem, columnType, onToggle } = this.props;
//     this.setState({ isSubmitting: true });
//     if (initialRetroItem && columnType) {
//       onDelete(initialRetroItem!.id, columnType!);
//     }
//     await this.setState({ isSubmitting: false });
//     onToggle();
//     return;
//   };
//   render() {
//     const { isOpen, onToggle, initialRetroItem, column } = this.props;
//     const { content, isSubmitting } = this.state;

//     return (
//       <ReactModal
//         ariaHideApp={false}
//         isOpen={isOpen}
//         onRequestClose={onToggle}
//         style={{
//           content: {
//             maxWidth: "420px",
//             height: "530px",
//             padding: "20px",
//             width: "100%"
//           },
//           overlay: { background: "rgba(17, 38, 156, 0.6)" }
//         }}
//         className="bg-white shadow-red border m-auto absolute inset-0 border-red focus:outline-none z-50"
//         // IMPORTANT: closeTimeoutMS has to be the same as what is set in the tailwind.css file.
//         closeTimeoutMS={200}
//       >
//         <div>
//           <div>
//             <div className="text-blue">
//               <div className="flex justify-between mb-2">
//                 <label htmlFor="content" className="text-blue font-bold text-sm">
//                   {column.title}
//                 </label>
//                 {initialRetroItem && (
//                   <button
//                     className="mb-2 text-xs"
//                     onClick={this.handleDelete}
//                     disabled={isSubmitting}
//                   >
//                     Delete
//                   </button>
//                 )}
//               </div>
//               <textarea
//                 className="w-full p-2 border border-red text-blue focus:outline-none"
//                 id="retro-item-modal-content-text-input"
//                 rows={10}
//                 name="content"
//                 value={content}
//                 onChange={(e) => this.setState({ content: e.target.value })}
//               />
//             </div>
//           </div>
//           <div className="flex align-center justify-between mt-8">
//             {/*
//             FIXME: 2/18/2020
//             Tried to override the styles by passing in classNames,
//             but it wasn't working. Decided to use inline for time's sake,
//             however, we should be able to override any styles via the className prop.
//           */}
//             <Button
//               onClick={onToggle}
//               disabled={isSubmitting}
//               className="text-red border-none shadow-none"
//               style={{ width: "6rem", boxShadow: "none" }}
//             >
//               Cancel
//             </Button>
//             <div className="flex flex-col">
//               <Button
//                 className="bg-blue text-white"
//                 style={{ width: "10rem" }}
//                 disabled={isSubmitting}
//                 onClick={this.handleSubmit}
//               >
//                 {isSubmitting ? "Submitting..." : "Submit"}
//               </Button>
//               <OptimizelyFeature feature="anonymous_retro_item">
//                 {(isEnabled) =>
//                   isEnabled ? (
//                     <Button
//                       className="text-blue text-sm mt-4"
//                       style={{ width: "10rem" }}
//                       disabled={isSubmitting}
//                       onClick={this.handlePostAnonymously}
//                     >
//                       {isSubmitting ? "Posting..." : "Post Anonymously"}
//                     </Button>
//                   ) : null
//                 }
//               </OptimizelyFeature>
//             </div>
//           </div>
//         </div>
//       </ReactModal>
//     );
//   }
// }
