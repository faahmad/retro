import * as React from "react";
import { PageContainer } from "../components/PageContainer";
import firebase from "../lib/firebase";
import { Button } from "../components/Button";
import analytics from "analytics.js";
import { LandingPageFooter } from "./LandingPage";
import { HomePageFooter } from "./FAQPage";

const RETROSPECTIVE_1_NADER_DABIT_TRANSCRIPT_FILE_URL =
  "gs://retro-prod-786.appspot.com/retrospective-podcast-transcripts/retrospective-1-nader-dabit.vtt";

const transcriptRef = firebase
  .storage()
  .refFromURL(RETROSPECTIVE_1_NADER_DABIT_TRANSCRIPT_FILE_URL);

export function PodcastEpisodePage() {
  const handleDownloadTranscript = async () => {
    analytics.track("Transcript Downloaded", { episode: 1 });
    const url = await transcriptRef.getDownloadURL();
    const xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.onload = function () {
      const blob = xhr.response;
    };
    xhr.open("GET", url);
    xhr.send();
    return;
  };

  return (
    <div>
      <PageContainer>
        <div className="text-blue">
          <h1 className="font-black text-3xl">Retrospective 1</h1>
          <h2 className="text-2xl">
            Nader Dabit - How I Made $400K in a Year as a Software Consultant
          </h2>
          <h3 className="text-xl font-black mt-6 mb-2">Listen</h3>
          <ul className="my-2">
            <li>
              <a
                className="underline"
                href="https://www.youtube.com/watch?v=iVYNTKKeWwQ&list=PLm-Ufidv3fEEZvKl58VY5GajEd57Y9GBR"
                target="_blank"
              >
                YouTube
              </a>
            </li>
            <li>
              <a
                className="underline"
                href="https://open.spotify.com/episode/4cLZrKJIKJmOwX1yJGu8B5?si=TW9AyICxRuKHXjpYWi0NFQ"
                target="_blank"
              >
                Spotify
              </a>
            </li>
          </ul>
          <h3 className="text-xl font-black mt-6 mb-2">Action Items</h3>
          <ul>
            <li className="mb-2">
              - Position yourself as a specialist in your space. Start writing about X,
              when something new comes out, try to have one of the first really solid
              pieces of content.You'll learn as you write and become a specialist, other
              people online will perceive you as an expert. Nader spent a lot of time
              writing blogs and answering questions on StackOverflow about React Native.
            </li>
            <li className="mb-2">
              {" "}
              - Reach out other consultants in the space if you need advice about pricing.
            </li>
            <li className="mb-2">
              {" "}
              - Setting a firm work week / work hours and be strict.Gives you the time
              needed to enjoy your life.
            </li>
            <li className="mb-2">
              {" "}
              - It's better to have a client that you enjoy working with for a little less
              money.
            </li>
            <li className="mb-2">
              {" "}
              - Try to get half hourly billing, half value based pricing.
            </li>
            <li className="mb-2">- Pay your taxes quarterly.</li>
            <li className="mb-2">- Have a backup laptop when you can afford it.</li>
            <li className="mb-2">
              {" "}
              - If you have a lot of inbound sales, decide if you want to keep growing.If
              you do, hire someone to manage it.
            </li>
          </ul>
          <h3 className="text-xl font-black mt-6 mb-2">Bad</h3>
          <ul>
            <li className="mb-2">
              - Was stressed out, family and personal life suffered.
            </li>
            <li className="mb-2">- Billing hourly.</li>
            <li className="mb-2">
              - Didn't pay taxes on time, ended up owing taxes for the entire following
              year.
            </li>
            <li className="mb-2">- Laptop wasn't working on a high paying client.</li>
            <li className="mb-2">
              - Had too many clients reaching out and would often ignore inbound sales.
            </li>
          </ul>
          <div className="mt-8">
            {/* <Button className="text-blue" onClick={handleDownloadTranscript}>
              Download Transcript
            </Button> */}
          </div>
        </div>
      </PageContainer>
      <HomePageFooter />
      <LandingPageFooter />
    </div>
  );
}
