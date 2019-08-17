import * as React from "react";
import { RetroList } from "../components/RetroList";
import { initialState } from "../test-data/initial-state";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Firebase } from "../lib/Firebase";

interface State {
  items: { [key: string]: Item };
  columns: { [key: string]: Column };
  columnOrder: Column["uid"][];
}
export class RetroBoardPage extends React.Component<any, State> {
  state: any = initialState;

  handleOnClickLike = async (itemId: Item["uid"]) => {
    const item = this.state.items[itemId];
    const newItem = { ...item, likeCount: item.likeCount + 1 };
    await this.setState(prevState => ({
      items: { ...prevState.items, [newItem.uid]: newItem }
    }));
    await Firebase.updateRetroBoard(this.state);
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

    const start = this.state.columns[source.droppableId];
    const finish = this.state.columns[destination.droppableId];

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
        columns: {
          ...prevState.columns,
          [newColumn.uid]: newColumn
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
        columns: {
          ...prevState.columns,
          [newStart.uid]: newStart,
          [newFinish.uid]: newFinish
        }
      }));
    }
    await Firebase.updateRetroBoard(this.state);
    return;
  };

  render() {
    return (
      <div className="retro-board-page">
        <h1>Retro: {this.props.match.params.retroBoardId}</h1>
        <div className="retro-board__grid">
          <DragDropContext onDragEnd={this.handleOnDragEnd}>
            {this.state.columnOrder.map((columnId: Column["uid"]) => {
              const column = this.state.columns[columnId];
              const items = column.itemIds.map(
                (itemId: Item["uid"]) => this.state.items[itemId]
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
      </div>
    );
  }
}
