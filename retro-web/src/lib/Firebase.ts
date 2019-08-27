import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { createDefaultRetroBoard } from "../default-data/default-retro-board";

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

const transformStringToKebabCase = (s: string) => {
  return s.replace(/\s+/g, "-").toLowerCase();
};

function createFirebaseApp(firebaseConfig: FirebaseConfig) {
  const firebaseApp = firebase.initializeApp(firebaseConfig);

  const firestoreCollections = {
    retroBoards: "retroBoards",
    users: "users",
    workspaces: "workspaces"
  };

  const retroBoardsCollection = firebaseApp
    .firestore()
    .collection(firestoreCollections.retroBoards);

  const usersCollection = firebaseApp
    .firestore()
    .collection(firestoreCollections.users);

  const workspacesCollection = firebaseApp
    .firestore()
    .collection(firestoreCollections.workspaces);

  return {
    signInWithGoogleAuthPopup: async () => {
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
    createUserDoc: async (userAuthAccount: firebase.User) => {
      try {
        const newUser = {
          uid: userAuthAccount.uid,
          displayName: userAuthAccount.displayName,
          email: userAuthAccount.email,
          photoURL: userAuthAccount.photoURL
        };
        await usersCollection.doc(userAuthAccount.uid).set(newUser);
        console.log("Successfully created a user document!");
        return newUser;
      } catch (error) {
        console.log("Error creating user document:", error);
      }
    },
    updateUserDoc: async (
      userId: RetroUser["uid"],
      fieldsToUpdate: Partial<RetroUser>
    ) => {
      try {
        await usersCollection.doc(userId).set(fieldsToUpdate, { merge: true });
        console.log(`Successfully updated the user document ${userId}!`);
      } catch (error) {
        console.log(`Error updating user document ${userId}:`, error);
      }
    },
    createWorkspace: async (workspaceName: string) => {
      try {
        const { currentUser } = firebase.auth();
        if (!currentUser) {
          return;
        }
        const workspaceId = transformStringToKebabCase(workspaceName);
        const newWorkspace: RetroWorkspace = {
          uid: workspaceId,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          createdBy: currentUser.uid,
          displayName: workspaceName,
          users: {
            [currentUser.uid]: "owner"
          }
        };
        await workspacesCollection.doc(workspaceId).set(newWorkspace);
        return workspaceId;
      } catch (error) {
        console.log(`Error creating workspace ${workspaceName}`, error);
      }
    },
    fetchWorkspaceById: async (workspaceId: RetroWorkspace["uid"]) => {
      try {
        const workspaceSnapshot = await workspacesCollection
          .doc(workspaceId)
          .get();
        return workspaceSnapshot.data() as Promise<RetroWorkspace>;
      } catch (error) {
        console.log("Error fetching workspace:", error);
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
    fetchUsersByWorkspaceId: async (workspaceId: RetroWorkspace["uid"]) => {
      try {
        const workspaceUsersQuerySnapshot = await usersCollection
          .where("workspaceId", "==", workspaceId)
          .get();
        let workspaceUsers: RetroUser[] = [];
        workspaceUsersQuerySnapshot.forEach(workspaceUserDoc => {
          const user = (workspaceUserDoc.data() as unknown) as RetroUser;
          workspaceUsers.push(user);
        });
        return workspaceUsers;
      } catch (error) {
        console.log("Error fetching workspace users:", error);
      }
    },
    createRetroBoard: async (workspaceId: RetroWorkspace["uid"]) => {
      if (!workspaceId) {
        return;
      }
      try {
        const newRetroBoard: RetroBoard = createDefaultRetroBoard(
          workspaceId,
          firebase.firestore.FieldValue.serverTimestamp()
        );
        const newRetroBoardRef = await retroBoardsCollection.add(newRetroBoard);
        await retroBoardsCollection
          .doc(newRetroBoardRef.id)
          .set({ uid: newRetroBoardRef.id }, { merge: true });
        await workspacesCollection.doc(workspaceId).set(
          {
            retroBoards: {
              [newRetroBoardRef.id]: true
            }
          },
          { merge: true }
        );
        return newRetroBoardRef.id;
      } catch (error) {
        console.log("Error creating retro board:", error);
      }
    },
    fetchAllRetroBoardsByWorkspaceId: async (
      workspaceId: RetroWorkspace["uid"]
    ) => {
      let retroBoards: RetroBoard[] = [];
      try {
        const retroBoardsSnapshot = await retroBoardsCollection
          .limit(10)
          .where("workspaceId", "==", workspaceId)
          .orderBy("createdAt", "desc")
          .get();
        // TODO: Figure out how to type a firebase document snapshot.
        retroBoardsSnapshot.forEach((retroBoardDoc: any) =>
          retroBoards.push({ ...retroBoardDoc.data(), uid: retroBoardDoc.id })
        );
        return retroBoards;
      } catch (error) {
        console.log("Error fetching all retro boards:", error);
      }
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
