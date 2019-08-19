import * as React from "react";
import { RetroList } from "../components/RetroList";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Firebase } from "../lib/Firebase";

interface State {
  lastUpdatedAt: Date;
  isFetching: boolean;
  retroBoard: RetroBoard;
}
export class RetroBoardPage extends React.Component<any, State> {
  // TODO: Fix this typing.
  state: any = {
    lastUpdatedAt: new Date(),
    isFetching: true,
    retroBoard: null
  };

  async componentDidMount() {
    const retroBoardState: any = await Firebase.fetchRetroBoardById(
      this.props.match.params.retroBoardId
    );
    this.setState({ isFetching: false, retroBoard: retroBoardState });
    return;
  }

  handleOnClickLike = async (itemId: Item["uid"]) => {
    const item = this.state.retroBoard.items[itemId];
    const newItem = { ...item, likeCount: item.likeCount + 1 };
    await this.setState(prevState => ({
      retroBoard: {
        ...prevState.retroBoard,
        items: { ...prevState.retroBoard.items, [newItem.uid]: newItem }
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
            [newColumn.uid]: newColumn
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
            [newStart.uid]: newStart,
            [newFinish.uid]: newFinish
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
    const { isFetching, retroBoard } = this.state;

    return (
      <div className="retro-board-page">
        {isFetching && <span>Loading...</span>}
        {!isFetching && !retroBoard && (
          <span>Oops! Couldn't load your retro board.</span>
        )}
        {retroBoard && (
          <React.Fragment>
            <div className="retro-board__grid">
              <DragDropContext onDragEnd={this.handleOnDragEnd}>
                {retroBoard.columnOrder.map((columnId: Column["uid"]) => {
                  const column = retroBoard.columns[columnId];
                  const items = column.itemIds.map(
                    (itemId: Item["uid"]) => retroBoard.items[itemId]
                  );
                  return (
                    <RetroList
                      key={columnId}
                      type={columnId}
                      items={items}
                      buttonClassName={column.buttonClassName}
                      handleOnClickLike={this.handleOnClickLike}
                    />
                  );
                })}
              </DragDropContext>
            </div>
            <div className="px-3">
              <small className="text-muted">
                Created at: {retroBoard.createdAt.toString()}
              </small>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}
