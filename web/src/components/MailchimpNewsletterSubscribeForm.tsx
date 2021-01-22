import * as React from "react";
import {
  useMailchimpSignupForm,
  MAILCHIMP_FORM_FIELDS,
  MailchimpFormValues
} from "../hooks/use-mailchimp-signup-form";
import { Button } from "../components/Button";
import { useAnalyticsEvent, AnalyticsEvent } from "../hooks/use-analytics-event";

const MAILCHIMP_SIGNUP_FORM_URL =
  "https://app.us7.list-manage.com/subscribe/post?u=2cbb020900cd578c5d5e85b1e&amp;id=128ed7e249";

type MailchimpFormTarget = EventTarget & {
  EMAIL: { value: string };
};

interface MailchimpNewsLetterSignupFormProps {
  className?: string;
  location: string;
}

export function MailchimpNewsLetterSignupForm({
  className = "",
  location
}: MailchimpNewsLetterSignupFormProps) {
  const { handleSubmit, status, message } = useMailchimpSignupForm(
    MAILCHIMP_SIGNUP_FORM_URL
  );
  const trackEvent = useAnalyticsEvent();

  const handleSuccess = (values: MailchimpFormValues) => {
    return trackEvent(AnalyticsEvent.JOINED_NEWSLETTER, {
      ...values,
      location,
      tool: "Mailchimp"
    });
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as MailchimpFormTarget;
    const values = {
      EMAIL: target.EMAIL.value
    };
    return handleSubmit(values, handleSuccess);
  };

  const isDisabled = status === "loading" || status === "success";

  return (
    <div className={className}>
      <form onSubmit={handleFormSubmit}>
        <div>
          <MailchimpCAPTCHAInput />
          <div className="flex flex-col">
            <input
              required
              className="h-12 w-full lg:w-3/4 text-lg px-4 border border-blue"
              disabled={isDisabled}
              type="email"
              name={MAILCHIMP_FORM_FIELDS.EMAIL}
              placeholder="you@work.com"
            />
            <Button type="submit" className="mt-4 w-full lg:w-64 bg-pink text-blue">
              Get 2 Months Free
            </Button>
          </div>
          {status === "error" && <p className="mt-2 text-red text-sm">{message}</p>}
        </div>
      </form>
    </div>
  );
}

/** 
  Real people should not fill this in and expect good things.
  Do not remove this or risk form bot signups.
*/
function MailchimpCAPTCHAInput() {
  return (
    <div className="hidden" aria-hidden="true">
      <input type="text" name="b_2cbb020900cd578c5d5e85b1e_128ed7e249" tabIndex={-1} />
    </div>
  );
}
