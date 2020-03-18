import * as React from "react";
import { RouteComponentProps, useParams } from "react-router-dom";

export const RetroBoardPage: React.FC<RouteComponentProps> = () => {
  const params = useParams<{ teamId: string; retroId: string }>();
  console.log(params);

  if (!params.retroId) {
    return (
      <div className="my-16 w-4/5 max-w-6xl m-auto">
        <p className="text-red">Invalid retro id</p>
      </div>
    );
  }

  return (
    <div className="my-16 w-4/5 max-w-6xl m-auto">
      <h1 className="text-blue font-black text-3xl">
        Retro Board - {params.retroId}
      </h1>
      <p className="text-blue mt-2">Coming soon...</p>
    </div>
  );
};
