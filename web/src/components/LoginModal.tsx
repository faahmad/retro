import React from "react";
import ReactModal from "react-modal";
import loginModalImage from "../assets/images/login-modal-image.svg";
import { GoogleOAuthButton } from "./GoogleOAuthButton";
interface LoginModalProps {
  isOpen: boolean;
  onRequestClose: (
    event: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>
  ) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onRequestClose
}) => {
  return (
    <ReactModal
      ariaHideApp={false}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        content: { width: "420px", height: "390px" },
        overlay: { background: "rgba(17, 38, 156, 0.6)" }
      }}
      className="bg-white shadow-red border m-auto absolute inset-0 border-red focus:outline-none"
      // IMPORTANT: closeTimeoutMS has to be the same as what is set in the tailwind.css file.
      closeTimeoutMS={200}
    >
      <img className="w-full" src={loginModalImage} alt="Everybody's Welcome" />
      <div className="text-center p-4 text-blue">
        <p className="font-black">Log into your account</p>
        <p>It's time to level up your team.</p>
        <GoogleOAuthButton
          buttonClassName="mt-6"
          textClassName="justify-center"
        >
          Continue With
        </GoogleOAuthButton>
      </div>
    </ReactModal>
  );
};
