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
        "h-12 w-64 font-size-lg uppercase bg-white border shadow font-black hover:bg-pink-1/2 active:transform-1 focus:outline-none px-4",
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
