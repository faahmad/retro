import { RetroItem } from "../types/retro-item";
import { TODO } from "./todo";
import { User } from "./user";
import { Workspace } from "./workspace";
import {
  RetroColumnType,
  RetroColumnGood,
  RetroColumnBad,
  RetroColumnActions,
  RetroColumnQuestions
} from "./retro-column";

export interface Retro {
  id: string;
  workspaceId: Workspace["id"];
  name: string;
  createdById: User["id"];
  createdAt?: TODO;
  userIds: { [userId: string]: User["id"] };
  retroItemIds: { [retroItemId: string]: string };
  retroItemsData: {
    goodCount: number;
    badCount: number;
    actionsCount: number;
    questionsCount: number;
  };
  columns: {
    [RetroColumnType.GOOD]: RetroColumnGood;
    [RetroColumnType.BAD]: RetroColumnBad;
    [RetroColumnType.ACTIONS]: RetroColumnActions;
    [RetroColumnType.QUESTIONS]: RetroColumnQuestions;
  };
  columnOrder: [
    RetroColumnType.GOOD,
    RetroColumnType.BAD,
    RetroColumnType.ACTIONS,
    RetroColumnType.QUESTIONS
  ];
}
