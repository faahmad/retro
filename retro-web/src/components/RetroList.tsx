import * as React from "react";

interface RetroListProps {
  type: "good" | "bad" | "actions" | "questions";
  buttonClassName: "success" | "danger" | "warning" | "primary";
}

export const RetroList: React.FC<RetroListProps> = ({
  type,
  buttonClassName
}) => {
  const [items, setItems] = React.useState<RetroListItemProps[]>([]);

  const handleSetItems = () => {
    return setItems(prevItems => {
      return [...prevItems, { text: "This is an item." }];
    });
  };

  return (
    <div
      className="retro-list d-flex flex-column border rounded p-2 bg-light"
      style={{ height: "320px" }}
    >
      <div className="box-shadow bg-white w-100 d-flex flex-column shadow-sm p-2 rounded justify-content-center mb-2">
        <button
          className={`btn btn-${buttonClassName} align-self-end`}
          onClick={handleSetItems}
        >
          {type}
        </button>
      </div>
      <ul className="m-0 p-0 overflow-auto">
        {items.map((item, index) => (
          <RetroListItem key={`${type}-${index}`} {...item} />
        ))}
      </ul>
    </div>
  );
};

interface RetroListItemProps {
  text: string;
}

const RetroListItem: React.FC<RetroListItemProps> = ({ text }) => {
  const [likeCount, setLikeCount] = React.useState(0);

  return (
    <li className="d-flex align-items-center justify-content-between border rounded p-2 bg-white mb-1">
      <span>{text}</span>
      <div>
        <span className="mr-2">{likeCount}</span>
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => setLikeCount(prevLikeCount => prevLikeCount + 1)}
        >
          +1
        </button>
      </div>
    </li>
  );
};
