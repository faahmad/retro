import { TODO } from "./todo";
import { User } from "./user";
import { Workspace } from "./workspace";

export interface Retro {
  id: string;
  workspaceId: Workspace["id"];
  name: string;
  createdById: User["id"];
  createdAt: TODO;
  updatedAt: TODO;
  userIds: { [userId: string]: User["id"] };
  retroItemsData: {
    goodCount: number;
    badCount: number;
    actionsCount: number;
    questionsCount: number;
  };
}
