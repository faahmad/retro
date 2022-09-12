import * as React from "react";

export const AddButton: React.FC<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
> = ({ onClick, className, children = "+", ...rest }) => {
  return (
    <button
      onClick={onClick}
      className={`h-8 w-8 bg-blue text-white ml-3 border border-red text-xl hover:bg-pink-1/2 active:transform-1 focus:outline-none ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};
