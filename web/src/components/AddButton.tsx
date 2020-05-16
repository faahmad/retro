import * as React from 'react';

export const AddButton: React.FC<React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>> = ({ onClick, className, children = '+', ...rest }) => {
  return (
    <button
      onClick={onClick}
      className={`h-10 w-10 bg-blue text-white ml-3 border border-red shadow shadow-red text-2xl hover:bg-pink-1/2 active:transform-1 focus:outline-none ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};
