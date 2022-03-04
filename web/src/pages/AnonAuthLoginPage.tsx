import * as React from "react";
import { useParams } from "react-router-dom";
import { PageContainer } from "../components/PageContainer";
import { Button } from "../components/Button";
import { TermsAndConditionsText } from "./LoginPage";
import { ErrorMessageBanner } from "../components/ErrorMessageBanner";
import { FirestoreCollections } from "../constants/firestore-collections";
import firebase from "../lib/firebase";
import * as Sentry from "@sentry/react";
import { isNewUser } from "../services/auth-service";
import { User } from "../types/user";
import { useCurrentUser } from "../hooks/use-current-user";
import { CurrentUserState } from "../contexts/CurrentUserContext";
import { increment } from "../utils/firestore-utils";

function useCreateAnonWorkspaceUser() {
  async function handleCreate(input: {
    workspaceId: string;
    userId: string;
    displayName: string;
  }) {
    return firebase.firestore().runTransaction(async (transaction) => {
      // Create a user document.
      const userRef = firebase
        .firestore()
        .collection(FirestoreCollections.USER)
        .doc(input.userId);
      const newUser: User = {
        id: input?.userId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        displayName: input.displayName,
        email: null,
        phoneNumber: null,
        photoUrl: null,
        workspaces: []
      };
      await transaction.set(userRef, newUser);

      // Create a workspace user document.
      const workspaceUserRef = firebase
        .firestore()
        .collection(FirestoreCollections.WORKSPACE_USER)
        .doc(`${input.workspaceId}_${input.userId}`);
      await transaction.set(workspaceUserRef, {
        userDisplayName: input.displayName,
        workspaceId: input.workspaceId,
        userId: input.userId,
        userEmail: null,
        userPhotoURL: null,
        userRole: "member"
      });

      // Increment the workspace's userCount.
      const workspaceRef = firebase
        .firestore()
        .collection(FirestoreCollections.WORKSPACE)
        .doc(input.workspaceId);
      await transaction.update(workspaceRef, {
        userCount: increment()
      });
    });
  }

  return handleCreate;
}

export function AnonAuthLoginPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const createAnonWorkspaceUser = useCreateAnonWorkspaceUser();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isSending, setIsSending] = React.useState(false);
  const [userName, setUserName] = React.useState("");
  const currentUser = useCurrentUser();

  // need to get the workspace name somehow
  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault();
      if (!userName.trim()) throw new Error("Invalid user name");

      const userCredential = await firebase.auth().signInAnonymously();

      if (isNewUser(userCredential) && userCredential.user) {
        await createAnonWorkspaceUser({
          workspaceId,
          displayName: userName,
          userId: userCredential.user?.uid
        });
      }
    } catch (error) {
      setIsSending(false);
      setErrorMessage(error.message);
      Sentry.captureException(error);
      return;
    }
  };

  if (currentUser.state === CurrentUserState.LOADING) {
    return (
      <PageContainer>
        <p className="text-blue">Loading...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {errorMessage && <ErrorMessageBanner message={errorMessage} />}
      <AnonLoginForm
        isSending={isSending}
        onSubmit={handleSubmit}
        userName={userName}
        setUserName={setUserName}
      />
    </PageContainer>
  );
}

function AnonLoginForm({
  isSending,
  onSubmit,
  userName,
  setUserName,
  title = "Set your username to join your team"
}: any) {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-blue text-3xl mb-6 text-center">{title}</h1>
      <form className="flex flex-col mb-12" onSubmit={onSubmit}>
        <div className="flex flex-col mb-4">
          <label className="text-blue text-sm" htmlFor="userName">
            Username
          </label>
          <input
            type="text"
            name="userName"
            placeholder="Please enter a username"
            className="text-blue border border-red my-1 h-12 sm:h-8 md:h-8 lg:h-8 w-full max-w-md outline-none px-1"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <Button disabled={isSending} className="text-red" type="submit">
          {isSending ? "Sending..." : "Sign in"}
        </Button>
      </form>
      <TermsAndConditionsText />
    </div>
  );
}
