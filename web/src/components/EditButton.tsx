import * as React from "react";
import { PencilEditIcon } from "../components/PencilEditIcon";

interface EditButtonProps {
  onClick: () => void;
}

export const EditButton: React.FC<EditButtonProps> = ({ onClick }) => {
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
