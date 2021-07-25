import React from "react";
import ReactModal from "react-modal";
import addTeamMemberImage from "../assets/images/add-team-member-image.svg";
import { Button } from "./Button";
import { useFormik } from "formik";
import * as yup from "yup";
import { useCreateWorkspaceInvite } from "../hooks/use-create-workspace-invite";
import { useAnalyticsEvent, AnalyticsEvent } from "../hooks/use-analytics-event";
import { AnalyticsPage } from "../hooks/use-analytics-page";
// import * as Sentry from "@sentry/react";
interface InviteUserToWorkspaceModalProps {
  isOpen: boolean;
  onRequestClose: (
    event: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>
  ) => void;
  onClick: () => void;
  workspaceId: string;
  workspaceName: string;
  workspaceOwnerId: string;
  userCount: number;
  invitedUserCount: number;
  workspaceURL: string;
}

export const InviteUserToWorkspaceModal: React.FC<InviteUserToWorkspaceModalProps> = ({
  isOpen,
  onRequestClose,
  onClick,
  workspaceId,
  workspaceName,
  workspaceOwnerId,
  workspaceURL,
  userCount,
  invitedUserCount
}) => {
  // const trackEvent = useAnalyticsEvent();
  // const [copyButtonText, setCopyButtonText] = React.useState("Copy");
  // const inviteLink = `${window.location.origin}/join/${workspaceURL}`;
  // const handleCopyToClipboard = async () => {
  //   try {
  //     await navigator.clipboard.writeText(inviteLink);
  //     setCopyButtonText("Copied!");
  //     setTimeout(() => {
  //       setCopyButtonText("Copy");
  //     }, 2000);
  //     trackEvent(AnalyticsEvent.INVITE_LINK_COPIED, {
  //       inviteLink,
  //       location: AnalyticsPage.DASHBOARD,
  //       component: "InviteUserToWorkspaceModal",
  //       variant: "both"
  //     });
  //     return;
  //   } catch (error) {
  //     Sentry.captureException(error);
  //     setCopyButtonText("Try again");
  //   }
  // };

  return (
    <ReactModal
      ariaHideApp={false}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        content: { maxWidth: "600px", maxHeight: "400px", padding: "20px" },
        overlay: { background: "rgba(17, 38, 156, 0.6)" }
      }}
      className="bg-white shadow-red border m-auto absolute inset-0 border-red focus:outline-none z-50"
      // IMPORTANT: closeTimeoutMS has to be the same as what is set in the tailwind.css file.
      closeTimeoutMS={200}
    >
      <div className="flex items-center justify-center">
        <img src={addTeamMemberImage} alt="Add your team member" />
      </div>

      {/* <div className="flex flex-col p-4">
        <div className="flex justify-between items-end w-full text-blue py-1">
          <p className="text-xl font-black">Invite Link</p>
        </div>
        <p className="text-blue text-xs">
          Share this link with anyone you'd like to join this workspace.
        </p>
        <div className="flex justify-between items-center mt-4">
          <p className="flex-grow text-blue text-xs">{inviteLink}</p>
          <Button
            style={{ width: "11rem" }}
            className="text-white bg-blue border-red shadow-red self-center"
            onClick={handleCopyToClipboard}
          >
            {copyButtonText}
          </Button>
        </div>
      </div>
      <div className="text-blue text-center my-2">or</div> */}
      <InviteUserToWorkspaceForm
        workspaceOwnerId={workspaceOwnerId}
        workspaceId={workspaceId}
        workspaceName={workspaceName}
        userCount={userCount}
        invitedUserCount={invitedUserCount}
        onClick={onClick}
      />
    </ReactModal>
  );
};

const InviteUserToWorkspaceForm: React.FC<{
  workspaceId: string;
  workspaceName: string;
  workspaceOwnerId: string;
  userCount: number;
  invitedUserCount: number;
  onClick: () => void;
}> = ({
  workspaceId,
  workspaceName,
  onClick,
  workspaceOwnerId,
  userCount,
  invitedUserCount
}) => {
  const [submitButtonText, setSubmitButtonText] = React.useState("Send Invite");
  const [isDisabled, setIsDisabled] = React.useState(false);
  const createWorkspaceInvite = useCreateWorkspaceInvite();
  const trackEvent = useAnalyticsEvent();

  const handleSubmit = async (values: any) => {
    setIsDisabled(true);
    setSubmitButtonText("Sending...");
    const workspaceInviteParams = await createWorkspaceInvite({
      workspaceId,
      workspaceName,
      email: values.email
    });
    trackEvent(AnalyticsEvent.USER_INVITED, {
      workspaceId,
      workspaceName,
      userCount,
      invitedUserCount,
      method: "email",
      email: values.email,
      location: AnalyticsPage.DASHBOARD,
      invitedBy:
        workspaceInviteParams?.invitedByUserId === workspaceOwnerId
          ? "workspace-owner"
          : "member"
    });
    setSubmitButtonText("Sent!");
    onClick();
    return;
  };

  const formik = useFormik({
    initialValues: {
      email: ""
    },
    validationSchema: yup.object().shape({
      email: yup
        .string()
        .email("Please enter a valid email.")
        .required("Email address is required.")
    }),
    onSubmit: handleSubmit
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="px-4 text-blue">
        <p className="font-black">Email an Invite</p>
        <div className="my-2 flex justify-around items-center mr-2">
          <div className="flex-grow">
            <input
              id="email"
              name="email"
              placeholder="example@email.com"
              type="text"
              value={formik.values.email}
              onChange={formik.handleChange}
              className="border border-red h-8 w-full px-1"
            />
            {formik.errors.email && formik.touched.email && (
              <p className="text-xs text-red">{formik.errors.email}</p>
            )}
          </div>
          <Button
            className="ml-4"
            style={{ width: "10rem" }}
            type="submit"
            disabled={isDisabled}
          >
            {submitButtonText}
          </Button>
        </div>
      </div>
    </form>
  );
};
