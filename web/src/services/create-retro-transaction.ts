import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";
import { Retro, RetroUserType } from "../types/retro";
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
  const snapshot = await retroCollection.where("workspaceId", "==", workspaceId).get();

  // Create the new retro.
  const newRetroRef = retroCollection.doc();
  const newRetroData: Retro = {
    id: newRetroRef.id,
    workspaceId: workspaceId,
    createdById: userId,
    name: `Retrospective #${snapshot.size + 1}`,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    isIncognito: true,
    userIds: {
      [userId]: RetroUserType.FACILITATOR
    },
    retroItemIds: {},
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
        title: "What didn't go well?",
        retroItemIds: []
      }
    },
    columnOrder: [RetroColumnType.GOOD, RetroColumnType.BAD]
  };
  await newRetroRef.set(newRetroData);
  return newRetroData;
}
