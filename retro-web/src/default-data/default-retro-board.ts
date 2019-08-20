export const defaultRetroBoard = {
  items: {},
  columns: {
    good: {
      uid: "good",
      title: "Good",
      buttonClassName: "success",
      itemIds: []
    },
    bad: {
      uid: "bad",
      title: "Bad",
      buttonClassName: "danger",
      itemIds: []
    },
    actions: {
      uid: "actions",
      title: "Actions",
      buttonClassName: "primary",
      itemIds: []
    },
    questions: {
      uid: "questions",
      title: "Questions",
      buttonClassName: "info",
      itemIds: []
    }
  },
  columnOrder: ["good", "bad", "actions", "questions"]
};
