import * as React from "react";
import ReactModal from "react-modal";
import { Button } from "../components/Button";
import { RetroColumn, RetroColumnType } from "../types/retro-column";
import { RetroItem } from "../types/retro-item";

interface RetroItemModalProps {
  isOpen: boolean;
  columnTitle: RetroColumn["title"];
  columnType: RetroColumnType;
  onToggle: () => void;
  onAddItem: ({ content, type }: { content: string; type: RetroColumnType }) => void;
  // RetroItem is defined when editing an existing item.
  retroItem: RetroItem | null;
  onEditItem: (retroItemId: RetroItem["id"], content: string) => void;
  onDeleteItem: (
    retroItemId: RetroItem["id"],
    columnType: RetroItem["type"]
  ) => Promise<void>;
}

interface RetroItemModalState {
  columnType: RetroColumnType;
  content: RetroItem["content"];
  isSubmitting: boolean;
}

export class RetroItemModal extends React.Component<
  RetroItemModalProps,
  RetroItemModalState
> {
  constructor(props: RetroItemModalProps) {
    super(props);
    this.state = {
      columnType: props.columnType || "",
      content: props.retroItem?.content || "",
      isSubmitting: false
    };
  }

  handleKeydownEvent = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.keyCode === 13) {
      this.handleSubmit();
    }
  };
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeydownEvent);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeydownEvent);
  }

  handleSubmit = () => {
    this.props.retroItem ? this.handleEditItem() : this.handleAddItem();
  };

  handleAddItem = async () => {
    const { content, columnType } = this.state;
    if (!content || !columnType) {
      return;
    }
    this.setState({ isSubmitting: true });
    this.props.onAddItem({ content, type: columnType });
    await this.setState({ isSubmitting: false });
    this.props.onToggle();
    return;
  };

  handleEditItem = async () => {
    const { retroItem } = this.props;
    const { content, columnType } = this.state;
    if (!content || !columnType || !retroItem) {
      return;
    }
    this.setState({ isSubmitting: true });
    this.props.onEditItem(retroItem.id, content);
    await this.setState({ isSubmitting: false });
    this.props.onToggle();
    return;
  };

  handleDeleteItem = async () => {
    const { onDeleteItem, retroItem, columnType, onToggle } = this.props;
    this.setState({ isSubmitting: true });
    if (retroItem && columnType) {
      await onDeleteItem(retroItem!.id, columnType);
    }
    await this.setState({ isSubmitting: false });
    onToggle();
    return;
  };

  render() {
    const { isOpen, onToggle, columnTitle, retroItem } = this.props;
    const { content, isSubmitting } = this.state;

    return (
      <ReactModal
        ariaHideApp={false}
        isOpen={isOpen}
        onRequestClose={onToggle}
        style={{
          content: {
            maxWidth: "420px",
            height: "530px",
            padding: "20px",
            width: "100%"
          },
          overlay: { background: "rgba(17, 38, 156, 0.6)" }
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
                  {columnTitle}
                </label>
                {/* TODO: Allow user to delete an item. */}
                {retroItem && (
                  <button
                    className="mb-2 text-xs"
                    onClick={this.handleDeleteItem}
                    disabled={isSubmitting}
                  >
                    Delete
                  </button>
                )}
              </div>
              <TextArea
                content={content}
                onChange={(e: any) => this.setState({ content: e.target.value })}
              />
            </div>
          </div>
          <div className="flex align-center justify-between mt-8">
            <Button
              onClick={onToggle}
              disabled={isSubmitting}
              className="text-red border-none shadow-none"
              style={{ width: "6rem", boxShadow: "none" }}
            >
              Cancel
            </Button>
            <div className="flex flex-col">
              <Button
                className="bg-blue text-white"
                style={{ width: "10rem" }}
                disabled={isSubmitting}
                onClick={this.handleSubmit}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>
        </div>
      </ReactModal>
    );
  }
}

function TextArea({ content, onChange }: any) {
  const textArea = React.useRef<any>(null);
  React.useEffect(() => {
    textArea?.current?.focus();
  }, []);

  return (
    <textarea
      ref={textArea}
      className="w-full p-2 border border-red text-blue focus:outline-none"
      id="retro-item-modal-content-text-input"
      rows={10}
      name="content"
      value={content}
      onChange={onChange}
    />
  );
}
