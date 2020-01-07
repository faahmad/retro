import React from "react";
import { gql } from "apollo-boost";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Button } from "../components/Button";
import { Redirect } from "react-router-dom";

const CREATE_WORKSPACE_MUTATION = gql`
  mutation CreateWorkspace($input: CreateWorkspaceInput!) {
    createWorkspace(input: $input) {
      id
      name
      url
    }
  }
`;

const USER_QUERY = gql`
  query User {
    user {
      workspace {
        id
        url
      }
    }
  }
`;

export const CreateWorkspacePage: React.FC<any> = ({ history }) => {
  const userQueryResponse = useQuery(USER_QUERY);
  const [createWorkspace, { loading }] = useMutation(CREATE_WORKSPACE_MUTATION);
  const [formState, setFormState] = React.useState({
    name: "",
    url: "",
    allowedEmailDomain: ""
  });

  if (userQueryResponse.loading) {
    return <div>Loading...</div>;
  }

  if (userQueryResponse.data.user.workspace !== null) {
    return <Redirect to="/" />;
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await createWorkspace({ variables: { input: formState } });
    history.push("/");
  };

  return (
    <div className="create-workspace-page flex flex-col w-full justify-center my-8 text-blue">
      <div className="landing-page__above-the-fold w-1/2 max-w-6xl m-auto">
        <div className="text-center">
          <h1 className="text-2xl">Let's set up a home for all your retros</h1>
          <h3 className="text-lg">
            You can always create another workspace later.
          </h3>
        </div>

        <hr className="mt-4 mb-6"></hr>

        <form
          className="flex flex-col mx-auto max-w-md"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col mb-8">
            <label htmlFor="name" className="text-sm font-black">
              Workspace Name
            </label>
            <div>
              <input
                onChange={handleChange}
                name="name"
                type="text"
                className="border border-red my-1 h-8 w-full max-w-md"
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
                onChange={handleChange}
                name="url"
                type="text"
                className="border border-red my-1 h-8 flex-1"
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
            <div className="flex items-center">
              @
              <input
                onChange={handleChange}
                name="allowedEmailDomain"
                type="text"
                className="border border-red my-1 h-8 w-full max-w-md"
                placeholder="example.com"
              ></input>
            </div>
            <p className="text-xs">
              Anyone with an email address at this domain can automatically join
              your workspace.
            </p>
          </div>

          <Button type="submit" className="text-blue mb-2" disabled={loading}>
            Create Workspace
          </Button>
        </form>
      </div>
    </div>
  );
};
