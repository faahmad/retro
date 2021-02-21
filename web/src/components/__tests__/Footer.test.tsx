import * as React from "react";
import { Footer } from "../Footer";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

describe("<Footer />", () => {
  it("should contain a link to the terms of service", () => {
    const { findByText } = render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    expect(findByText("Terms of Service")).toBeTruthy();
  });
});
