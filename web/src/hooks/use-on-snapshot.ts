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
    (onSuccess: (data: T) => void) =>
      db.doc(documentPath).onSnapshot((snapshot) => {
        return onSuccess(({ id: snapshot.id, ...snapshot.data() } as unknown) as T);
      }),
    [documentPath]
  );
}
