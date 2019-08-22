import * as React from "react";
import { Droppable } from "react-beautiful-dnd";
import { RetroItem } from "./RetroItem";

interface RetroListProps {
  type: RetroColumn["type"];
  items: any[];
  buttonClassName: RetroColumn["buttonClassName"];
  handleOnClickAdd: () => void;
  handleOnClickLike: (itemId: RetroItem["id"]) => void;
}

export const RetroList: React.FC<RetroListProps> = ({
  type,
  items,
  buttonClassName,
  handleOnClickAdd,
  handleOnClickLike
}) => {
  return (
    <div className="retro-list d-flex flex-column border rounded p-2 bg-light">
      <div className="box-shadow bg-white w-100 d-flex flex-column shadow-sm p-2 rounded justify-content-center mb-2">
        <button
          className={`btn btn-${buttonClassName} align-self-end font-weight-bold`}
          onClick={handleOnClickAdd}
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
            {items.map((item: RetroItem, index) => (
              <RetroItem
                key={item.id}
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
