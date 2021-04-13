import * as React from "react";
import { PageContainer } from "../components/PageContainer";
import { Link, useParams } from "react-router-dom";
import { useAnalyticsPage, AnalyticsPage } from "../hooks/use-analytics-page";
import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";
import { ErrorMessageBanner } from "../components/ErrorMessageBanner";
import { NotificationBanner } from "../components/NotificationBanner";
import { Button } from "../components/Button";
import * as Sentry from "@sentry/react";

import {useLoginWithGoogle} from  '../hooks/use-login-with-google'
import {GoogleOAuthButton} from '../components/GoogleOAuthButton'

interface EarlyAccessCode {
  id: string;
  name: string;
}


export function EarlyAccessPage() {
  useAnalyticsPage(AnalyticsPage.EARLY_ACCESS);
  const { code } = useParams<{ code: string }>();
  const [workspaceName, setWorkspaceName] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);

  React.useEffect(() => {
    const handleAccessCode = async (code: string) => {
      try {
        const workspaceURLSnapshot = await firebase
          .firestore()
          .collection(FirestoreCollections.WORKSPACE_URL)
          .doc(code)
          .get();
        const earlyAccessCodeSnapshot = await firebase
          .firestore()
          .collection(FirestoreCollections.EARLY_ACCESS_CODES)
          .doc(code)
          .get();

        const workspaceURLDoc = workspaceURLSnapshot.data();
        const earlyAccessCodeDoc = earlyAccessCodeSnapshot.data();

        if (!workspaceURLDoc && !earlyAccessCodeDoc) {
          throw new Error("Invalid url.");
        }

        setWorkspaceName(workspaceURLDoc?.name || earlyAccessCodeDoc?.name);
        return;
      } catch (error) {
        setErrorMessage(error.message);
        Sentry.captureException(error);
        return;
      }
    };
    if (code) {
      handleAccessCode(code);
    }
  }, [code]);

  const handleSubmit = async (event: any) => {
    try {
      // Stop the page from refreshing.
      event.preventDefault();
      // Clear the state.
      setErrorMessage(null);
      setSuccess(false);
      setIsSending(true);
      // Set up the params.
      const email = event.target.email.value;
      const actionCodeSettings = {
        url: window.location.origin + "/magic-link",
        handleCodeInApp: true
      };
      // Make the request.
      await firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings);
      // Update the success state.
      setIsSending(false);
      setSuccess(true);
      // Save the email for use on the /magic-link page.
      window.localStorage.setItem("emailForSignIn", email);
      return;
    } catch (error) {
      // Update the error state.
      setIsSending(false);
      setErrorMessage(error.message);
      Sentry.captureException(error);
      return;
    }
  };

  return (
    <PageContainer>
      {errorMessage && <ErrorMessageBanner message={errorMessage} />}
      {workspaceName && (
        <EarlyAccessAuthForm
          isSending={isSending}
          name={workspaceName}
          onSubmit={handleSubmit}
        />
      )}
      {success && (
        <NotificationBanner
          title="Success!"
          message="A login link has been sent to your email."
        />
      )}
    </PageContainer>
  );
}

// Private components.
interface EarlyAccessAuthFormProps {
  name: string;
  isSending: boolean;
  onSubmit: (event: any) => void;
}
function EarlyAccessAuthForm({ name, isSending, onSubmit }: EarlyAccessAuthFormProps) {
  const loginWithGoogle = useLoginWithGoogle();
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-blue text-3xl mb-2">{name} x Retro</h1>
      <h3 className="text-blue mb-6">
        This is your secret sign in (or up) page. Keep it safe!
      </h3>
      <div className="text-blue text-red">
        <GoogleOAuthButton onClick={loginWithGoogle}>Continue with</GoogleOAuthButton>
      </div>
      <div className="text-blue my-8">or</div>
      <form className="flex flex-col mb-12" onSubmit={onSubmit}>
        <div className="flex flex-col mb-4">
          <label className="text-blue text-sm" htmlFor="email">
            Work email
          </label>
          <input
            type="email"
            name="email"
            placeholder="you@company.com"
            className="text-blue border border-red my-1 h-12 sm:h-8 md:h-8 lg:h-8 w-full max-w-md outline-none px-1"
          />
        </div>
        <Button disabled={isSending} className="text-red" type="submit">
          {isSending ? "Sending..." : "Email a login link"}
        </Button>
      </form>
      <TermsAndConditionsText />
    </div>
  );
}

function TermsAndConditionsText() {
  return (
    <div className="text-pink sm:w-full lg:w-2/5 text-xs">
      <p style={{ color: "rgba(55, 53, 47, 0.4)" }}>
        By creating an account, you acknowledge that you have read and understood, and
        agree to Retro's{" "}
        <Link to="/terms" className="underline">
          Terms & Conditions
        </Link>{" "}
        and{" "}
        <Link to="/privacy" className="underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
