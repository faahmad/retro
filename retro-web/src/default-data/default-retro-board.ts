export const defaultRetroBoard: Partial<RetroBoard> = {
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
