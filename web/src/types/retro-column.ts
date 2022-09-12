import { RetroItem } from "./retro-item";

export enum RetroColumnType {
  GOOD = "good",
  BAD = "bad"
}

export type RetroColumnGood = {
  type: RetroColumnType.GOOD;
  title: "What went well?";
  retroItemIds: RetroItem["id"][];
};

export type RetroColumnBad = {
  type: RetroColumnType.BAD;
  title: "What didn't go well?";
  retroItemIds: RetroItem["id"][];
};

export type RetroColumn = RetroColumnGood | RetroColumnBad;
