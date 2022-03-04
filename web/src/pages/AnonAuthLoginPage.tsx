import * as React from 'react';
import { useParams } from 'react-router-dom';
import { PageContainer } from "../components/PageContainer";
import { Button } from "../components/Button";
import { TermsAndConditionsText } from "./LoginPage";
import { ErrorMessageBanner } from "../components/ErrorMessageBanner";
import { useCurrentUser } from "../hooks/use-current-user";
import { FirestoreCollections } from "../constants/firestore-collections";
import firebase from "../lib/firebase";
import * as Sentry from "@sentry/react";

const db = firebase.firestore();
const workspaceCollection = db.collection(FirestoreCollections.WORKSPACE);

export function AnonAuthLoginPage() {
    const currentUser = useCurrentUser();
    const { workspaceId } = useParams();
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const [isSending, setIsSending] = React.useState(false);
    const [userName, setUserName] = React.useState();

    // need to get the workspace name somehow
    const handleSubmit = async (e: any) => {
        try {
            e.preventDefault()
            console.log(workspaceCollection, "WORKSPACE COLLECTION");
            const workspaceStuff = await workspaceCollection.doc(workspaceId).get();
            console.log(workspaceStuff, "WORKSPACE STUFF")
            const firebaseReturn: any = await firebase.auth().signInAnonymously();
            console.log(currentUser, "CURRENT USER");
            console.log(firebaseReturn, "FIREBASE RETURN");
        } catch (error) {
            setIsSending(false);
            setErrorMessage(error.message);
            Sentry.captureException(error);
            return;
        }
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
    )
}

function AnonLoginForm({ isSending, onSubmit, userName, setUserName, title = "Sign in Anonymously" }: any) {
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
