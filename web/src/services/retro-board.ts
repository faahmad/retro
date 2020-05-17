import firebase from '../lib/firebase';
import { RetroBoard, CreateRetroBoardInput } from '../types';
import { buildEmptyRetroBoard } from '../utils/build-empty-retro-board';

const retroBoardsCollection = firebase.firestore().collection('retroBoards');

export const createRetroBoardInFirebase = async (input: CreateRetroBoardInput) => {
  if (!input.id || !input.workspaceId || !input.teamId || !input.createdById) {
    return;
  }
  try {
    const newRetroBoard: RetroBoard = buildEmptyRetroBoard(input);
    await retroBoardsCollection.doc(input.id).set(newRetroBoard);
    return;
  } catch (error) {
    console.log('Error creating retro board:', error);
  }
};

// export const fetchRetroBoardById = async (id: RetroBoard["id"]) => {
//   const retroBoardDoc = await retroBoardsCollection.doc(id).get();
//   return retroBoardDoc.data();
// };

export const subscribeToRetroBoardById = (
  id: RetroBoard['id'],
  onSnapshotCallback: (retroBoard: RetroBoard) => void
) => {
  return retroBoardsCollection.doc(id).onSnapshot((retroBoardDoc) => {
    onSnapshotCallback((retroBoardDoc.data() as unknown) as RetroBoard);
  });
};

export const updateRetroBoardById = (id: RetroBoard['id'], retroBoard: RetroBoard) => {
  return retroBoardsCollection.doc(id).set(retroBoard);
};
