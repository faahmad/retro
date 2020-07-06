import * as React from "react";
import firebase from "../lib/firebase";
const db = firebase.firestore();
/**
 * Listens to real time updates on a document
 * @returns a onSnapshot function which is used to listen to the updates
 * @param documentPath slash separated path to a firestore document
 * @param onSuccess callback function that is invoked every time a snapshot changes
 */
export function useOnSnapshot<T>(documentPath: string) {
  return React.useCallback(
    (
      onSuccess: (
        data: T,
        doc?: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
      ) => void
    ) =>
      db.doc(documentPath).onSnapshot((snapshot) => {
        return onSuccess(snapshot.data() as T, snapshot);
      }),
    [documentPath]
  );
}

export function getWorkspaceDocumentPath(id: string) {
  return `/workspaces/${id}`;
}
