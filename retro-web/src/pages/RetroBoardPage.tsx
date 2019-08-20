import * as React from "react";
import { RetroList } from "../components/RetroList";
import { RetroItemModal } from "../components/RetroItemModal";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Firebase } from "../lib/Firebase";
import uuidv4 from "uuid/v4";
import moment from "moment";
interface State {
  lastUpdatedAt: Date;
  isFetching: boolean;
  // TODO: Fix this typing.
  retroBoard: RetroBoard;
  isModalOpen: boolean;
  columnTypeToAddItemTo: ColumnType | null;
}
export class RetroBoardPage extends React.Component<any, State> {
  state: any = {
    lastUpdatedAt: new Date() as State["lastUpdatedAt"],
    isFetching: true as State["isFetching"],
    // TODO: Fix this typing.
    retroBoard: null,
    isModalOpen: false as State["isModalOpen"],
    columnTypeToAddItemTo: null as State["columnTypeToAddItemTo"]
  };

  async componentDidMount() {
    const retroBoardState: any = await Firebase.fetchRetroBoardById(
      this.props.match.params.retroBoardId
    );
    this.setState({ isFetching: false, retroBoard: retroBoardState });
    return;
  }

  handleAddItemToColumn = async (
    content: Item["content"],
    column: ColumnType
  ) => {
    const newItem: Item = {
      content,
      id: uuidv4(),
      likeCount: 0,
      createdBy: "userId"
    };

    const prevColumn = this.state.retroBoard.columns[column];
    const newItemIds = [...prevColumn.itemIds, newItem.id];
    const newColumn: Column = {
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

  handleOnClickLike = async (itemId: Item["id"]) => {
    const item = this.state.retroBoard.items[itemId];
    const newItem = { ...item, likeCount: item.likeCount + 1 };
    await this.setState(prevState => ({
      retroBoard: {
        ...(prevState.retroBoard || {}),
        items: { ...prevState.retroBoard.items, [newItem.id]: newItem }
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

  render() {
    const { isFetching, retroBoard, isModalOpen } = this.state;

    return (
      <div className="retro-board-page">
        {isFetching && <span>Loading...</span>}
        {!isFetching && !retroBoard && (
          <span>Oops! Couldn't load your retro board.</span>
        )}
        {isModalOpen && (
          <RetroItemModal
            isOpen={this.state.isModalOpen}
            columnType={this.state.columnTypeToAddItemTo}
            onToggle={() =>
              this.setState({ isModalOpen: false, columnTypeToAddItemTo: null })
            }
            onSubmit={this.handleAddItemToColumn}
          />
        )}
        {retroBoard && (
          <React.Fragment>
            <div className="retro-board__grid">
              <DragDropContext onDragEnd={this.handleOnDragEnd}>
                {retroBoard.columnOrder.map((columnType: Column["type"]) => {
                  const column = retroBoard.columns[columnType];
                  const items = column.itemIds.map(
                    (itemId: Item["id"]) => retroBoard.items[itemId]
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
                    />
                  );
                })}
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
