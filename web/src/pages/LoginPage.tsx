import * as React from "react";
import { PageContainer } from "../components/PageContainer";
import { GoogleOAuthButton } from "../components/GoogleOAuthButton";
import { useLoginWithGoogle } from "../hooks/use-login-with-google";
import { Link } from "react-router-dom";

export function LoginPage() {
  const [input, setInput] = React.useState("");

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
      {input === "CrowdFox" && <Login />}
    </PageContainer>
  );
}

function Login() {
  const loginWithGoogle = useLoginWithGoogle();
  return (
    <div className="flex flex-col items-center lg:text-center m-0">
      <h1 className="text-blue text-3xl mb-4">Log in</h1>
      <div className="text-blue text-red">
        <GoogleOAuthButton onClick={loginWithGoogle}>Continue with</GoogleOAuthButton>
      </div>
      <div className="mt-20 text-pink sm:w-full lg:w-2/5 text-center text-xs">
        <p style={{ color: "rgba(55, 53, 47, 0.4)" }}>
          By clicking "Continue with Google" above, you acknowledge that you have read and
          understood, and agree to Retro's{" "}
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
    </div>
  );
}
