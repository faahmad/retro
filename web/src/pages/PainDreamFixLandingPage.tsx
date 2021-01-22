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
import { useFeature } from "@optimizely/react-sdk";
import { FeatureFlags } from "../constants/feature-flags";
import { JoinWaitlistButton } from "../components/JoinWaitlistButton";
import { useLoginWithGoogle } from "../hooks/use-login-with-google";
import { useCurrentUser } from "../hooks/use-current-user";
import { CurrentUserState } from "../contexts/CurrentUserContext";
import { MailchimpNewsLetterSignupForm } from "../components/MailchimpNewsletterSubscribeForm";

export const PainDreamFixLandingPage: React.FC = () => {
  const [isSignUpEnabled] = useFeature(FeatureFlags.SIGN_UP);
  const loginWithGoogle = useLoginWithGoogle();
  const currentUser = useCurrentUser();

  if (currentUser.state === CurrentUserState.LOADING) {
    return null;
  }

  return (
    <div>
      <div className="landing-page flex flex-col w-full justify-center">
        <PageContainer>
          <div className="flex flex-col-reverse text-center lg:flex-row lg:items-center lg:text-left">
            <div id="hero-title" className="w-full lg:w-1/2 mt-4 lg:mt-0">
              <h2 className="text-blue font-black text-xl lg:text-2xl">
                Agile retrospectives made easy
              </h2>
              <h3 className="text-blue text-lg mt-2">
                An online retrospective tool that will keep your meetings fun, focused,
                and productive.
              </h3>
              <p className="text-blue text-lg mt-8">
                <span className="font-black">Get 2 months free</span>{" "}
                <br className="lg:hidden" />
                when you join our newsletter.
              </p>
              <MailchimpNewsLetterSignupForm className="mt-4" location="hero" />
            </div>
            <div
              id="hero-image"
              className="bg-white lg:w-1/2"
              aria-label="Retro Hero Image"
            >
              <img
                alt="Screenshot"
                src={applicationScreenshotImage}
                className="h-full w-full"
              />
            </div>
          </div>
        </PageContainer>

        <div className="my-8 w-full mx-auto lg:w-1/2">
          <hr className="text-blue" />
        </div>

        <PainSection />
        <div className="landing-page__how-it-works relative w-full min-h-full vertical-stripes-blue border border-blue mt-8">
          <div className="w-full min-h-full -z-1 absolute horizontal-stripes-blue"></div>
          <div className="sm:w-full lg:w-4/5 m-auto p-4 py-8">
            <div className="flex items-center justify-center h-16 text-center bg-white text-blue border border-red shadow-red items-center max-w-6xl m-auto">
              <h3 className="text-3xl font-black">Why Retro?</h3>
            </div>
            <div className="mt-10 flex flex-col lg:flex-row justify-between max-w-6xl items-center z-10 m-auto">
              <HowItWorksCard>
                <img
                  alt="Conduct"
                  src={howItWorksConductImage}
                  className="bg-white mb-2"
                  style={{ height: "115px", width: "140px" }}
                />
                <p className="text-xl mb-2">Easy to use</p>
                <p>Get more engagement from team members that usually don't speak up.</p>
              </HowItWorksCard>
              <HowItWorksCard>
                <img
                  alt="Invite"
                  src={howItWorksInviteImage}
                  className="bg-white mb-2"
                  style={{ height: "115px", width: "140px" }}
                />
                <p className="text-xl mb-2">Improve</p>
                <p>Surface the most important pains and get valuable actions.</p>
              </HowItWorksCard>

              <HowItWorksCard>
                <img
                  alt="Conduct"
                  src={howItWorksAnalyzeImage}
                  className="bg-white mb-2"
                  style={{ height: "115px", width: "140px" }}
                />
                <p className="text-xl mb-2">Insights</p>
                <p>Analyze your team's improvement over time.</p>
              </HowItWorksCard>
            </div>
          </div>
        </div>
        <PageContainer>
          <div className="mt-20 mb-20 flex flex-col lg:flex-row max-w-6xl items-center m-auto">
            <div className="w-full sm:w-2/3 md:w-2/3 lg:w-2/3">
              <HeroImage />
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
        <div className="bg-red text-white p-12">
          <PageContainer>
            <div className="mt-20 mb-20 flex flex-col lg:flex-row max-w-6xl m-auto">
              <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 sm:ml-4 md:ml-4 lg:w-ml-4">
                <h3 className="text-3xl text-white font-black mb-3">
                  Try it for free for a month, then simple pricing forever.
                </h3>
                <p className="text-xl text-white">
                  Our pricing is dead simple. Pay the same price forever regardless of how
                  meetings you have.
                </p>
              </div>
              <div className="w-full mt-10 sm:w-1/2 md:w-1/2 lg:w-1/2 sm:mt-0 md:mt-0 lg:mt-0 sm:ml-4 md:ml-4 lg:w-ml-4 sm:text-right  md:text-right  lg:text-right">
                <h2 className="text-5xl text-white font-black mb-3">
                  $39.99<span className="text-xl font-normal text-white"> Per Month</span>
                </h2>
                <p className="text-xl text-white">
                  <b>Team Plan:</b>
                  <br />
                  1 Workspace
                  <br />
                  10 Team Members
                  <br />
                  Unlimited Boards
                </p>
              </div>
            </div>
          </PageContainer>
        </div>
      </div>
      <PageContainer>
        <div className="text-blue">
          <h3 className="text-xl lg:text-3xl font-black mb-3">
            Get 2 months for free when you join our newsletter.
          </h3>
          <p className="mb-3">
            We're embracing openness by sharing our metrics with everyone.
          </p>
          <p className="mb-3">
            Every two weeks we'll share updates from the product, marketing, and business
            sides of Retro.
          </p>
        </div>
        <MailchimpNewsLetterSignupForm location="landing bottom" />
      </PageContainer>
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

const PainSection = () => {
  return (
    <div className="text-blue">
      <PageContainer>
        <div className="my-4 flex flex-col lg:flex-row m-auto">
          <div className="w-full">
            <h3 className="text-red text-2xl font-black mb-8">
              “My team hates having retrospectives. They’re time consuming and it’s really
              frustrating when nothing changes as a result.”
            </h3>
            <div className="text-lg">
              <p>
                That's a quote from an engineer -- and it's something we've heard{" "}
                <span className="italic">a lot</span>.
              </p>
              <br />
              <p>
                Retrospectives are the most time-consuming, expensive, and frustrating
                part about agile development.
              </p>
              <br />
              <p>Yet, the process to execute them is totally broken.</p>
              <br />
              <p className="pb-4">
                You've got things to build, but you also want to make sure your team is
                engaged and getting better:
              </p>
              <ul className="list-disc list-outside">
                <li className="pl-8 pb-2">What is slowing you and your team down?</li>
                <li className="pl-8 pb-2">
                  Is your team engaged and excited about their work?
                </li>
                <li className="pl-8 pb-2">
                  Are your current projects giving a good ROI?
                </li>
                <li className="pl-8 pb-2">
                  How can you catch small issues early, so that they don't turn into{" "}
                  <span className="font-black">BIG</span> problems?
                </li>
              </ul>
              <br />
              <br />
              <p>
                <span className="font-black">
                  To answer these questions, you should be having retrospectives
                  regularly. But, your team hates retros.
                </span>{" "}
                You’re probably getting a lot of{" "}
                <span className="italic">surface-level</span> issues that aren’t
                addressing the <span className="underline">real</span> problems facing
                your team.
              </p>
              <br />
              <p>
                This leads to bad information and decision making, a not-so-engaged team
                that ignores small issues that could blow up in your face and cost a lot
                more down the road.
              </p>
              <br />
              <p>
                How much easier would your job be if retrospectives were fast, easy,
                almost fun, and your team actually looked forward to them?
              </p>
              <br />
              <br />
              <p className="text-xl italic pb-4">*** Imagine ***</p>
              <ul className="list-disc list-outside">
                <li className="pl-8 pb-2">
                  You wouldn't have to nag your team about retrospectives.
                </li>
                <li className="pl-8 pb-2">
                  Your retrospectives were focused and produtive.
                </li>
                <li className="pl-8 pb-2">You walked away with actionable insights.</li>
                <li className="pl-8 pb-2">
                  You'd have <span className="underline">real</span> data on how your team
                  was improving.
                </li>
                <li className="pl-8 pb-2">
                  You'd make the right decisions as a team and catch those little issues
                  before they turned into fires.
                </li>
                <li className="pl-8 pb-2 font-black">
                  Your team would be happy, engaged, and ship better products -- which
                  adds value (and probably money) to your business.
                </li>
              </ul>
              <br />
              <br />
              <p>
                What if you could instantly see the pulse of your team; happiness,
                roadblocks, current questions?
              </p>
              <br />
              <p className="font-black text-2xl my-8">
                If you're not walking away from every meeting with valuable action items,
                you should check out Retro.
              </p>
              <p>
                We've been agile for years, and recently gone remote.{" "}
                <span className="italic">We hate</span> the tools we've tried for online
                retrospectives.
              </p>
              <br />
              <p>
                That's why we're building Retro to help you and your team have
                retrospectives that are focused, fun, and productive.
              </p>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};
