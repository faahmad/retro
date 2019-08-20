/// <reference types="react-scripts" />

interface Item {
  id: string;
  content: string;
  likeCount: number;
}

type ColumnType = "good" | "bad" | "actions" | "questions";
type ColumnButtonClassName = "success" | "danger" | "primary" | "info";

interface Column {
  type: ColumnType;
  title: string;
  buttonClassName: ColumnButtonClassName;
  itemIds: Item["id"][];
}

interface RetroBoard {
  uid: string;
  items: { [key: string]: Item };
  columns: { [key: string]: Column };
  columnOrder: ColumnType[];
}
