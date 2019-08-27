import * as React from "react";
import { Draggable } from "react-beautiful-dnd";
import Octicon, { Question, ChevronUp } from "@primer/octicons-react";
import { UserAuthContext } from "./UserAuthContext";

export const RetroItem: React.FC<
  RetroItem & {
    index: number;
    handleOnClickLike: (itemId: RetroItem["id"]) => void;
  }
> = ({
  id,
  content,
  likedBy,
  likeCount,
  createdByDisplayName,
  createdByPhotoURL,
  handleOnClickLike,
  index
}) => {
  const { userAuthAccount }: any = React.useContext(UserAuthContext);

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
            <div className="d-flex align-items-center">
              {createdByPhotoURL ? (
                <img
                  alt="user avatar"
                  className="d-flex justify-content-center align-items-center bg-light rounded-circle mr-2"
                  style={{ height: 40, width: 40 }}
                  src={createdByPhotoURL}
                />
              ) : (
                <div
                  className="d-flex justify-content-center align-items-center bg-light rounded-circle mr-2 text-secondary"
                  style={{ height: 40, width: 40 }}
                >
                  {createdByDisplayName ? (
                    createdByDisplayName[0]
                  ) : (
                    <Octicon size="medium" icon={Question} />
                  )}
                </div>
              )}

              <div>
                <div className="small text-muted">
                  {createdByDisplayName || "anonymous"}
                </div>
                <span>{content}</span>
              </div>
            </div>

            <div>
              <span className="mr-2">{likeCount}</span>
              <button
                style={{ height: 32, width: 32 }}
                className={`btn btn-sm rounded-circle shadow-sm ${
                  likedBy[userAuthAccount.displayName]
                    ? "bg-primary"
                    : "bg-light"
                }`}
                onClick={() => handleOnClickLike(id)}
              >
                <div
                  className={`d-flex justify-content-center align-items-center pb-1 ${
                    likedBy[createdByDisplayName]
                      ? "text-white"
                      : "text-secondary"
                  }`}
                >
                  <Octicon icon={ChevronUp} />
                </div>
              </button>
            </div>
          </li>
        );
      }}
    </Draggable>
  );
};
