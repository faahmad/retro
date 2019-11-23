import "./Button.scss";
import React from "react";
import clsx from "clsx";

interface ButtonProps {
  children: string;
  color?: "black" | "blue";
  className?: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  color = "black",
  className = "",
  onClick
}) => {
  return (
    <button
      className={clsx("button focus:outline-none", {
        "--blue": color === "blue",
        [className]: !!className
      })}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
