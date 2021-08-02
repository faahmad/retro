import React from "react";
import { Button } from "../components/Button";
import { Redirect, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { LoadingText } from "../components/LoadingText";
import { PageContainer } from "../components/PageContainer";
import { useCurrentUser } from "../hooks/use-current-user";
import { getWorkspaceFromCurrentUser } from "../utils/workspace-utils";
import { ErrorMessageBanner } from "../components/ErrorMessageBanner";
import { cleanDuplicateKeyErrorMessage } from "../utils/error-utils";
import { useCreateWorkspace } from "../hooks/use-create-workspace";
import { useGetWorkspaceInvitesByEmail } from "../hooks/use-get-workspace-invites-by-email";
import { WorkspaceInvite } from "../types/workspace-invite";
import { useJoinWorkspace } from "../hooks/use-join-workspace";
import { useAnalyticsPage, AnalyticsPage } from "../hooks/use-analytics-page";
import { AnalyticsEvent, useAnalyticsEvent } from "../hooks/use-analytics-event";
import * as Sentry from "@sentry/react";

export function OnboardingPage() {
  useAnalyticsPage(AnalyticsPage.ONBOARDING_PAGE);
  const currentUser = useCurrentUser();

  const [showForm, setShowForm] = React.useState(false);
  const handleToggleForm = () => {
    setShowForm(!showForm);
  };

  const { data, loading } = useGetWorkspaceInvitesByEmail(currentUser.auth?.email);
  const workspace = getWorkspaceFromCurrentUser(currentUser);

  if (loading) {
    return <LoadingText>Loading...</LoadingText>;
  }

  // If the user already has a workspace,
  // we should redirect them to the DashboardPage.
  if (workspace) {
    return <Redirect to={`/workspaces/${workspace.id}`} />;
  }

  const hasPendingInvites = data.length !== 0;

  return (
    <React.Fragment>
      {hasPendingInvites && !showForm ? (
        <JoinWorkspaceList workspaceInvites={data} />
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
}

const createWorkspaceFormValidationSchema = yup.object().shape({
  name: yup.string().required("Workspace name is required."),
  url: yup
    .string()
    .lowercase()
    .matches(/[A-Za-z0-9-]+/, "Please only use letters, numbers, and dashes.")
    .required("Workspace URL is required."),
  allowedEmailDomain: yup
    .string()
    .lowercase()
    .matches(/[A-Za-z0-9.]+/, "Please only use letters, numbers, and extension.")
});

type CreateWorkspaceFormValues = {
  name: string;
  url: string;
  allowedEmailDomain: string;
};

const CreateWorkspaceForm: React.FC = () => {
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const createWorkspace = useCreateWorkspace();
  const history = useHistory();
  const trackEvent = useAnalyticsEvent();
  const currentUser = useCurrentUser();

  const handleSetErrorMessage = (message: string) => {
    return setErrorMessage(cleanDuplicateKeyErrorMessage(message));
  };

  const handleSubmit = async (values: CreateWorkspaceFormValues) => {
    try {
      const workspaceRef = await createWorkspace({
        name: values.name,
        url: values.url,
        allowedEmailDomain: `@${values.allowedEmailDomain}`
      });
      setShowSuccessMessage(true);
      trackEvent(AnalyticsEvent.WORKSPACE_CREATED, {
        location: AnalyticsPage.ONBOARDING_PAGE,
        workspaceId: workspaceRef?.id
      });
      history.push("/onboarding/invites");
      return;
    } catch (error) {
      handleSetErrorMessage(error.message);
      Sentry.captureException(error);
      return;
    }
  };

  const email = currentUser.auth?.email || "";
  const formik = useFormik({
    initialValues: {
      name: "",
      url: "",
      allowedEmailDomain: email.slice(email.indexOf("@") + 1)
    },
    validationSchema: createWorkspaceFormValidationSchema,
    onSubmit: handleSubmit
  });

  if (showSuccessMessage) {
    return <LoadingText>Creating your new workspace! Hang tight...</LoadingText>;
  }

  return (
    <div className="create-workspace-page flex flex-col w-full justify-center my-8 text-blue">
      <PageContainer>
        <div className="sm:w-1/2 md:w-1/2 lg:w-4/5 w-full max-w-6xl m-auto">
          {errorMessage && (
            <div className="mb-4">
              <ErrorMessageBanner
                title="Oops, something went wrong. Our bad. Please try again."
                message={errorMessage}
              />
            </div>
          )}
          <div className="sm:text-center md:text-center lg:text-center">
            <h1 className="text-2xl">Let's set up a home for all your retros</h1>
            {/* <h3 className="text-lg">You can always create another workspace later.</h3> */}
          </div>

          <hr className="mt-4 mb-6"></hr>
          <form className="flex flex-col mx-auto max-w-md" onSubmit={formik.handleSubmit}>
            <div className="flex flex-col mb-8">
              <label
                htmlFor="name"
                className="text-md sm:text-sm  md:text-sm lg:text-sm font-black"
              >
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
              {formik.touched.name && formik.errors.name && (
                <p className="text-red text-sm sm:text-xs md:text-xs lg:text-xs">
                  {formik.errors.name}
                </p>
              )}
            </div>

            <div className="flex flex-col mb-8">
              <label
                htmlFor="url"
                className="text-md sm:text-sm md:text-sm lg:text-sm font-black"
              >
                Workspace URL
              </label>
              <div className="flex items-center">
                www.retro.app/join/
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
              {formik.touched.url && formik.errors.url && (
                <p className="text-red text-sm sm:text-xs md:text-xs lg:text-xs">
                  {formik.errors.url}
                </p>
              )}
            </div>

            <div className="flex flex-col mb-8">
              <label
                htmlFor="allowedEmailDomain"
                className="text-md sm:text-sm md:text-sm lg:text-sm font-black"
              >
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
                Anyone with an email address at this domain can automatically join your
                workspace. We guessed yours!
              </p>
              {formik.touched.allowedEmailDomain && formik.errors.allowedEmailDomain && (
                <p className="text-red text-sm sm:text-xs md:text-xs lg:text-xs">
                  {formik.errors.allowedEmailDomain}
                </p>
              )}
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

interface JoinWorkspaceListProps {
  workspaceInvites: WorkspaceInvite[];
}

const JoinWorkspaceList: React.FC<JoinWorkspaceListProps> = ({ workspaceInvites }) => {
  const history = useHistory();
  const joinWorkspace = useJoinWorkspace();
  const [errorMessage, setErrorMessage] = React.useState("");
  const trackEvent = useAnalyticsEvent();

  const handleJoinWorkspace = async (workspaceInvite: WorkspaceInvite) => {
    try {
      setErrorMessage("");
      await joinWorkspace({
        workspaceId: workspaceInvite.workspaceId,
        workspaceName: workspaceInvite.workspaceName,
        workspaceInviteId: workspaceInvite.id
      });
      trackEvent(AnalyticsEvent.WORKSPACE_JOINED, {
        ...workspaceInvite,
        method: "invite",
        location: AnalyticsPage.ONBOARDING_PAGE
      });
      history.push(`/workspaces/${workspaceInvite.workspaceId}`);
      return;
    } catch (error) {
      setErrorMessage(error.message);
      Sentry.captureException(error);
      return;
    }
  };

  return (
    <div className="flex flex-col w-full justify-center my-8 text-blue">
      <div className="w-1/2 max-w-6xl m-auto">
        {errorMessage && (
          <div className="mb-4">
            <ErrorMessageBanner
              title="Couldn't join the workspace :("
              message={errorMessage}
            />
          </div>
        )}
        <div className="text-center">
          <h1 className="text-2xl">Join your teammates on Retro</h1>
          <h3 className="text-lg">{`You've been invited to ${
            workspaceInvites.length
          } workspace${workspaceInvites.length > 1 ? "s" : ""}.`}</h3>
        </div>

        <hr className="mt-4 mb-6"></hr>

        <ul>
          {workspaceInvites.map((workspaceInvite) => (
            <li
              onClick={() => handleJoinWorkspace(workspaceInvite)}
              className="border border-blue shadow p-4 mb-4 hover:bg-pink-1/2 cursor-pointer active:transform-1"
              key={workspaceInvite.workspaceId}
            >
              <span role="img" aria-label="team">
                👯‍♀
              </span>{" "}
              Join <span className="font-black">{workspaceInvite.workspaceName}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
