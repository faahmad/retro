import * as React from 'react';
import { RouteComponentProps, useParams } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { DragDropContext, DropResult, Droppable, Draggable } from 'react-beautiful-dnd';
import { v4 as uuidV4 } from 'uuid';
import moment from 'moment';
import { AddButton } from '../components/AddButton';
import { LoadingText } from '../components/LoadingText';
import { AuthContext } from '../contexts/AuthContext';
import Octicon, { Question } from '@primer/octicons-react';
import Linkify from 'react-linkify';
import { Footer } from '../components/Footer';
import ReactModal from 'react-modal';
import { Button } from '../components/Button';
import { ThumbsUpIcon } from '../components/ThumbsUpIcon';
import pencilIcon from '../assets/icons/pencil.svg';
import { PageContainer } from '../components/PageContainer';
import {
  RetroBoard as RetroBoardInterface,
  RetroColumnType,
  RetroItem,
  RetroColumn
} from '../types';
import { subscribeToRetroBoardById, updateRetroBoardById } from '../services/retro-board';

const RETRO_QUERY = gql`
  query RetroQuery($id: ID!) {
    retro(id: $id) {
      id
      name
      teamId
      workspaceId
      createdById
      createdAt
      updatedAt
    }
  }
`;

export const RetroBoardPage: React.FC<RouteComponentProps> = () => {
  const params = useParams<{ retroId: string }>();
  const { data, loading, error } = useQuery(RETRO_QUERY, {
    variables: { id: params.retroId }
  });

  if (loading) {
    return (
      <PageContainer>
        <p className="text-blue">Fetching retro...</p>
      </PageContainer>
    );
  }

  if (!data || !data.retro) {
    return (
      <PageContainer>
        <p className="text-red">Couldn't fetch the retro.</p>
        {error && <p className="text-red">{error.message}</p>}
      </PageContainer>
    );
  }

  const { retro } = data;

  return (
    <React.Fragment>
      <PageContainer>
        <h1 className="text-blue text-4xl font-bold mb-8">
          {retro.name || 'Retro Board'} -{' '}
          <span className="font-normal">
            {moment(retro.createdAt).format('MM.DD.YYYY')}
          </span>
        </h1>
        <RetroBoard id={params.retroId} />
      </PageContainer>
      <Footer />
    </React.Fragment>
  );
};

// import { RetroItemModal } from "../components/RetroItemModal";
interface RetroBoardProps {
  id: RetroBoardInterface['id'];
}
interface RetroBoardState {
  lastUpdatedAt: Date;
  isFetching: boolean;
  retroBoard: RetroBoardInterface;
  isModalOpen: boolean;
  columnTypeToAddItemTo: RetroColumnType | null;
  initialRetroItem?: RetroItem;
}
export class RetroBoard extends React.Component<RetroBoardProps, RetroBoardState> {
  static contextType = AuthContext;
  unsubscribeFromRetroBoardFn: any;
  // TODO: Fix this typing.
  constructor(props: any) {
    super(props);
    this.state = {
      lastUpdatedAt: new Date() as RetroBoardState['lastUpdatedAt'],
      isFetching: true as RetroBoardState['isFetching'],
      retroBoard: null as any,
      isModalOpen: false as RetroBoardState['isModalOpen'],
      columnTypeToAddItemTo: null as RetroBoardState['columnTypeToAddItemTo'],
      initialRetroItem: undefined
    };
    this.unsubscribeFromRetroBoardFn = null;
  }

  async componentDidMount() {
    this.unsubscribeFromRetroBoardFn = subscribeToRetroBoardById(
      this.props.id,
      this.handleSetRetroBoardState
    );
    await this.setState({ isFetching: false });
    return;
  }

  componentWillUnmount() {
    if (this.unsubscribeFromRetroBoardFn) {
      this.unsubscribeFromRetroBoardFn();
    }
  }

  handleSetRetroBoardState = async (retroBoard: RetroBoardInterface | undefined) => {
    if (!retroBoard) {
      return;
    }
    await this.setState({ retroBoard });
  };

  handleAddItemToColumn = async (
    content: RetroItem['content'],
    column: RetroColumnType
  ) => {
    const newItem: RetroItem = {
      content,
      id: uuidV4(),
      likedBy: {},
      likeCount: 0,
      createdByDisplayName: this.context.displayName,
      createdByUserId: this.context.uid,
      createdByPhotoURL: this.context.photoURL
    };

    const prevColumn = this.state.retroBoard.columns[column];
    const newItemIds = [...prevColumn.itemIds, newItem.id];
    const newColumn: RetroColumn = {
      ...prevColumn,
      itemIds: newItemIds
    };

    // YUCK! FIXME! DRY ME!
    await this.setState((prevState) => ({
      retroBoard: {
        ...prevState.retroBoard,
        items: { ...prevState.retroBoard.items, [newItem.id]: newItem },
        columns: {
          ...prevState.retroBoard.columns,
          [newColumn.type]: {
            ...prevColumn,
            itemIds: newItemIds
          }
        }
      }
    }));

    await updateRetroBoardById(this.state.retroBoard.id, this.state.retroBoard);

    return;
  };

  handleEditItem = async (item: RetroItem, _columnType: any) => {
    await this.setState((prevState) => ({
      retroBoard: {
        ...prevState.retroBoard,
        items: { ...prevState.retroBoard.items, [item.id]: item }
      }
    }));

    await updateRetroBoardById(this.state.retroBoard.id, this.state.retroBoard);

    return;
  };

  handleDeleteItem = async (itemId: RetroItem['id'], columnType: RetroColumnType) => {
    const { retroBoard } = this.state;

    const items = retroBoard.items;
    delete items[itemId];

    const prevColumn = retroBoard.columns[columnType];
    const newItemIds = prevColumn.itemIds.filter((id) => id !== itemId);

    await this.setState((prevState) => ({
      initialRetroItem: undefined,
      retroBoard: {
        ...prevState.retroBoard,
        items,
        columns: {
          ...prevState.retroBoard.columns,
          [columnType]: {
            ...prevColumn,
            itemIds: newItemIds
          }
        }
      }
    }));

    await updateRetroBoardById(this.state.retroBoard.id, this.state.retroBoard);

    return;
  };

  handleOnClickLike = async (itemId: RetroItem['id']) => {
    const { id } = this.context;
    const item = this.state.retroBoard.items[itemId];

    const newLikedBy = item.likedBy;
    if (item.likedBy[id]) {
      delete newLikedBy[id];
    } else {
      item.likedBy[id] = true;
    }

    const newItem = {
      ...item,
      likedBy: newLikedBy
    };

    await this.setState((prevState) => ({
      retroBoard: {
        ...(prevState.retroBoard || {}),
        items: {
          ...prevState.retroBoard.items,
          [newItem.id]: {
            ...newItem,
            likeCount: Object.keys(newItem.likedBy).length
          }
        }
      }
    }));

    updateRetroBoardById(this.state.retroBoard.id, this.state.retroBoard);

    return;
  };

  handleOnDragEnd = async (dropResult: DropResult) => {
    const { destination, source, draggableId } = dropResult;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = this.state.retroBoard.columns[source.droppableId];
    const finish = this.state.retroBoard.columns[destination.droppableId];

    if (start === finish) {
      const newItemIds = [...start.itemIds];
      newItemIds.splice(source.index, 1);
      newItemIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        itemIds: newItemIds
      };

      await this.setState((prevState) => ({
        ...prevState,
        retroBoard: {
          ...prevState.retroBoard,
          columns: {
            ...prevState.retroBoard.columns,
            [newColumn.type]: newColumn
          }
        }
      }));
    } else {
      const startItemIds = [...start.itemIds];
      startItemIds.splice(source.index, 1);
      const newStart = {
        ...start,
        itemIds: startItemIds
      };

      const finishItemIds = [...finish.itemIds];
      finishItemIds.splice(destination.index, 0, draggableId);
      const newFinish = {
        ...finish,
        itemIds: finishItemIds
      };

      await this.setState((prevState) => ({
        ...prevState,
        retroBoard: {
          ...prevState.retroBoard,
          columns: {
            ...prevState.retroBoard.columns,
            [newStart.type]: newStart,
            [newFinish.type]: newFinish
          }
        }
      }));
    }

    updateRetroBoardById(this.state.retroBoard.id, this.state.retroBoard);

    return;
  };

  handleOnClickEdit = (
    columnType: RetroColumnType,
    initialRetroItem: RetroBoardState['initialRetroItem']
  ) => {
    this.setState({
      initialRetroItem,
      isModalOpen: true,
      columnTypeToAddItemTo: columnType
    });
  };

  handleToggleModal = () => {
    this.setState({
      isModalOpen: false,
      columnTypeToAddItemTo: null,
      initialRetroItem: undefined
    });
  };

  render() {
    const {
      isFetching,
      retroBoard,
      isModalOpen,
      columnTypeToAddItemTo,
      initialRetroItem
    } = this.state;

    return (
      <React.Fragment>
        {isFetching && <LoadingText />}
        {isModalOpen && (
          <RetroItemModal
            column={retroBoard.columns[columnTypeToAddItemTo || 'good']}
            isOpen={isModalOpen}
            columnType={columnTypeToAddItemTo}
            initialRetroItem={initialRetroItem}
            onToggle={this.handleToggleModal}
            onSubmit={this.handleAddItemToColumn}
            onEdit={this.handleEditItem}
            onDelete={this.handleDeleteItem}
          />
        )}
        {retroBoard && (
          <React.Fragment>
            <div className="retro-board__grid">
              <DragDropContext onDragEnd={this.handleOnDragEnd}>
                {retroBoard.columnOrder.map((columnType: RetroColumn['type']) => {
                  const column = retroBoard.columns[columnType];
                  const items = column.itemIds.map(
                    (itemId: RetroItem['id']) => retroBoard.items[itemId]
                  );
                  return (
                    <RetroList
                      title={column.title}
                      key={columnType}
                      type={columnType}
                      items={items}
                      handleOnClickAdd={() =>
                        this.setState({
                          isModalOpen: true,
                          columnTypeToAddItemTo: columnType
                        })
                      }
                      handleOnClickLike={this.handleOnClickLike}
                      handleOnClickEdit={this.handleOnClickEdit}
                    />
                  );
                })}
              </DragDropContext>
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

interface RetroListProps {
  title: RetroColumn['title'];
  type: RetroColumn['type'];
  items: any[];
  handleOnClickAdd: () => void;
  handleOnClickLike: (itemId: RetroItem['id']) => void;
  handleOnClickEdit: (columnType: RetroColumnType, initialRetroItem: RetroItem) => void;
}

export const RetroList: React.FC<RetroListProps> = ({
  title,
  type,
  items,
  handleOnClickAdd,
  handleOnClickLike,
  handleOnClickEdit
}) => {
  return (
    <div className="flex flex-col border border-red shadow shadow-red">
      <div className="bg-white flex px-4 pt-2 pb-4 justify-between items-end mb-2 border border-red">
        <p className="text-blue font-bold text-sm">{title}</p>
        <AddButton className="self-end" onClick={handleOnClickAdd} />
      </div>
      <Droppable droppableId={type}>
        {(provided) => {
          return (
            <ul
              ref={provided.innerRef}
              className="m-0 p-0 overflow-auto h-full"
              {...provided.droppableProps}
            >
              {items.map((item: RetroItem, index) => {
                return (
                  <RetroListItem
                    key={item.id}
                    index={index}
                    handleOnClickLike={handleOnClickLike}
                    handleOnClickEdit={() => handleOnClickEdit(type, item)}
                    {...item}
                  />
                );
              })}
              {provided.placeholder}
            </ul>
          );
        }}
      </Droppable>
    </div>
  );
};

export const RetroListItem: React.FC<
  RetroItem & {
    index: number;
    handleOnClickLike: (itemId: RetroItem['id']) => void;
    handleOnClickEdit: () => void;
  }
> = ({
  id,
  content,
  likedBy,
  likeCount,
  createdByDisplayName,
  createdByUserId,
  createdByPhotoURL,
  handleOnClickLike,
  handleOnClickEdit,
  index
}) => {
  const authAccount: any = React.useContext(AuthContext);

  return (
    <Draggable draggableId={id} index={index} isDragDisabled={false}>
      {(provided, snapshot) => {
        return (
          <li
            ref={provided.innerRef}
            className={`retro-list-item flex content-center justify-between p-2 mb-1 mx-2 bg-white text-blue text-sm active:outline-none focus:outline-none ${
              snapshot.isDragging
                ? 'shadow shadow-blue border border-blue bg-pink-1/2'
                : 'border border-red'
            }`}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div className="flex content-center">
              {createdByPhotoURL ? (
                <img
                  alt="user avatar"
                  className="flex content-center content-center bg-blue rounded-full mr-2"
                  style={{ height: 40, width: 40 }}
                  src={createdByPhotoURL}
                />
              ) : (
                <div
                  className="flex content-center items-center bg-blue mr-2 rounded-full text-white"
                  style={{ height: 40, width: 40 }}
                >
                  {createdByDisplayName ? (
                    createdByDisplayName[0]
                  ) : (
                    <Octicon size="medium" icon={Question} />
                  )}
                </div>
              )}

              <div>
                <Linkify>
                  <span className="text-break">{content}</span>
                </Linkify>
              </div>
            </div>

            <div className="flex ml-2 items-center">
              {createdByUserId === authAccount.uid && (
                <EditButton onClick={handleOnClickEdit} />
              )}
              <LikeButton
                likeCount={likeCount}
                likedBy={likedBy}
                currentUserId={authAccount.displayName}
                onClick={() => handleOnClickLike(id)}
              />
            </div>
          </li>
        );
      }}
    </Draggable>
  );
};

interface LikeButtonProps {
  likeCount: number;
  likedBy: RetroItem['likedBy'];
  currentUserId: string;
  onClick: () => void;
}

const LikeButton = ({ likeCount, likedBy, currentUserId, onClick }: LikeButtonProps) => {
  return (
    <div className="flex items-center content-center">
      <span>{likeCount}</span>
      <button
        className="rounded-full focus:outline-none active:transform-1 h-8 w-8"
        onClick={onClick}
      >
        <div className="flex content-center items-center">
          <ThumbsUpIcon filled={likedBy[currentUserId]} />
        </div>
      </button>
    </div>
  );
};

interface EditButtonProps {
  onClick: () => void;
}

const EditButton: React.FC<EditButtonProps> = ({ onClick }) => {
  return (
    <div className="flex items-center justify-center mr-2">
      <button
        className="rounded-full h-8 w-8 focus:outline-none active:transform-1"
        onClick={onClick}
      >
        <div className={`flex justify-center items-end`}>
          <img src={pencilIcon} alt="edit pencil" />
        </div>
      </button>
    </div>
  );
};

interface RetroItemModalProps {
  isOpen: boolean;
  column: RetroColumn;
  columnType: RetroColumnType | null;
  onToggle: () => void;
  onSubmit: (content: RetroItem['content'], column: RetroColumnType) => Promise<void>;
  initialRetroItem?: RetroItem;
  onEdit: (item: RetroItem, column: RetroColumnType) => Promise<void>;
  onDelete: (itemId: RetroItem['id'], column: RetroColumnType) => Promise<void>;
}

interface RetroItemModalState {
  columnType: RetroColumnType | '';
  content: RetroItem['content'];
  isSubmitting: boolean;
}

export class RetroItemModal extends React.Component<
  RetroItemModalProps,
  RetroItemModalState
> {
  constructor(props: RetroItemModalProps) {
    super(props);
    this.state = {
      columnType: props.columnType || '',
      content: props.initialRetroItem ? props.initialRetroItem.content : '',
      isSubmitting: false
    };
  }
  handleSubmit = async () => {
    const { content, columnType } = this.state;
    const { initialRetroItem } = this.props;
    if (!content) {
      console.log("Content can't be empty.");
      return;
    }
    if (!columnType) {
      console.log("Column can't be empty.");
      return;
    }
    this.setState({ isSubmitting: true });
    if (!initialRetroItem) {
      await this.props.onSubmit(content, columnType);
    } else {
      await this.props.onEdit({ ...initialRetroItem, content }, columnType);
    }
    await this.setState({ isSubmitting: false });
    this.props.onToggle();
    return;
  };
  handleDelete = async () => {
    const { onDelete, initialRetroItem, columnType, onToggle } = this.props;
    this.setState({ isSubmitting: true });
    if (initialRetroItem && columnType) {
      onDelete(initialRetroItem!.id, columnType!);
    }
    await this.setState({ isSubmitting: false });
    onToggle();
    return;
  };
  render() {
    const { isOpen, onToggle, initialRetroItem, column } = this.props;
    const { content, isSubmitting } = this.state;

    return (
      <ReactModal
        ariaHideApp={false}
        isOpen={isOpen}
        onRequestClose={onToggle}
        style={{
          content: {
            maxWidth: '420px',
            height: '530px',
            padding: '20px',
            width: '100%'
          },
          overlay: { background: 'rgba(17, 38, 156, 0.6)' }
        }}
        className="bg-white shadow-red border m-auto absolute inset-0 border-red focus:outline-none z-50"
        // IMPORTANT: closeTimeoutMS has to be the same as what is set in the tailwind.css file.
        closeTimeoutMS={200}
      >
        <div>
          <div>
            <div className="text-blue">
              <div className="flex justify-between mb-2">
                <label htmlFor="content" className="text-blue font-bold text-sm">
                  {column.title}
                </label>
                {initialRetroItem && (
                  <button
                    className="mb-2 text-xs"
                    onClick={this.handleDelete}
                    disabled={isSubmitting}
                  >
                    Delete
                  </button>
                )}
              </div>
              <textarea
                className="w-full p-2 border border-red text-blue focus:outline-none"
                id="retro-item-modal-content-text-input"
                rows={10}
                name="content"
                value={content}
                onChange={(e) => this.setState({ content: e.target.value })}
              />
            </div>
          </div>
          <div className="flex align-center justify-between mt-8">
            {/* 
            FIXME: 2/18/2020 
            Tried to override the styles by passing in classNames,
            but it wasn't working. Decided to use inline for time's sake,
            however, we should be able to override any styles via the className prop.  
          */}
            <Button
              onClick={onToggle}
              disabled={isSubmitting}
              className="text-red border-none shadow-none"
              style={{ width: '6rem', boxShadow: 'none' }}
            >
              Cancel
            </Button>
            <Button
              className="text-blue"
              style={{ width: '10rem' }}
              disabled={isSubmitting}
              onClick={this.handleSubmit}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>
      </ReactModal>
    );
  }
}
