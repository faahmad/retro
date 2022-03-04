import * as React from "react";
import ReactModal from "react-modal";

export function Modal({
  children,
  isOpen,
  onRequestClose
}: {
  children: React.ReactNode;
  isOpen: boolean;
  onRequestClose: () => void;
}) {
  return (
    <ReactModal
      ariaHideApp={false}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        content: {
          maxWidth: "600px",
          maxHeight: "400px",
          padding: "20px"
        },
        overlay: { background: "rgba(17, 38, 156, 0.6)" }
      }}
      className="bg-white shadow-red border m-auto absolute inset-0 border-red focus:outline-none z-50"
      // IMPORTANT: closeTimeoutMS has to be the same as what is set in the tailwind.css file.
      closeTimeoutMS={200}
    >
      {children}
    </ReactModal>
  );
}
