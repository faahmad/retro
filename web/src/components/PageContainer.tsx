import * as React from 'react';

export const PageContainer: React.FC = ({ children }) => {
  return <div className="my-16 w-4/5 max-w-6xl m-auto">{children}</div>;
};
