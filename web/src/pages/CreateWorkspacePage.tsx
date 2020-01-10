import React from "react";
import { gql } from "apollo-boost";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Button } from "../components/Button";
import { Redirect } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";

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

  if (userQueryResponse.loading) {
    return <div>Loading...</div>;
  }

  if (userQueryResponse.data.user.workspace !== null) {
    return <Redirect to="/" />;
  }

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

        <CreateWorkspaceForm history={history} />
      </div>
    </div>
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

const CreateWorkspaceForm: React.FC<any> = ({ history }) => {
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
    <form
      className="flex flex-col mx-auto max-w-md"
      onSubmit={formik.handleSubmit}
    >
      <div className="flex flex-col mb-8">
        <label htmlFor="name" className="text-sm font-black">
          Workspace Name
        </label>
        <div>
          <input
            id="name"
            name="name"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.name}
            className="border border-red my-1 h-8 w-full max-w-md"
          ></input>
        </div>
        <p className="text-xs">The name of your workspace. Keep it simple.</p>
      </div>

      <div className="flex flex-col mb-8">
        <label htmlFor="url" className="text-sm font-black">
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
            id="allowedEmailDomain"
            name="allowedEmailDomain"
            type="text"
            placeholder="example.com"
            value={formik.values.allowedEmailDomain}
            onChange={formik.handleChange}
            className="border border-red my-1 h-8 w-full max-w-md"
          ></input>
        </div>
        <p className="text-xs">
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
  );
};
