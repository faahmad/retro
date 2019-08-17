export const initialState = {
  items: {
    "item-1": { uid: "item-1", content: "I love retros!", likeCount: 0 },
    "item-2": { uid: "item-2", content: "They are great.", likeCount: 0 },
    "item-3": { uid: "item-3", content: "Yeah!", likeCount: 0 }
  },
  columns: {
    good: {
      uid: "good",
      title: "Good",
      buttonClassName: "success",
      itemIds: ["item-1", "item-2", "item-3"]
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
