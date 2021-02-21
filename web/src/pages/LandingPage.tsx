import React from "react";
import { Link } from "react-router-dom";

import { HeroImage } from "../images/HeroImage";
import howItWorksInviteImage from "../assets/images/how-it-works-invite-image.svg";
import howItWorksConductImage from "../assets/images/how-it-works-conduct-image.svg";
import howItWorksAnalyzeImage from "../assets/images/how-it-works-analyze-image.svg";
import applicationScreenshotImage from "../assets/images/ui@2x.png";
import landingFooterImage from "../assets/images/landing-page-footer.svg";

import { GoogleOAuthButton } from "../components/GoogleOAuthButton";
import { PageContainer } from "../components/PageContainer";

// import { FeatureFlags } from "../constants/feature-flags";
import { JoinWaitlistButton } from "../components/JoinWaitlistButton";
import { useLoginWithGoogle } from "../hooks/use-login-with-google";
import { useCurrentUser } from "../hooks/use-current-user";
import { CurrentUserState } from "../contexts/CurrentUserContext";

export const LandingPage: React.FC = () => {
  const isSignUpEnabled = false;
  const loginWithGoogle = useLoginWithGoogle();
  const currentUser = useCurrentUser();

  if (currentUser.state === CurrentUserState.LOADING) {
    return null;
  }

  return (
    <div>
      <div className="landing-page flex flex-col w-full justify-center my-8">
        <PageContainer>
          <div className="flex flex-col items-center lg:text-center m-0">
            <div
              className="w-full sm:w-full md:flex-1 lg:flex-1 mt-4"
              aria-label="Retro Hero Image"
            >
              <HeroImage />
            </div>
            <h2 className="text-blue font-black text-2xl">
              Online retrospective tool that will keep
              <br /> your meetings focused, fun, and productive.
            </h2>
            <h3 className="text-blue text-xl mt-2">
              Walk away with actionable insights{" "}
              <span className="underline">every time.</span>
            </h3>
          </div>
        </PageContainer>
        <div className="landing-page__how-it-works relative w-full min-h-full vertical-stripes-blue border border-blue mt-8">
          <div className="w-full min-h-full -z-1 absolute horizontal-stripes-blue"></div>
          <div className="sm:w-full lg:w-4/5 m-auto p-4 py-8">
            <div className="flex items-center justify-center h-16 text-center bg-white text-blue border border-red shadow-red items-center max-w-6xl m-auto">
              <h3 className="text-3xl font-black">Why Retro?</h3>
            </div>
            <div className="mt-10 flex flex-col lg:flex-row justify-between max-w-6xl items-center z-10 m-auto">
              <HowItWorksCard>
                <img
                  alt="Invite"
                  src={howItWorksInviteImage}
                  className="bg-white mb-2"
                  style={{ height: "115px", width: "140px" }}
                />
                <p className="text-xl mb-2">Invite</p>
                <p>Invite your team.</p>
              </HowItWorksCard>
              <HowItWorksCard>
                <img
                  alt="Conduct"
                  src={howItWorksConductImage}
                  className="bg-white mb-2"
                  style={{ height: "115px", width: "140px" }}
                />
                <p className="text-xl mb-2">Conduct</p>
                <p>Conduct your retro using our drag and drop interface.</p>
              </HowItWorksCard>
              <HowItWorksCard>
                <img
                  alt="Conduct"
                  src={howItWorksAnalyzeImage}
                  className="bg-white mb-2"
                  style={{ height: "115px", width: "140px" }}
                />
                <p className="text-xl mb-2">Analyze</p>
                <p>Analyze your team's progress.</p>
              </HowItWorksCard>
            </div>
          </div>
        </div>
        <PageContainer>
          <div className="mt-20 mb-20 flex flex-col lg:flex-row max-w-6xl items-center m-auto">
            <div className="w-full sm:w-2/3 md:w-2/3 lg:w-2/3">
              <img
                alt="Screenshot"
                src={applicationScreenshotImage}
                className="bg-white mb-2 sm:p-10 md:p-10 lg:p-10"
              />
            </div>
            <div className="w-full sm:w-1/3 md:w-1/3 lg:w-1/3 sm:ml-4 md:ml-4 lg:w-ml-4">
              <h3 className="text-3xl text-blue font-black mb-3">
                Pain-Free Interface, Short and Sweet Retros.
              </h3>
              <p className="text-xl text-blue">
                We’re on a mission to take over each team’s most dreaded weekly activity
                and turn it into a fast win for everyone.
              </p>
              {isSignUpEnabled ? (
                <GoogleOAuthButton
                  buttonClassName="mt-4 text-blue bg-pink"
                  textClassName="justify-end"
                  useGoogleIcon={false}
                  onClick={loginWithGoogle}
                >
                  30 day free trial
                </GoogleOAuthButton>
              ) : (
                <div className="mt-4">
                  <JoinWaitlistButton />
                </div>
              )}
            </div>
          </div>
        </PageContainer>
        {/* <hr
          className="flex flex-col justify-center self-center w-3/5 mt-12 mb-12"
          style={{ borderTop: "2px dashed #11269C" }}
        /> */}
        <div className="bg-red text-white p-12">
          <PageContainer>
            <div className="mt-20 mb-20 flex flex-col lg:flex-row max-w-6xl m-auto">
              <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 sm:ml-4 md:ml-4 lg:w-ml-4">
                <h3 className="text-3xl text-white font-black mb-3">
                  Try it for free for a month, then simple pricing forever.
                </h3>
                <p className="text-xl text-white">
                  Our pricing is dead simple. Pay the same price forever regardless of how
                  your team and company grows.
                </p>
              </div>
              <div className="w-full mt-10 sm:w-1/2 md:w-1/2 lg:w-1/2 sm:mt-0 md:mt-0 lg:mt-0 sm:ml-4 md:ml-4 lg:w-ml-4 sm:text-right  md:text-right  lg:text-right">
                <h2 className="text-5xl text-white font-black mb-3">
                  $39.99<span className="text-xl font-normal text-white"> Per Month</span>
                </h2>
                <p className="text-xl text-white">
                  <b>Includes:</b> <br /> One Workspace <br /> Unlimited Teams <br />{" "}
                  Unlimited Boards <br /> Unlimited Team Members
                </p>
              </div>
            </div>
          </PageContainer>
        </div>
        <PageContainer>
          <div className="mt-20 mb-20 flex flex-col lg:flex-row max-w-6xl items-center m-auto">
            <div className="hidden w-full sm:block md:block lg:block sm:w-1/3 md:w-1/3 lg:w-1/3">
              {isSignUpEnabled ? (
                <GoogleOAuthButton
                  buttonClassName="text-blue bg-pink"
                  textClassName="justify-end"
                  useGoogleIcon={false}
                  onClick={loginWithGoogle}
                >
                  Free Trial Inside
                </GoogleOAuthButton>
              ) : (
                <JoinWaitlistButton />
              )}
            </div>
            <div className="w-full sm:w-2/3 md:w-2/3 lg:w-2/3 sm:ml-4 md:ml-4 lg:w-ml-4">
              <h3 className="text-3xl text-blue sm:text-right  md:text-right  lg:text-right font-black mb-3">
                {isSignUpEnabled ? "Play Now!" : "Get Extra Lives for Free."}
              </h3>
              <p className="text-xl sm:text-right  md:text-right  lg:text-right  text-blue">
                {isSignUpEnabled
                  ? "No fees for your first 30 days. Retro is guaranteed to make your team feel more productive. This tool is awesome. We promise."
                  : "We will be launching soon. Get 2 months free when you join our waitlist. No payment information required."}
              </p>
            </div>
            <div className="block w-full sm:hidden md:hidden lg:hidden sm:w-1/3 md:w-1/3 lg:w-1/3">
              {isSignUpEnabled ? (
                <GoogleOAuthButton
                  buttonClassName="mt-4 text-blue bg-pink"
                  textClassName="justify-end"
                  useGoogleIcon={false}
                  onClick={loginWithGoogle}
                >
                  Free Trial Inside
                </GoogleOAuthButton>
              ) : (
                <JoinWaitlistButton />
              )}
            </div>
          </div>
        </PageContainer>
      </div>
      <FAQFooter />
      <LandingPageFooter />
    </div>
  );
};

const HowItWorksCard: React.FC = ({ children }) => {
  return (
    <div className="bg-white h-72 w-64 text-blue border border-red shadow-red flex flex-col items-center p-4 text-center mb-4">
      {children}
    </div>
  );
};

export const FAQFooter = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${landingFooterImage})`,
        backgroundSize: "cover",
        minHeight: "300px"
      }}
      className="w-full flex justify-center items-center"
    >
      <Link to="/faq">
        <h2 className="text-5xl text-pink p-4 sm: p-2 md: p-2 lg:p-2 text-center bg-blue">
          FAQ
        </h2>
      </Link>
    </div>
  );
};

export const LandingPageFooter = () => {
  return (
    <footer className="bg-pink text-blue text-xs p-2 flex justify-between">
      <div className="flex">
        <Link to="/terms" className="px-2">
          Terms of Service
        </Link>
        <Link to="/privacy" className="px-2">
          Privacy Policy
        </Link>
      </div>
      <p className="text-blue">&copy; 2020, Retro Technology</p>
    </footer>
  );
};
