import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";
import { Retro } from "../types/retro";
import { RetroColumnType } from "../types/retro-column";
import { Workspace } from "../types/workspace";
import { User } from "../types/user";

const db = firebase.firestore();
const retroCollection = db.collection(FirestoreCollections.RETRO);

export interface CreateRetroTransactionParams {
  userId: User["id"];
  workspaceId: Workspace["id"];
}

export async function createRetroTransaction({
  userId,
  workspaceId
}: CreateRetroTransactionParams) {
  // Create the new retro.
  const newRetroRef = retroCollection.doc();
  const newRetroData: Retro = {
    id: newRetroRef.id,
    workspaceId: workspaceId,
    createdById: userId,
    name: "New Retro",
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    userIds: {
      [userId]: userId
    },
    retroItems: {},
    retroItemsData: {
      goodCount: 0,
      badCount: 0,
      actionsCount: 0,
      questionsCount: 0
    },
    columns: {
      good: {
        type: RetroColumnType.GOOD,
        title: "What went well?",
        retroItemIds: []
      },
      bad: {
        type: RetroColumnType.BAD,
        title: "What can be improved?",
        retroItemIds: []
      },
      actions: {
        type: RetroColumnType.ACTIONS,
        title: "What do we need to do?",
        retroItemIds: []
      },
      questions: {
        type: RetroColumnType.QUESTIONS,
        title: "What do we have questions on?",
        retroItemIds: []
      }
    },
    columnOrder: [
      RetroColumnType.GOOD,
      RetroColumnType.BAD,
      RetroColumnType.ACTIONS,
      RetroColumnType.QUESTIONS
    ]
  };
  await newRetroRef.set(newRetroData);
  return newRetroData;
}
