import * as React from "react";
import firebase from "../lib/firebase";
import { PageContainer } from "../components/PageContainer";
import { ErrorMessageBanner } from "../components/ErrorMessageBanner";
import { AnalyticsPage, useAnalyticsPage } from "../hooks/use-analytics-page";
import { AnalyticsEvent, useAnalyticsEvent } from "../hooks/use-analytics-event";

export function MagicLinkPage() {
  useAnalyticsPage(AnalyticsPage.MAGIC_LINK);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<firebase.FirebaseError | null>(null);
  const trackEvent = useAnalyticsEvent();
  React.useEffect(() => {
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      const email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        // TODO: Ask user to re-verify their email.
        return;
      }
      firebase
        .auth()
        .signInWithEmailLink(email, window.location.href)
        .then((userCredential) => {
          trackEvent(AnalyticsEvent.USER_CREATED, {
            ...userCredential,
            location: AnalyticsPage.MAGIC_LINK,
            method: "magic-link"
          });
          window.localStorage.removeItem("emailForSignIn");
          setIsLoading(false);
        })
        .catch((error) => {
          setError(error);
          setIsLoading(false);
          return;
        });
    } else {
      setError({
        name: "Not an email link",
        code: "auth/not-email-link",
        message: "couldn't log you in"
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageContainer>
      <div>
        <h1 className="text-blue text-3xl mb-2">Email login link page</h1>
        {error && <ErrorMessageBanner title={error.code} message={error.message} />}
        {!error && isLoading && <h3 className="text-blue mb-6">Logging you in...</h3>}
      </div>
    </PageContainer>
  );
}
