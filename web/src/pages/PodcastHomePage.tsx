import * as React from "react";
import { PageContainer } from "../components/PageContainer";
import { Link } from "react-router-dom";

export function PodcastHomePage() {
  return (
    <PageContainer>
      <div className="text-blue">
        <h1 className="text-3xl font-black">Retrospective</h1>
        <h2>The Podcast</h2>
        <div className="mt-8">
          <Link to="/podcast/1" className="hover:underline">
            1 // Nader Dabit - How I made $400K in a Year as a Software Consultant
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
