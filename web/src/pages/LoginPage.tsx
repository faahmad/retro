import * as React from "react";
import { GoogleOAuthButton } from "../components/GoogleOAuthButton";
import { useLoginWithGoogle } from "../hooks/use-login-with-google";
import { PageContainer } from "../components/PageContainer";
import { Link, useHistory } from "react-router-dom";
import { useAnalyticsPage, AnalyticsPage } from "../hooks/use-analytics-page";
import firebase from "../lib/firebase";
import { ErrorMessageBanner } from "../components/ErrorMessageBanner";
import { Button } from "../components/Button";
import { Navbar } from "../components/Navbar";
import * as Sentry from "@sentry/react";

import { useCurrentUser } from "../hooks/use-current-user";
import { LoadingText } from "../components/LoadingText";
import { isNewUser } from "../services/auth-service";
import { createUser } from "../services/create-user";
import { AnalyticsEvent, useAnalyticsEvent } from "../hooks/use-analytics-event";

export function LoginPage() {
  useAnalyticsPage(AnalyticsPage.LOGIN);

  const currentUser = useCurrentUser();
  if (currentUser.state === "loading") {
    return <LoadingText>Loading...</LoadingText>;
  }

  return (
    <PageContainer>
      <Navbar isLoggedIn={false} />
      <LoginFormContainer title="Sign in" type="signin" />
    </PageContainer>
  );
}

export function LoginFormContainer({
  title,
  type
}: {
  title: string;
  type: "signup" | "signin";
}) {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isSending, setIsSending] = React.useState(false);
  const history = useHistory();
  const trackEvent = useAnalyticsEvent();

  const handleSignUp = async (event: any) => {
    try {
      // Stop the page from refreshing.
      event.preventDefault();
      // Clear the state.
      setErrorMessage(null);
      setIsSending(true);
      // Set up the params.
      const email = event.target.email.value;
      const password = event.target.password.value;
      // Make the request.
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      if (isNewUser(userCredential)) {
        await createUser(userCredential);
        trackEvent(AnalyticsEvent.USER_CREATED, {
          ...userCredential,
          location: AnalyticsPage.SIGNUP,
          method: "email password"
        });
      }
      // Update the success state.
      setIsSending(false);
      history.push("/onboarding");
      return;
    } catch (error) {
      // Update the error state.
      setIsSending(false);
      setErrorMessage(error.message);
      Sentry.captureException(error);
      return;
    }
  };

  const handleSignIn = async (event: any) => {
    try {
      // Stop the page from refreshing.
      event.preventDefault();
      // Clear the state.
      setErrorMessage(null);
      setIsSending(true);
      // Set up the params.
      const email = event.target.email.value;
      const password = event.target.password.value;
      // Make the request.
      await firebase.auth().signInWithEmailAndPassword(email, password);
      // Update the success state.
      setIsSending(false);
      history.push("/");
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
        onSubmit={type === "signin" ? handleSignIn : handleSignUp}
      />
    </PageContainer>
  );
}

// Private components.
function LoginForm({
  isSending,
  onSubmit,
  title
}: {
  isSending: boolean;
  onSubmit: (event: any) => Promise<void>;
  title: string;
}) {
  const loginWithGoogle = useLoginWithGoogle();
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-blue text-3xl mb-6 text-center">{title}</h1>
      <div className="text-blue text-red">
        <GoogleOAuthButton onClick={loginWithGoogle}>Continue with</GoogleOAuthButton>
      </div>
      <div className="text-blue my-8">or</div>
      <form className="flex flex-col mb-12" onSubmit={onSubmit}>
        <div className="flex flex-col mb-1">
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
        <div className="flex flex-col mb-4">
          <label className="text-blue text-sm" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            name="password"
            className="text-blue border border-red my-1 h-12 sm:h-8 md:h-8 lg:h-8 w-full max-w-md outline-none px-1"
          />
        </div>
        <Button disabled={isSending} className="text-red" type="submit">
          {isSending ? "Sending..." : "Submit"}
        </Button>
      </form>
      <TermsAndConditionsText />
    </div>
  );
}

export function TermsAndConditionsText() {
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
