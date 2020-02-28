import React from "react";
import clsx from "clsx";

// These props are required by us.
interface RetroButtonProps {
  className?: string;
  children: React.ReactNode;
  style?: object;
}

type ButtonProps = RetroButtonProps &
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >;

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  style,
  ...rest
}) => {
  return (
    <button
      style={style}
      className={clsx(
        "h-12 w-64 font-size-lg uppercase bg-white border shadow font-black hover:bg-pink-1/2 active:transform-1 focus:outline-none px-4",
        {
          [className]: !!className
        }
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
