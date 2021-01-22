import * as React from "react";
import jsonp from "jsonp";
import queryString from "query-string";

export enum MAILCHIMP_FORM_FIELDS {
  EMAIL = "EMAIL"
}

export interface MailchimpFormValues {
  [MAILCHIMP_FORM_FIELDS.EMAIL]: string;
}

type MailchimpFormStatus = "idle" | "loading" | "success" | "error";

interface UseMailchimpSignupForm {
  handleSubmit: (values: MailchimpFormValues, onSuccess: (response: any) => void) => void;
  handleReset: () => void;
  status: MailchimpFormStatus;
  message: string;
}

export function useMailchimpSignupForm(url: string): UseMailchimpSignupForm {
  const [status, setStatus] = React.useState<MailchimpFormStatus>("idle");
  const [message, setMessage] = React.useState("");

  const handleReset: () => void = async () => {
    setMessage("");
    setStatus("idle");
  };

  const handleSubmit = (
    values: MailchimpFormValues,
    onSuccess: (response: any) => void
  ) => {
    const query = queryString.stringify(values);
    const endpoint = url.replace("/post?", "/post-json?") + "&" + query;
    setStatus("loading");
    setMessage("");
    return jsonp(endpoint, { param: "c" }, (error, response) => {
      // Yikes.
      if (error) {
        setStatus("error");
        if (error.message.includes("already subscribed")) {
          setMessage("You're already subscribed to the newsletter :)");
        } else {
          setMessage(error.message);
        }
      } else {
        if (response.result !== "success") {
          setStatus("error");
        } else {
          setStatus("success");
        }
        if (response.msg.includes("already subscribed")) {
          setMessage("You're already subscribed to the newsletter :)");
        } else {
          setMessage(response.msg);
        }
      }
    });
  };

  return {
    status,
    message,
    handleSubmit,
    handleReset
  };
}
