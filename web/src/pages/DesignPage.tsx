import React from "react";
import { Link } from "react-router-dom";

import retroTeamImage from "../assets/images/retro-team.svg";
import gettingInspiredImage from "../assets/images/getting-inspired@2x.png";
import earlyExplorationOneImage from "../assets/images/early-exploration-one@2x.png";
import earlyExplorationTwoImage from "../assets/images/early-exploration-two@2x.png";
import goodVibesImage from "../assets/images/good-vibes.svg"
import landingFooterImage from "../assets/images/landing-page-footer.svg";


import { PageContainer } from "../components/PageContainer";

export const DesignPage: React.FC = () => {
  return (
    <div>
      <div className="flex flex-col w-full justify-center my-8">
        <PageContainer>
          <div className="flex flex-col max-w-6xl m-auto">
            <div className="mt-20 mb-10 sm:w-full md:w-1/2 lg:w-1/2">
              <img
                    alt="Team"
                    src={retroTeamImage}
                  />
            </div>
            <div className="mt-20 mb-10 w-full sm:w-full md:w-1/2 lg:w-1/2">
              <h3 className="mb-2 text-blue font-bold text-3xl">
                Getting Inspired
              </h3>
              <p className="text-xl text-blue mb-5">Our design team immediately fell in love with the concept of using nostalgic art for a retro app.</p>
              <p className="text-xl text-blue">We also knew early on that we wanted bright colors and minimal interface. The first step was finding references.</p>
            </div>
          </div>
        </PageContainer>
        <hr className="flex flex-col justify-center self-center w-2/5 mt-12 mb-12" style={{borderTop: "2px dashed #FF94B8"}}/>
        <PageContainer>
          <div className="flex flex-col max-w-6xl m-auto">
            <div className="mt-10 mb-10 w-full sm:w-full md:w-1/2 lg:w-1/2">
              <h3 className="mb-2 text-blue font-bold text-3xl">
                Creating the Style
              </h3>
              <p className="text-xl text-blue mb-5">In order to keep things light and imaginative, we selected our 
              favorite visual elements from classic animation, games, and old software.</p> 
              <p className="text-xl text-blue mb-5">We experimented with mixing up different lines, shapes, and patterns until 
              we found something that felt special.</p>
            </div>
            <div className="mt-10 mb-10 sm:ml-20 md:ml-20 lg:ml-20 w-full sm:w-full md:w-1/2 lg:w-1/2">
              <img
                    alt="Getting Inspired"
                    className="self-center"
                    src={gettingInspiredImage}
                  />
              <span className="block mt-2 text-md text-blue">Character art exploration.</span>
            </div>
          </div>
          <div className="flex flex-col max-w-6xl  m-auto">
            <div className="mt-10 mb-20 w-full sm:w-full md:w-1/2 lg:w-1/2">
              <img
                    alt="Early Exploration One"
                    src={earlyExplorationOneImage}
                  />
              <span className="block mt-2 text-md text-blue">Early design exploration.</span>
            </div>
            <div className="mt-10 mb-20 sm:ml-20 md:ml-20 lg:ml-20 w-full sm:w-full md:w-1/2 lg:w-1/22">
              <img
                    alt="Early Exploration Two"
                    src={earlyExplorationTwoImage}
                  />
              <span className="block mt-2 text-md text-blue">More design exploration.</span>
            </div>
          </div>
        </PageContainer>
        <hr className="flex flex-col justify-center self-center w-2/5 mt-12 mb-12" style={{borderTop: "2px dashed #FF94B8"}}/>
        <PageContainer>
          <div className="mt-10 mb-10 w-full">
            <h3 className="mb-2 text-blue font-bold text-3xl">
              Spreading Good Vibes
            </h3>
            <p className="text-xl text-blue mb-5">Ultimately, we don’t want our retrospectives to feel like a chore. They truly can provide so much value to teams when conducted well. 
            Using playful imagery and gentle primary colors was our visual answer to breaking the tedium.</p> 
            <p className="text-xl text-blue mb-5">We hope that our house blend of nostalgia provides a funky little palate cleanser from the rest of your work day and gives your 
            team a little boost of energy to kick more butt together.</p>
          </div>
        </PageContainer>
      </div>
      <div className="w-full flex justify-center items-center">
        <img
          alt="Good Vibes"
          src={goodVibesImage}
        />
      </div>
      <div style={{ 
          backgroundImage:`url(${landingFooterImage})`, 
          backgroundSize: "cover",
          minHeight: "300px"
        }} className="w-full flex justify-center items-center">
        <Link to="/"><h2 className="text-5xl text-pink p-2 text-center">Home</h2></Link>
      </div>
      <footer className="bg-pink text-blue p-2 text-center">
        <p className="text-blue">&copy; 2020, Retro Technology</p>
      </footer>
    </div>
  );
};

