import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { defaultRetroBoard } from "../default-data/default-retro-board";

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
    retroBoards: "retro-boards",
    users: "users"
  };

  const retroBoardsCollection = firebaseApp
    .firestore()
    .collection(firestoreCollections.retroBoards);

  const usersCollection = firebaseApp
    .firestore()
    .collection(firestoreCollections.users);

  return {
    signInWithGoogleAuth: async () => {
      try {
        const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
        googleAuthProvider.addScope(
          "https://www.googleapis.com/auth/contacts.readonly"
        );
        const userCredential = await firebase
          .auth()
          .signInWithPopup(googleAuthProvider);
        return userCredential;
      } catch (error) {
        console.log(error.message);
      }
    },
    createUserDoc: async (user: firebase.User) => {
      try {
        await usersCollection.doc(user.uid).set({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        });
        console.log("Successfully created a user document!");
      } catch (error) {
        console.log("Error creating user doc:", error);
      }
    },
    fetchUserById: async (userId: firebase.User["uid"] | null) => {
      if (!userId) {
        console.log("Invalid userId, received: ", userId);
        return;
      }
      try {
        const userSnapshot = await usersCollection.doc(userId).get();
        return userSnapshot.data() as Promise<RetroUser>;
      } catch (error) {
        console.log("Error fetching user:", error);
      }
    },
    createRetroBoard: async () => {
      const newRetroBoardRef = await retroBoardsCollection.doc();
      await newRetroBoardRef.set({
        ...defaultRetroBoard,
        uid: newRetroBoardRef.id,
        createdAt: new Date()
      });
      return newRetroBoardRef.id;
    },
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
