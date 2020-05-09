import { RetroBoard, CreateRetroBoardInput } from "../types";

export function buildEmptyRetroBoard({
  id,
  workspaceId,
  teamId,
  createdById,
}: CreateRetroBoardInput): RetroBoard {
  return {
    id,
    workspaceId,
    teamId,
    createdById,
    items: {},
    columns: {
      good: {
        type: "good",
        title: "Good",
        itemIds: [],
      },
      bad: {
        type: "bad",
        title: "Bad",
        itemIds: [],
      },
      actions: {
        type: "actions",
        title: "Actions",
        itemIds: [],
      },
      questions: {
        type: "questions",
        title: "Questions",
        itemIds: [],
      },
    },
    columnOrder: ["good", "bad", "actions", "questions"],
  };
}
