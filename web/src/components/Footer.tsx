import * as React from "react";
import dashboardFooterImage from "../assets/images/dashboard-footer-image.svg";

export const Footer = () => {
  return (
    <React.Fragment>
      <img
        className="w-full"
        src={dashboardFooterImage}
        alt="Footer Illustration"
      />
      <footer className="bg-pink text-blue p-2 text-center">
        <p className="text-blue">&copy; 2020, Retro Technology</p>
      </footer>
    </React.Fragment>
  );
};
