import * as React from "react";
import { RetroList } from "../components/RetroList";

export const RetroBoardPage: React.FC = () => {
  return (
    <div className="retro-board-page container mt-3">
      <div className="row">
        <div className="col-sm-12 col-lg-6 px-0">
          <RetroList type="good" buttonClassName="success" />
        </div>
        <div className="col-sm-12 col-lg-6 px-0">
          <RetroList type="bad" buttonClassName="danger" />
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12 col-lg-6 px-0">
          <RetroList type="actions" buttonClassName="warning" />
        </div>
        <div className="col-sm-12 col-lg-6 px-0">
          <RetroList type="questions" buttonClassName="primary" />
        </div>
      </div>
    </div>
  );
};
