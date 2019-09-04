import * as React from "react";
import { Button } from "reactstrap";

export const BillingPage = () => {
  return (
    <div className="billing-page container py-4">
      <h1>Billing</h1>
      <div className="p-4 border rounded text-center d-flex flex-column align-items-center">
        <h5 className="font-weight-normal">
          Your workspace is on a free trial of the{" "}
          <span className="font-weight-bold">Standard</span> plan.
        </h5>
        <div className="py-4">
          <Button size="lg" color="success">
            Upgrade to Standard
          </Button>
        </div>
        <p>
          The <span className="font-weight-bold">Standard</span> plan includes:
        </p>
        <ul className="text-left list-unstyled">
          <li>
            <span className="text-success">∞</span> Unlimited retro boards
          </li>
          <li>
            <span className="text-success font-weight-bold">&#10003;</span> 15
            workspace members
          </li>
          <li>
            <span className="text-success font-weight-bold">&#10003;</span> 1
            team
          </li>
        </ul>
      </div>
      <p className="text-secondary small">
        More pricing options will be available soon.
      </p>
    </div>
  );
};
