import { TrashIcon } from "@heroicons/react/outline";
import { ShieldExclamationIcon } from "@heroicons/react/solid";
import React from "react";
import ReactModal from "react-modal";
// import { Button } from "./Button";
import { Retro } from "../types/retro";
// import * as Sentry from "@sentry/react";
interface DeleteRetroModalProps {
  isOpen: boolean;
  onRequestClose: (
    event: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>
  ) => void;
  onClickDelete: () => void;
  retro: Retro | null;
}

export const DeleteRetroModal: React.FC<DeleteRetroModalProps> = ({
  isOpen,
  onRequestClose,
  onClickDelete,
  retro
}) => {
  return (
    <ReactModal
      ariaHideApp={false}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        content: { maxWidth: "600px", maxHeight: "400px", padding: "20px" },
        overlay: { background: "rgba(17, 38, 156, 0.6)" }
      }}
      className="bg-white shadow-red border m-auto absolute inset-0 border-red focus:outline-none z-50"
      // IMPORTANT: closeTimeoutMS has to be the same as what is set in the tailwind.css file.
      closeTimeoutMS={200}
    >
      <div className="flex flex-col h-full">
        <div>
          <h3 className="text-red text-xl mb-2 inline-flex items-center">
            <ShieldExclamationIcon className="h-5 w-5 mr-2" />
            Warning
          </h3>
        </div>
        <div className="flex-1">
          <p className="text-blue">
            Are you sure you want to <strong>delete</strong> {retro?.name}? This{" "}
            <strong>cannot be undone</strong> and you will{" "}
            <strong>lose all reflections</strong> from this retro.
          </p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onRequestClose}
            className="h-12 w-48 p-4 border border-blue text-blue mr-4 flex items-center justify-center hover:shadow hover:shadow-blue"
          >
            No, go back
          </button>
          <button
            onClick={onClickDelete}
            className="h-12 w-48 p-4 bg-red text-white flex items-center justify-center hover:shadow hover:shadow-blue"
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Yes, delete
          </button>
        </div>
      </div>
    </ReactModal>
  );
};
