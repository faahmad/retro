import * as React from "react";
import ReactModal from "react-modal";
import { Button } from "../components/Button";
import { RetroColumn, RetroColumnType } from "../types/retro-column";

interface RetroItemModalProps {
  isOpen: boolean;
  column: RetroColumn;
  columnType: RetroColumnType;
  onToggle: () => void;
  // onSubmit: (params: CreateRetroItemParams, column: string) => Promise<void>;
  // initialRetroItem?: RetroItem;
  // onEdit: (item: RetroItem, column: string) => Promise<void>;
  // onDelete: (itemId: RetroItem["id"], column: string) => Promise<void>;
}

interface RetroItemModalState {
  columnType: string | "";
  content: RetroItem["content"];
  isAnonymous: RetroItem["isAnonymous"];
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
      content: props.initialRetroItem ? props.initialRetroItem.content : "",
      isAnonymous: false,
      isSubmitting: false
    };
  }
  handlePostAnonymously = () => {
    this.setState({ isAnonymous: true }, () => this.handleSubmit());
    return;
  };

  handleSubmit = async () => {
    const { content, columnType, isAnonymous } = this.state;
    const { initialRetroItem } = this.props;
    if (!content) {
      return;
    }
    if (!columnType) {
      return;
    }
    this.setState({ isSubmitting: true });
    if (!initialRetroItem) {
      await this.props.onSubmit({ content, isAnonymous }, columnType);
    } else {
      await this.props.onEdit({ ...initialRetroItem, content, isAnonymous }, columnType);
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
