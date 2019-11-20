import React from "react";

interface ButtonProps {
  children: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button
      className="bg-white p-2 h-10 w-64 border border-black uppercase"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
