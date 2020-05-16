import { RetroBoard, CreateRetroBoardInput } from '../types';

export function buildEmptyRetroBoard({
  id,
  workspaceId,
  teamId,
  createdById
}: CreateRetroBoardInput): RetroBoard {
  return {
    id,
    workspaceId,
    teamId,
    createdById,
    items: {},
    columns: {
      good: {
        type: 'good',
        title: 'What went well?',
        itemIds: []
      },
      bad: {
        type: 'bad',
        title: 'What can be improved?',
        itemIds: []
      },
      actions: {
        type: 'actions',
        title: 'What do we need to do?',
        itemIds: []
      },
      questions: {
        type: 'questions',
        title: 'What do we have questions on?',
        itemIds: []
      }
    },
    columnOrder: ['good', 'bad', 'actions', 'questions']
  };
}
