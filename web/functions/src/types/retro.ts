import { User } from "./user";
import { Workspace } from "./workspace";

export interface Retro {
  id: string;
  workspaceId: Workspace["id"];
  name: string;
  createdById: User["id"];
  createdAt?: any;
  userIds: { [userId: string]: User["id"] };
  retroItemIds: { [retroItemId: string]: string };
  isIncognito?: boolean;
  stage?: "Brainstorm" | "Vote";
  retroItemsData: {
    goodCount: number;
    badCount: number;
    actionsCount: number;
    questionsCount: number;
  };
}

export interface RetroChildRef {
  countdownTimer: {
    startAt: any;
    milliseconds: number;
    state: "CLOSED" | "PAUSED" | "COUNTING";
  };
}
