import * as React from "react";
import { GoogleOAuthButton } from "../components/GoogleOAuthButton";
import { useLoginWithGoogle } from "../hooks/use-login-with-google";
import { PageContainer } from "../components/PageContainer";
import { Link } from "react-router-dom";
import { useAnalyticsPage, AnalyticsPage } from "../hooks/use-analytics-page";
import firebase from "../lib/firebase";
import { ErrorMessageBanner } from "../components/ErrorMessageBanner";
import { NotificationBanner } from "../components/NotificationBanner";
import { Button } from "../components/Button";
import * as Sentry from "@sentry/react";

export function LoginPage() {
  useAnalyticsPage(AnalyticsPage.LOGIN);
  const [input, setInput] = React.useState("");

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);

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
      <form className="flex flex-col items-center mb-16">
        <label className="text-blue" htmlFor="secure-login">
          Secure login
        </label>
        <input
          placeholder="What's the password?"
          className="text-blue border border-red my-1 h-12 sm:h-8 md:h-8 lg:h-8 w-full max-w-md outline-none px-1"
          type="text"
          name="secure-login"
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
      {input === "CrowdFox" && <LoginFormContainer />}
    </PageContainer>
  );
}

export function LoginFormContainer({ onSuccess, title }: any) {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);

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
      <LoginForm
        title={title}
        isSending={isSending}
        onSubmit={handleSubmit}
        onSuccess={onSuccess}
      />
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
function LoginForm({ isSending, onSubmit, title = "Sign in (or up)" }: any) {
  const loginWithGoogle = useLoginWithGoogle();
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-blue text-3xl mb-6 text-center">{title}</h1>
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

