export function createDefaultRetroBoard(
  workspaceId: RetroWorkspace["uid"],
  createdAt: RetroBoard["createdAt"]
): RetroBoard {
  return {
    workspaceId,
    createdAt,
    items: {},
    columns: {
      good: {
        type: "good",
        title: "Good",
        buttonClassName: "success",
        itemIds: []
      },
      bad: {
        type: "bad",
        title: "Bad",
        buttonClassName: "danger",
        itemIds: []
      },
      actions: {
        type: "actions",
        title: "Actions",
        buttonClassName: "primary",
        itemIds: []
      },
      questions: {
        type: "questions",
        title: "Questions",
        buttonClassName: "info",
        itemIds: []
      }
    },
    columnOrder: ["good", "bad", "actions", "questions"]
  };
}
