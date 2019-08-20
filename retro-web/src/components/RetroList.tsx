import * as React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";

interface RetroListProps {
  type: Column["type"];
  items: any[];
  buttonClassName: Column["buttonClassName"];
  handleOnClickLike: (itemId: Item["id"]) => void;
}

export const RetroList: React.FC<RetroListProps> = ({
  type,
  items,
  buttonClassName,
  handleOnClickLike
}) => {
  return (
    <div className="retro-list d-flex flex-column border rounded p-2 bg-light">
      <div className="box-shadow bg-white w-100 d-flex flex-column shadow-sm p-2 rounded justify-content-center mb-2">
        <button
          className={`btn btn-${buttonClassName} align-self-end`}
          onClick={() => console.log("Clicked " + type)}
        >
          {type}
        </button>
      </div>
      <Droppable droppableId={type}>
        {provided => (
          <ul
            ref={provided.innerRef}
            className="m-0 p-0 overflow-auto h-100"
            {...provided.droppableProps}
          >
            {items.map((item, index) => (
              <RetroListItem
                key={item.uid}
                index={index}
                handleOnClickLike={handleOnClickLike}
                {...item}
              />
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </div>
  );
};

const RetroListItem: React.FC<
  Item & {
    index: number;
    handleOnClickLike: RetroListProps["handleOnClickLike"];
  }
> = ({ id, content, likeCount, handleOnClickLike, index }) => {
  return (
    <Draggable draggableId={id} index={index} isDragDisabled={false}>
      {(provided, snapshot) => {
        return (
          <li
            ref={provided.innerRef}
            className={`retro-list-item d-flex align-items-center justify-content-between border rounded p-2 mb-1 bg-white ${
              snapshot.isDragging ? "border-primary shadow" : ""
            }`}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <span>{content}</span>
            <div>
              <span className="mr-2">{likeCount}</span>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => handleOnClickLike(id)}
              >
                +1
              </button>
            </div>
          </li>
        );
      }}
    </Draggable>
  );
};
