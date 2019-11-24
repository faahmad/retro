import React from "react";
import { Button } from "../components/Button";

export const LandingPage: React.FC = () => {
  return (
    <div className="container pt-8">
      <header>
        <div className="flex flex-row flex-wrap justify-between w-2/3 mx-auto">
          <div className="mb-2">
            <h1 className="text-guava font-black text-3xl">Retro</h1>
            <p className="text-blueberry">welcome to new school teamwork.</p>
          </div>
          <div className="flex flex-col">
            <Button className="mb-2 text-right" onClick={() => {}}>
              Login
            </Button>
            <Button className="text-right" onClick={() => {}}>
              <span>Signup With Google</span>
            </Button>
          </div>
        </div>
      </header>
    </div>
  );
};
