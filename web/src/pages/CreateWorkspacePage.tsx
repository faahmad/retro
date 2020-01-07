import React from "react";
import { Button } from "../components/Button";

export const CreateWorkspacePage = () => {
  return (
    <div className="create-workspace-page flex flex-col w-full justify-center my-8 text-blue">
      <div className="landing-page__above-the-fold w-1/2 max-w-6xl m-auto">
        <div className="text-center">
          <h1 className="text-2xl">Let's set up a home for all your retros</h1>
          <h3 className="text-lg">
            You can always create another workspace later.
          </h3>
        </div>

        <hr className="my-8"></hr>

        <div className="flex flex-col mx-auto max-w-md">
          <div className="flex flex-col mb-8">
            <label htmlFor="name" className="text-sm font-black">
              Workspace Name
            </label>
            <div>
              <input
                name="name"
                type="text"
                className="border border-blue shadow mt-1 mb-2 h-8 w-full max-w-md"
              ></input>
            </div>
            <p className="text-xs">
              The name of your workspace. Keep it simple.
            </p>
          </div>

          <div className="flex flex-col mb-8">
            <label htmlFor="url" className="text-sm font-black">
              Workspace URL (Optional)
            </label>
            <div className="flex items-center">
              www.retro.app/
              <input
                name="url"
                type="text"
                className="border border-blue shadow mt-1 mb-2 h-8 flex-1"
              ></input>
            </div>
            <p className="text-xs">
              Share this link to add anyone with an allowed email domain to your
              workspace.
            </p>
          </div>

          <div className="flex flex-col mb-8">
            <label htmlFor="allowedEmailDomain" className="text-sm font-black">
              Allowed Email Domain (Optional)
            </label>
            <div>
              <input
                name="allowedEmailDomain"
                type="text"
                className="border border-blue shadow mt-1 mb-2 h-8 w-full max-w-md"
              ></input>
            </div>
            <p className="text-xs">
              Anyone with an email address at this domain can automatically join
              your workspace.
            </p>
          </div>

          <Button className="text-blue mb-2">Create Workspace</Button>
        </div>
      </div>
    </div>
  );
};
