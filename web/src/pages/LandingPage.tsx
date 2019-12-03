import React from "react";
import retroHeroImage from "../assets/images/retro-hero-image.svg";
import { Navbar } from "../components/Navbar";

export const LandingPage: React.FC = () => {
  return (
    <div className="landing-page flex max-w-6xl m-auto w-full justify-center h-screen pt-8">
      <div className="w-4/5 h-12">
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
    </div>
  );
};
