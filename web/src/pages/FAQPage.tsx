import React from "react";
import { Link } from "react-router-dom";

import landingFooterImage from "../assets/images/landing-page-footer.svg";

import { PageContainer } from "../components/PageContainer";

export const FAQPage: React.FC = () => {
  return (
    <div>
      <div className="landing-page flex flex-col w-full justify-center my-8">
        <PageContainer>
          <h2 className="text-blue font-bold text-5xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-20 mb-20">
            <h3 className="text-blue font-bold text-2xl">
              How much does Retro cost?
            </h3>
            <p className="text-xl text-blue">
              Retro is free for the first 30 days, then it is $20 per month.
            </p>
          </div>
          <div className="mt-20 mb-20">
            <h3 className="text-blue font-bold text-2xl">
              What do I need to login?
            </h3>
            <p className="text-xl text-blue">Just a Google associated email.</p>
          </div>
          <div className="mt-20 mb-20">
            <h3 className="text-blue font-bold text-2xl">What is Retro?</h3>
            <p className="text-xl text-blue">
              Retro is a tool for you and your team to conduct
              retrospectives/retros.
            </p>
          </div>
          <div className="mt-20 mb-20">
            <h3 className="text-blue font-bold text-2xl">What is a retro?</h3>
            <p className="text-xl text-blue">
              It’s an outline of what went well and what could be improved on
              for whatever work you do, made by and for your team.
            </p>
          </div>
          <div className="mt-20 mb-20">
            <h3 className="text-blue font-bold text-2xl">
              What is a workspace?
            </h3>
            <p className="text-xl text-blue">
              A workspace is how you separate your retros for all of the teams
              or squads your work with.
            </p>
          </div>
          <div className="mt-20 mb-20">
            <h3 className="text-blue font-bold text-2xl">
              Is it true that retrospectives are only for software?
            </h3>
            <p className="text-xl text-blue">
              No, any team looking to improve how they work together can benefit
              from retro.
            </p>
          </div>
        </PageContainer>
        <hr
          className="flex flex-col justify-center self-center w-3/5 mt-12 mb-12"
          style={{ borderTop: "2px dashed #11269C" }}
        />
        <div className="mt-20 mb-20 flex flex-col lg:flex-row max-w-6xl items-center m-auto">
          <div>
            <h3 className="text-3xl text-blue text-center font-black mb-3">
              Got a question?
            </h3>
            <p className="text-2xl text-center text-blue">
              Reach out to us at{" "}
              <a
                href="mailto:hi@retro.app"
                className="text-pink hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                hi@retro.app
              </a>
            </p>
          </div>
        </div>
      </div>
      <div
        style={{
          backgroundImage: `url(${landingFooterImage})`,
          backgroundSize: "cover",
          minHeight: "300px",
        }}
        className="w-full flex justify-center items-center"
      >
        <Link to="/">
          <h2 className="text-5xl text-pink p-2 text-center">Home</h2>
        </Link>
      </div>
      <footer className="bg-pink text-blue p-2 text-center">
        <p className="text-blue">&copy; 2020, Retro Technology</p>
      </footer>
    </div>
  );
};
