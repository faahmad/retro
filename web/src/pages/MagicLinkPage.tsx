import * as React from "react";
import firebase from "../lib/firebase";
import { PageContainer } from "../components/PageContainer";
import { ErrorMessageBanner } from "../components/ErrorMessageBanner";

export function MagicLinkPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<firebase.FirebaseError | null>(null);
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
        .then(() => {
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
