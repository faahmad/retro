import firebase from "firebase/app";
import "firebase/firestore";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyD4kQlUSbr4mteDhgkqVoOOzrRIXu3DazQ",
  authDomain: "retro-dev-786.firebaseapp.com",
  databaseURL: "https://retro-dev-786.firebaseio.com",
  projectId: "retro-dev-786",
  storageBucket: "retro-dev-786.appspot.com",
  messagingSenderId: "90646101192",
  appId: "1:90646101192:web:a4f37e1b62eb907e"
};

function createFirebaseApp(firebaseConfig: FirebaseConfig) {
  const firebaseApp = firebase.initializeApp(firebaseConfig);

  const firestoreCollections = {
    retroBoards: "retro-boards"
  };

  const retroBoardsCollection = firebaseApp
    .firestore()
    .collection(firestoreCollections.retroBoards);

  return {
    fetchAllRetroBoards: async () => {
      let retroBoards: RetroBoard[] = [];
      const retroBoardsSnapshot = await retroBoardsCollection.limit(10).get();
      // TODO: Figure out how to type a firebase document snapshot.
      retroBoardsSnapshot.forEach((retroBoardDoc: any) =>
        retroBoards.push({ ...retroBoardDoc.data(), uid: retroBoardDoc.id })
      );
      return retroBoards;
    },
    fetchRetroBoardById: async (retroBoardId: RetroBoard["uid"]) => {
      const retroBoardDoc = await retroBoardsCollection.doc(retroBoardId).get();
      return { ...retroBoardDoc.data(), uid: retroBoardDoc.id };
    },
    updateRetroBoardById: async (
      retroBoardId: RetroBoard["uid"],
      retroBoard: RetroBoard
    ) => {
      const updateRetroBoardResponse = await retroBoardsCollection
        .doc(retroBoardId)
        .set(retroBoard);
      return updateRetroBoardResponse;
    }
  };
}

export const Firebase = createFirebaseApp(firebaseConfig);
