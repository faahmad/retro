/// <reference types="react-scripts" />
interface Item {
  uid: string;
  content: string;
  likeCount: number;
}

interface Column {
  uid: "good" | "bad" | "actions" | "questions";
  title: string;
  buttonClassName: "success" | "danger" | "primary" | "info";
  itemIds: Item["uid"][];
}
