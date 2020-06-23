import React from "react";
import ReactModal from "react-modal";
import addTeamMemberImage from "../assets/images/add-team-member-image.svg";
import { Button } from "./Button";
import { useFormik } from "formik";
import * as yup from "yup";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import analytics from "analytics.js";
interface InviteUserToWorkspaceModalProps {
  isOpen: boolean;
  onRequestClose: (
    event: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>
  ) => void;
  onClick: () => void;
  workspaceId: string;
}

export const InviteUserToWorkspaceModal: React.FC<InviteUserToWorkspaceModalProps> = ({
  isOpen,
  onRequestClose,
  onClick,
  workspaceId
}) => {
  return (
    <ReactModal
      ariaHideApp={false}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        content: { maxWidth: "420px", height: "530px", padding: "20px" },
        overlay: { background: "rgba(17, 38, 156, 0.6)" }
      }}
      className="bg-white shadow-red border m-auto absolute inset-0 border-red focus:outline-none z-50"
      // IMPORTANT: closeTimeoutMS has to be the same as what is set in the tailwind.css file.
      closeTimeoutMS={200}
    >
      <img className="w-full" src={addTeamMemberImage} alt="Add your team member" />
      <InviteUserToWorkspaceForm workspaceId={workspaceId} onClick={onClick} />
    </ReactModal>
  );
};

const INVITE_USER_TO_WORKSPACE_MUTATION = gql`
  mutation InviteUserToWorskspace($input: InviteUserToWorkspaceInput!) {
    inviteUserToWorkspace(input: $input) {
      id
      email
      accepted
      createdAt
    }
  }
`;

const InviteUserToWorkspaceForm: React.FC<{
  workspaceId: string;
  onClick: () => void;
}> = ({ workspaceId, onClick }) => {
  const [inviteUserToWorkspace] = useMutation(INVITE_USER_TO_WORKSPACE_MUTATION, {
    refetchQueries: ["WorkspaceQuery"]
  });
  const [submitButtonText, setSubmitButtonText] = React.useState("Send Invite");
  const [isDisabled, setIsDisabled] = React.useState(false);

  const handleSubmit = async (values: any) => {
    setIsDisabled(true);
    setSubmitButtonText("Sending...");
    await inviteUserToWorkspace({
      variables: {
        input: {
          workspaceId,
          email: values.email
        }
      }
    });
    setSubmitButtonText("Sent!");
    analytics.track("User Invited", {
      ...values
    });
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
      <div className="p-4 mt-4 text-blue">
        <p className="font-black">Add your team member</p>
        <div className="my-4">
          <input
            id="email"
            name="email"
            placeholder="example@email.com"
            type="text"
            value={formik.values.email}
            onChange={formik.handleChange}
            className="border border-red h-8 w-full max-w-md px-1"
          />
          {formik.errors.email && formik.touched.email && (
            <p className="text-xs text-red">{formik.errors.email}</p>
          )}
        </div>
        <div className="flex align-center justify-between mt-8">
          {/* 
            FIXME: 2/18/2020 
            Tried to override the styles by passing in classNames,
            but it wasn't working. Decided to use inline for time's sake,
            however, we should be able to override any styles via the className prop.  
          */}
          <Button
            onClick={onClick}
            disabled={isDisabled}
            className="text-red border-none shadow-none"
            style={{ width: "6rem", boxShadow: "none" }}
          >
            Cancel
          </Button>
          <Button style={{ width: "10rem" }} type="submit" disabled={isDisabled}>
            {submitButtonText}
          </Button>
        </div>
      </div>
    </form>
  );
};
