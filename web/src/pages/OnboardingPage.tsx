import React from "react";
import { gql } from "apollo-boost";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Button } from "../components/Button";
import { Redirect } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { LoadingText } from "../components/LoadingText";
import { PageContainer } from "../components/PageContainer";


const USER_QUERY = gql`
  query Workspace {
    user {
      workspace {
        id
        url
      }
    }
  }
`;

const GET_WORKSPACES_THAT_USER_IS_INVITED_TO_QUERY = gql`
  query GetWorkspacesThatUserIsInvitedTo {
    getWorkspacesThatUserIsInvitedTo {
      id
      name
      url
    }
  }
`;

export const OnboardingPage: React.FC<any> = ({ history }) => {
  const [showForm, setShowForm] = React.useState(false);
  const handleToggleForm = () => {
    setShowForm(!showForm);
  };

  const userQueryResponse = useQuery(USER_QUERY);
  const getWorkspacesThatUserIsInvitedToQueryResponse = useQuery(
    GET_WORKSPACES_THAT_USER_IS_INVITED_TO_QUERY
  );

  if (
    userQueryResponse.loading ||
    getWorkspacesThatUserIsInvitedToQueryResponse.loading
  ) {
    return <LoadingText>Loading...</LoadingText>;
  }

  const workspace = userQueryResponse.data.user.workspace;

  if (workspace !== null) {
    return <Redirect to={`/workspaces/${workspace.id}`} />;
  }

  const hasPendingInvites =
    getWorkspacesThatUserIsInvitedToQueryResponse.data
      .getWorkspacesThatUserIsInvitedTo.length !== 0;

  return (
    <React.Fragment>
      {hasPendingInvites && !showForm ? (
        <JoinWorkspaceList
          workspaces={
            getWorkspacesThatUserIsInvitedToQueryResponse.data
              .getWorkspacesThatUserIsInvitedTo
          }
        />
      ) : (
        <CreateWorkspaceForm />
      )}
      {hasPendingInvites && (
        <div className="text-blue w-1/2 max-w-6xl m-auto my-8">
          <div className="text-sm">
            Or{" "}
            <button className="underline" onClick={handleToggleForm}>
              {showForm ? "join your teammates" : "create a new workspace"}
            </button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

const CREATE_WORKSPACE_MUTATION = gql`
  mutation CreateWorkspace($input: CreateWorkspaceInput!) {
    createWorkspace(input: $input) {
      id
      name
      url
    }
  }
`;

const createWorkspaceFormValidationSchema = yup.object().shape({
  name: yup.string().required("Workspace name is required."),
  url: yup
    .string()
    .lowercase()
    .matches(/[A-Za-z0-9-]+/, "Please only use letters, numbers, and dashes."),
  allowedEmailDomain: yup
    .string()
    .lowercase()
    .matches(
      /[A-Za-z0-9.]+/,
      "Please only use letters, numbers, and extension."
    )
});

const CreateWorkspaceForm: React.FC = () => {
  const [createWorkspace] = useMutation(CREATE_WORKSPACE_MUTATION, {
    refetchQueries: ["user"],
    awaitRefetchQueries: true
  });
  const formik = useFormik({
    initialValues: {
      name: "",
      url: "",
      allowedEmailDomain: ""
    },
    validationSchema: createWorkspaceFormValidationSchema,
    onSubmit: async values => {
      await createWorkspace({
        variables: {
          input: {
            name: values.name,
            url: values.url,
            allowedEmailDomain: `@${values.allowedEmailDomain}`
          }
        }
      });
      window.location.replace("/");
    }
  });

  return (
    <div className="create-workspace-page flex flex-col w-full justify-center my-8 text-blue">
      <PageContainer>
      <div className="sm:w-1/2 md:w-1/2 lg:w-4/5 w-full max-w-6xl m-auto">
        <div className="sm:text-center md:text-center lg:text-center">
          <h1 className="text-2xl">Let's set up a home for all your retros</h1>
          <h3 className="text-lg">
            You can always create another workspace later.
          </h3>
        </div>

        <hr className="mt-4 mb-6"></hr>
        <form
          className="flex flex-col mx-auto max-w-md"
          onSubmit={formik.handleSubmit}
        >
          <div className="flex flex-col mb-8">
            <label htmlFor="name" className="text-md sm:text-sm  md:text-sm lg:text-sm font-black">
              Workspace Name
            </label>
            <div>
              <input
                id="name"
                name="name"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.name}
                className="border border-red my-1 h-12 sm:h-8 md:h-8 lg:h-8 w-full max-w-md outline-none px-1"
              ></input>
            </div>
            <p className="text-sm sm:text-xs md:text-xs lg:text-xs">
              The name of your workspace. Keep it simple.
            </p>
          </div>

          <div className="flex flex-col mb-8">
            <label htmlFor="url" className="text-md sm:text-sm md:text-sm lg:text-sm font-black">
              Workspace URL (Optional)
            </label>
            <div className="flex items-center">
              www.retro.app/
              <input
                id="url"
                name="url"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.url}
                className="border border-red my-1 h-12 sm:h-8 md:h-8 lg:h-8 flex-1 outline-none px-1"
              ></input>
            </div>
            <p className="text-sm sm:text-xs md:text-xs lg:text-xs">
              Share this link to add anyone with an allowed email domain to your
              workspace.
            </p>
          </div>

          <div className="flex flex-col mb-8">
            <label htmlFor="allowedEmailDomain" className="text-md sm:text-sm md:text-sm lg:text-sm font-black">
              Allowed Email Domain (Optional)
            </label>
            <div className="flex items-center">
              @
              <input
                id="allowedEmailDomain"
                name="allowedEmailDomain"
                type="text"
                placeholder="example.com"
                value={formik.values.allowedEmailDomain}
                onChange={formik.handleChange}
                className="border border-red my-1 h-12 sm:h-8 md:h-8 lg:h-8 w-full max-w-md outline-none px-1 ml-1"
              ></input>
            </div>
            <p className="text-sm sm:text-xs md:text-xs lg:text-xs">
              Anyone with an email address at this domain can automatically join
              your workspace.
            </p>
          </div>

          <Button
            type="submit"
            className="text-blue mb-2"
            disabled={formik.isSubmitting}
          >
            Create Workspace
          </Button>
        </form>
      </div>
      </PageContainer>
    </div>
  );
};

const JOIN_WORKSPACE_MUTATION = gql`
  mutation JoinWorkspaceMutation($workspaceId: ID!) {
    joinWorkspace(workspaceId: $workspaceId) {
      code
      success
      message
    }
  }
`;

interface JoinWorkspaceListProps {
  workspaces: any[];
}

const JoinWorkspaceList: React.FC<JoinWorkspaceListProps> = ({
  workspaces
}) => {
  const [joinWorkspace] = useMutation(JOIN_WORKSPACE_MUTATION);

  return (
    <div className="flex flex-col w-full justify-center my-8 text-blue">
      <div className="w-1/2 max-w-6xl m-auto">
        <div className="text-center">
          <h1 className="text-2xl">Join your teammates on Retro</h1>
          <h3 className="text-lg">{`You've been invited to ${
            workspaces.length
          } workspace${workspaces.length > 1 ? "s" : ""}.`}</h3>
        </div>

        <hr className="mt-4 mb-6"></hr>

        <ul>
          {workspaces.map(workspace => (
            <li
              onClick={async () => {
                await joinWorkspace({
                  variables: {
                    workspaceId: workspace.id
                  }
                });
                window.location.replace("/");
              }}
              className="border border-blue shadow p-4 mb-4 hover:bg-pink-1/2 cursor-pointer active:transform-1"
              key={workspace.id}
            >
              <span role="img" aria-label="team">
                👯‍♀
              </span>{" "}
              Join <span className="font-black">{workspace.name}</span> >
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
