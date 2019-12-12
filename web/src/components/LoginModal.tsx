import React from "react";
import ReactModal from "react-modal";

interface LoginModalProps {
  isOpen: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen }) => {
  return (
    <ReactModal isOpen={isOpen}>
      <p>Log into your account</p>
      <p>It's time to level up your team.</p>
    </ReactModal>
  );
};
