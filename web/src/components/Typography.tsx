import * as React from "react";

export function Title({ children }: { children: React.ReactChild }) {
  return <h1 className="text-blue font-black text-3xl">{children}</h1>;
}
