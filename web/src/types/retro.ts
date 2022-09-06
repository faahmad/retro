import { TODO } from "./todo";
import { User } from "./user";
import { Workspace } from "./workspace";
import { RetroColumnType, RetroColumnGood, RetroColumnBad } from "./retro-column";
import { RetroStep } from "../components/RetroBoardStageStepper";

export interface Retro {
  id: string;
  workspaceId: Workspace["id"];
  name: string;
  createdById: User["id"];
  createdAt?: TODO;
  userIds: { [userId: string]: User["id"] };
  retroItemIds: { [retroItemId: string]: string };
  isIncognito?: boolean;
  stage?: RetroStep["name"];
  presentationModeIndex?: number;
  retroItemsData: {
    goodCount: number;
    badCount: number;
    actionsCount: number;
    questionsCount: number;
  };
  columns: {
    [RetroColumnType.GOOD]: RetroColumnGood;
    [RetroColumnType.BAD]: RetroColumnBad;
  };
  columnOrder: [RetroColumnType.GOOD, RetroColumnType.BAD];
}

export interface RetroChildRef {
  countdownTimer: {
    startAt: TODO;
    milliseconds: number;
    state: "CLOSED" | "PAUSED" | "COUNTING";
  };
}
