import React from "react";
import { Button } from "../components/Button";

export const LandingPage: React.FC = () => {
  return (
    <div className="container p-4">
      {/* <h1>The Retrospective Tool For People Who Hate Retros.</h1> */}
      <Button onClick={() => {}}>Primary</Button>
      <Button className="ml-2" color="blue" onClick={() => {}}>
        Secondary
      </Button>
    </div>
  );
};
