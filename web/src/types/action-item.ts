import { TODO } from "./todo";
import { User } from "./user";
import { Workspace } from "./workspace";

export interface ActionItemI {
  id: string;
  workspaceId: Workspace["id"];
  content: string;
  createdAt: TODO;
  createdBy: User["id"];
  status: "open" | "complete";
  updatedAt: TODO;
}
