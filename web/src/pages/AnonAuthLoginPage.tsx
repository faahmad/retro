import * as React from 'react';
import { PageContainer } from "../components/PageContainer";
import { Button } from "../components/Button";
import { TermsAndConditionsText } from "./LoginPage";
import { ErrorMessageBanner } from "../components/ErrorMessageBanner";
import firebase from "../lib/firebase";
import * as Sentry from "@sentry/react";

export function AnonAuthLoginPage() {
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const [isSending, setIsSending] = React.useState(false);

    const handleSubmit = async (e: any) => {
        try {
            e.preventDefault()

            await firebase.auth().signInAnonymously();
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
            />
        </PageContainer>
    )
}

function AnonLoginForm({ isSending, onSubmit, title = "Sign in Anonymously" }: any) {
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
