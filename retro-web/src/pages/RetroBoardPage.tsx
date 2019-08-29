import * as React from "react";
import { RetroList } from "../components/RetroList";
import { RetroItemModal } from "../components/RetroItemModal";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Firebase } from "../lib/Firebase";
import uuidv4 from "uuid/v4";
import moment from "moment";
import { LoadingText } from "../components/LoadingText";
import { UserAuthContext } from "../components/UserAuthContext";
interface State {
  lastUpdatedAt: Date;
  isFetching: boolean;
  retroBoard: RetroBoard;
  isModalOpen: boolean;
  columnTypeToAddItemTo: RetroColumnType | null;
  initialContent?: RetroItem["content"];
}
export class RetroBoardPage extends React.Component<any, State> {
  static contextType = UserAuthContext;
  unsubscribeFromRetroBoardFn: any;
  // TODO: Fix this typing.
  constructor(props: any) {
    super(props);
    this.state = {
      lastUpdatedAt: new Date() as State["lastUpdatedAt"],
      isFetching: true as State["isFetching"],
      retroBoard: null as any,
      isModalOpen: false as State["isModalOpen"],
      columnTypeToAddItemTo: null as State["columnTypeToAddItemTo"],
      initialContent: undefined
    };
    this.unsubscribeFromRetroBoardFn = null;
  }

  async componentDidMount() {
    this.unsubscribeFromRetroBoardFn = Firebase.subscribeToRetroBoardById(
      this.props.match.params.retroBoardId,
      this.handleSetRetroBoardState
    );
    await this.setState({ isFetching: false });
    return;
  }

  componentWillUnmount() {
    if (this.unsubscribeFromRetroBoardFn) {
      this.unsubscribeFromRetroBoardFn();
    }
  }

  handleSetRetroBoardState = async (retroBoard: RetroBoard | undefined) => {
    if (!retroBoard) {
      return;
    }
    await this.setState({ retroBoard });
  };

  handleAddItemToColumn = async (
    content: RetroItem["content"],
    column: RetroColumnType
  ) => {
    const newItem: RetroItem = {
      content,
      id: uuidv4(),
      likedBy: {},
      likeCount: 0,
      createdByDisplayName: this.context.userAuthAccount.displayName,
      createdByUserId: this.context.userAuthAccount.uid,
      createdByPhotoURL: this.context.userAuthAccount.photoURL
    };

    const prevColumn = this.state.retroBoard.columns[column];
    const newItemIds = [...prevColumn.itemIds, newItem.id];
    const newColumn: RetroColumn = {
      ...prevColumn,
      itemIds: newItemIds
    };

    // YUCK! FIXME! DRY ME!
    await this.setState(prevState => ({
      retroBoard: {
        ...prevState.retroBoard,
        items: { ...prevState.retroBoard.items, [newItem.id]: newItem },
        columns: {
          ...prevState.retroBoard.columns,
          [newColumn.type]: {
            ...prevColumn,
            itemIds: newItemIds
          }
        }
      }
    }));

    await Firebase.updateRetroBoardById(
      this.state.retroBoard.uid,
      this.state.retroBoard
    );

    return;
  };

  handleOnClickLike = async (itemId: RetroItem["id"]) => {
    const { displayName } = this.context.userAuthAccount;
    const item = this.state.retroBoard.items[itemId];

    let newLikedBy = item.likedBy;
    if (item.likedBy[displayName]) {
      delete newLikedBy[displayName];
    } else {
      item.likedBy[displayName] = true;
    }

    const newItem = {
      ...item,
      likedBy: newLikedBy
    };

    await this.setState(prevState => ({
      retroBoard: {
        ...(prevState.retroBoard || {}),
        items: {
          ...prevState.retroBoard.items,
          [newItem.id]: {
            ...newItem,
            likeCount: Object.keys(newItem.likedBy).length
          }
        }
      }
    }));

    await Firebase.updateRetroBoardById(
      this.state.retroBoard.uid,
      this.state.retroBoard
    );

    return;
  };

  handleOnDragEnd = async (dropResult: DropResult) => {
    const { destination, source, draggableId } = dropResult;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = this.state.retroBoard.columns[source.droppableId];
    const finish = this.state.retroBoard.columns[destination.droppableId];

    if (start === finish) {
      const newItemIds = [...start.itemIds];
      newItemIds.splice(source.index, 1);
      newItemIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        itemIds: newItemIds
      };

      await this.setState(prevState => ({
        ...prevState,
        retroBoard: {
          ...prevState.retroBoard,
          columns: {
            ...prevState.retroBoard.columns,
            [newColumn.type]: newColumn
          }
        }
      }));
    } else {
      const startItemIds = [...start.itemIds];
      startItemIds.splice(source.index, 1);
      const newStart = {
        ...start,
        itemIds: startItemIds
      };

      const finishItemIds = [...finish.itemIds];
      finishItemIds.splice(destination.index, 0, draggableId);
      const newFinish = {
        ...finish,
        itemIds: finishItemIds
      };

      await this.setState(prevState => ({
        ...prevState,
        retroBoard: {
          ...prevState.retroBoard,
          columns: {
            ...prevState.retroBoard.columns,
            [newStart.type]: newStart,
            [newFinish.type]: newFinish
          }
        }
      }));
    }
    await Firebase.updateRetroBoardById(
      this.state.retroBoard.uid,
      this.state.retroBoard
    );
    return;
  };

  handleOnClickEdit = (
    columnType: RetroColumnType,
    initialContent: RetroItem["content"]
  ) => {
    this.setState({
      initialContent,
      isModalOpen: true,
      columnTypeToAddItemTo: columnType
    });
  };

  render() {
    const {
      isFetching,
      retroBoard,
      isModalOpen,
      columnTypeToAddItemTo,
      initialContent
    } = this.state;

    return (
      <div className="retro-board-page">
        {isFetching && <LoadingText />}
        {isModalOpen && (
          <RetroItemModal
            isOpen={isModalOpen}
            columnType={columnTypeToAddItemTo}
            initialContent={initialContent}
            onToggle={() =>
              this.setState({
                isModalOpen: false,
                columnTypeToAddItemTo: null
              })
            }
            onSubmit={this.handleAddItemToColumn}
          />
        )}
        {retroBoard && (
          <React.Fragment>
            <div className="retro-board__grid">
              <DragDropContext onDragEnd={this.handleOnDragEnd}>
                {retroBoard.columnOrder.map(
                  (columnType: RetroColumn["type"]) => {
                    const column = retroBoard.columns[columnType];
                    const items = column.itemIds.map(
                      (itemId: RetroItem["id"]) => retroBoard.items[itemId]
                    );
                    return (
                      <RetroList
                        key={columnType}
                        type={columnType}
                        items={items}
                        buttonClassName={column.buttonClassName}
                        handleOnClickAdd={() =>
                          this.setState({
                            isModalOpen: true,
                            columnTypeToAddItemTo: columnType
                          })
                        }
                        handleOnClickLike={this.handleOnClickLike}
                        handleOnClickEdit={this.handleOnClickEdit}
                      />
                    );
                  }
                )}
              </DragDropContext>
            </div>
            <div className="px-3">
              <small className="text-muted">
                Created: {moment(retroBoard.createdAt.toDate()).calendar()}
              </small>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}
