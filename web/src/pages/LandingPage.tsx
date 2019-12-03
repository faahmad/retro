import React from "react";
import retroHeroImage from "../assets/images/retro-hero-image.svg";
import { Navbar } from "../components/Navbar";

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
      <div className="landing-page__how-it-works grid-bg w-full m-0 mt-12 py-10">
        <div className=" w-4/5 m-auto">
          <div className="flex items-center justify-center h-16 text-center bg-white text-blue border border-red shadow-red items-center">
            <h3 className="text-2xl font-black">How it Works</h3>
          </div>
          <div className="mt-10 flex justify-between">
            <div className="bg-white h-64 w-56 text-blue border border-red shadow-red"></div>
            <div className="bg-white h-64 w-56 text-blue border border-red shadow-red"></div>
            <div className="bg-white h-64 w-56 text-blue border border-red shadow-red"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
