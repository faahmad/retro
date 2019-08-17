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
  const firebaseCollections = {
    retroBoards: "retro-boards"
  };

  return {
    fetchAllRetroBoards: async () => {
      let retroBoards: any[] = [];

      const retroBoardsSnapshot = await firebaseApp
        .firestore()
        .collection(firebaseCollections.retroBoards)
        .limit(10)
        .get();

      retroBoardsSnapshot.forEach(retroBoardDoc =>
        retroBoards.push({ ...retroBoardDoc.data(), uid: retroBoardDoc.id })
      );

      return retroBoards;
    },
    updateRetroBoard: async (retroBoardState: any) => {
      const updateRetroBoardResponse: any = await firebaseApp
        .firestore()
        .collection(firebaseCollections.retroBoards)
        .doc()
        .set(retroBoardState);

      console.log(`Successfully updated retro-board.`);

      return updateRetroBoardResponse;
    }
  };
}

export const Firebase = createFirebaseApp(firebaseConfig);
