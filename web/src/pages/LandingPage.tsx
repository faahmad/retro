import React from "react";

// components
import { Navbar } from "../components/Navbar";

// images
import retroHeroImage from "../assets/images/retro-hero-image.svg";
import howItWorksInviteImage from "../assets/images/how-it-works-invite-image.svg";
import howItWorksConductImage from "../assets/images/how-it-works-conduct-image.svg";
import howItWorksAnalyzeImage from "../assets/images/how-it-works-analyze-image.svg";

export const LandingPage: React.FC = () => {
  return (
    <div className="landing-page flex flex-col w-full max-w-8xl justify-center my-8">
      <div className="landing-page__above-the-fold w-4/5 m-auto">
        <Navbar />
        <div className="flex flex-col lg:text-center m-0">
          <img
            className="lg:flex-1 mt-4"
            src={retroHeroImage}
            alt="Retro Hero"
          />
          <h2 className="text-blue text-3xl">
            The Retrospective Tool For People That Hate Retros.
          </h2>
        </div>
      </div>
      <div></div>
      <div className="landing-page__how-it-works relative w-full min-h-full vertical-stripes-blue border border-blue mt-10">
        <div className="w-full min-h-full -z-1 absolute horizontal-stripes-blue"></div>
        <div className="sm:w-full lg:w-4/5 m-auto p-8">
          <div className="flex items-center justify-center h-16 text-center bg-white text-blue border border-red shadow-red items-center">
            <h3 className="text-2xl font-black">How it Works</h3>
          </div>
          <div className="mt-10 flex flex-col lg:flex-row justify-between items-center z-10">
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
