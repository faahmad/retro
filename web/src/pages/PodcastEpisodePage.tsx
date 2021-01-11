import * as React from "react";
import { PageContainer } from "../components/PageContainer";
import { LandingPageFooter } from "./LandingPage";
import { HomePageFooter } from "./FAQPage";

const IFRAME_SRC = `<iframe width="100%" height="300" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/856887271&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/farazamiruddin" title="farazamiruddin" target="_blank" style="color: #cccccc; text-decoration: none;">farazamiruddin</a> · <a href="https://soundcloud.com/farazamiruddin/retrospective-1-nader-dabit-how-i-made-400k-in-a-year-as-a-software-consultant" title="Retrospective 1 // Nader Dabit - How I Made $400K in a Year as a Software Consultant" target="_blank" style="color: #cccccc; text-decoration: none;">Retrospective 1 // Nader Dabit - How I Made $400K in a Year as a Software Consultant</a></div>`;

// const RETROSPECTIVE_1_NADER_DABIT_TRANSCRIPT_FILE_URL =
//   "gs://retro-prod-786.appspot.com/retrospective-podcast-transcripts/retrospective-1-nader-dabit.vtt";

// const transcriptRef = firebase
//   .storage()
//   .refFromURL(RETROSPECTIVE_1_NADER_DABIT_TRANSCRIPT_FILE_URL);

export function PodcastEpisodePage() {
  // const handleDownloadTranscript = async () => {
  //   analytics.track("Transcript Downloaded", { episode: 1 });
  //   const url = await transcriptRef.getDownloadURL();
  //   const xhr = new XMLHttpRequest();
  //   xhr.responseType = "blob";
  //   xhr.onload = function () {
  //     const blob = xhr.response;
  //   };
  //   xhr.open("GET", url);
  //   xhr.send();
  //   return;
  // };

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
            <li className="mb-4">
              <div dangerouslySetInnerHTML={{ __html: IFRAME_SRC }} />
            </li>
            <li>
              <a
                className="underline"
                href="https://www.youtube.com/watch?v=iVYNTKKeWwQ&list=PLm-Ufidv3fEEZvKl58VY5GajEd57Y9GBR"
                target="_blank"
                rel="noopener noreferrer"
              >
                YouTube
              </a>
            </li>
            <li>
              <a
                className="underline"
                href="https://open.spotify.com/episode/4cLZrKJIKJmOwX1yJGu8B5?si=TW9AyICxRuKHXjpYWi0NFQ"
                target="_blank"
                rel="noopener noreferrer"
              >
                Spotify
              </a>
            </li>
          </ul>
          <h3 className="text-xl font-black mt-6 mb-2">The Good</h3>
          <GoodItems />
          <h3 className="text-xl font-black mt-6 mb-2">The Bad</h3>
          <BadItems />
          <h3 className="text-xl font-black mt-6 mb-2">Action Items</h3>
          <ActionItems />
          <div className="mt-8"></div>
        </div>
      </PageContainer>
      <HomePageFooter />
      <LandingPageFooter />
    </div>
  );
}

function ActionItems() {
  return (
    <ul>
      <li className="mb-2">
        - Position yourself as a specialist in your space. Start writing about X, when
        something new comes out, try to have one of the first really solid pieces of
        content.You'll learn as you write and become a specialist, other people online
        will perceive you as an expert. Nader spent a lot of time writing blogs and
        answering questions on StackOverflow about React Native.
      </li>
      <li className="mb-2">
        {" "}
        - Reach out other consultants in the space if you need advice about pricing.
      </li>
      <li className="mb-2">
        {" "}
        - Setting a firm work week / work hours and be strict. Gives you the time needed
        to enjoy your life.
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
        - If you have a lot of inbound sales, decide if you want to keep growing.If you
        do, hire someone to manage it.
      </li>
    </ul>
  );
}

function GoodItems() {
  return (
    <ul>
      <li className="mb-2">- Learned a lot.</li>
      <li className="mb-2">- Made a lot of money.</li>
      <li className="mb-2">- Published a book.</li>
      <li className="mb-2">- Landed a job at AWS.</li>
    </ul>
  );
}

function BadItems() {
  return (
    <ul>
      <li className="mb-2">- Was stressed out, family and personal life suffered.</li>
      <li className="mb-2">- Billing hourly.</li>
      <li className="mb-2">
        - Didn't pay taxes on time, ended up owing taxes for the entire following year.
      </li>
      <li className="mb-2">- Laptop wasn't working on a high paying client.</li>
      <li className="mb-2">
        - Had too many clients reaching out and would often ignore inbound sales.
      </li>
    </ul>
  );
}
