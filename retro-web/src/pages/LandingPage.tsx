import * as React from "react";

export class LandingPage extends React.Component {
  render() {
    return (
      <div className="landing-page container">
        <div className="landing-page__header mb-3">
          <h1>Accelerate your team with honest retros.</h1>
          <p>Your team will thank you.</p>
          <div className="d-flex flex-column flex-wrap align-items-start">
            <button className="btn btn-lg btn-success">Try for free</button>
            <small className="text-muted mt-2">
              14 day free trial. This tool is awesome. We promise.
            </small>
          </div>
        </div>
        <div className="landing-page__how-it-works">
          <h2>How it Works</h2>
          <ul>
            <li>
              1. Invite your team members.{" "}
              <span role="img" aria-label="emoji-envelope">
                💌
              </span>
            </li>
            <li>
              2. Use our dope ass drag and drop interface to conduct your retro.
              <span role="img" aria-label="emoji-penci">
                ✏️
              </span>
            </li>
            <li>
              3. <span className="text-muted">(Coming soon)</span> Send your
              results via email and automatically generate GitHub issues from
              your action items.{" "}
              <span role="img" aria-label="emoji-tada">
                🎉
              </span>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
