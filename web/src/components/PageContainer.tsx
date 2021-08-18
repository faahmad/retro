import * as React from "react";

export const PageContainer: React.FC<{ className?: string }> = ({
  children,
  className
}) => {
  const defaultClassNames = "my-16 w-4/5 max-w-6xl m-auto";
  return <div className={className ? className : defaultClassNames}>{children}</div>;
};
