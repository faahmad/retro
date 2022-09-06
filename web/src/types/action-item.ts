import { Retro } from "./retro";
import { TODO } from "./todo";
import { User } from "./user";
import { Workspace } from "./workspace";

export interface ActionItemI {
  id: string;
  workspaceId: Workspace["id"];
  retroId: Retro["id"];
  content: string;
  createdAt: TODO;
  createdBy: User["id"];
  status: "open" | "complete";
  updatedAt: TODO;
}
