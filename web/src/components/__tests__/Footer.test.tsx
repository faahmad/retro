import * as React from "react";
import { Footer } from "../Footer";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

describe("<Footer />", () => {
  it("should contain a link to the terms of service", () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    expect(screen.findByText("Terms of Service")).toBeTruthy();
  });
});
