import "./Button.scss";
import React from "react";
import clsx from "clsx";

interface ButtonProps {
  className?: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  onClick
}) => {
  return (
    <button
      className={clsx(
        "button border border-blueberry focus:outline-none px-4",
        {
          [className]: !!className
        }
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
