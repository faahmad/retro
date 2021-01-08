import * as React from "react";
import dashboardFooterImage from "../assets/images/dashboard-footer-image.svg";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <React.Fragment>
      <img className="w-full" src={dashboardFooterImage} alt="Footer Illustration" />
      <footer className="bg-pink text-blue text-xs p-2 flex justify-between">
        <div className="flex">
          <Link to="/terms" className="px-2">
            Terms of Service
          </Link>
          <Link to="/privacy" className="px-2">
            Privacy Policy
          </Link>
        </div>
        <p className="text-blue">&copy; 2021, Retro Technology</p>
      </footer>
    </React.Fragment>
  );
};
