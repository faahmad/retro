import { RetroItem } from "./retro-item";

export enum RetroColumnType {
  GOOD = "good",
  BAD = "bad",
  ACTIONS = "actions",
  QUESTIONS = "questions"
}

export type RetroColumnGood = {
  type: RetroColumnType.GOOD;
  title: "What went well?";
  retroItemIds: RetroItem["id"][];
};

export type RetroColumnBad = {
  type: RetroColumnType.BAD;
  title: "What can be improved?";
  retroItemIds: RetroItem["id"][];
};

export type RetroColumnActions = {
  type: RetroColumnType.ACTIONS;
  title: "What do we need to do?";
  retroItemIds: RetroItem["id"][];
};

export type RetroColumnQuestions = {
  type: RetroColumnType.QUESTIONS;
  title: "What do we have questions on?";
  retroItemIds: RetroItem["id"][];
};
