import React from "react";
import ReactModal from "react-modal";
import addTeamMemberImage from "../assets/images/add-team-member-image.svg";
import { Button } from "./Button";
import { useFormik } from "formik";
import * as yup from "yup";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
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
      className="bg-white shadow-red border m-auto absolute inset-0 border-red focus:outline-none"
      // IMPORTANT: closeTimeoutMS has to be the same as what is set in the tailwind.css file.
      closeTimeoutMS={200}
    >
      <img
        className="w-full"
        src={addTeamMemberImage}
        alt="Add your team member"
      />
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
  const [inviteUserToWorkspace, { data }] = useMutation(
    INVITE_USER_TO_WORKSPACE_MUTATION,
    {
      refetchQueries: ["user"]
    }
  );
  const [submitButtonText, setSubmitButtonText] = React.useState("Send Invite");
  const [isDisabled, setIsDisabled] = React.useState(false);
  const formik = useFormik({
    initialValues: {
      email: ""
    },
    validationSchema: yup.object().shape({
      email: yup.string().required("Workspace name is required.")
    }),
    onSubmit: async values => {
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
      console.log("data", data);
      setSubmitButtonText("Sent!");
      setTimeout(() => {
        onClick();
      }, 1000);
    }
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="p-4 mt-4 text-blue">
        <p className="font-black">Add your team member</p>
        <input
          id="email"
          name="email"
          placeholder="example@email.com"
          type="text"
          value={formik.values.email}
          onChange={formik.handleChange}
          className="border border-red my-4 h-8 w-full max-w-md"
        ></input>
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
          <Button
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
