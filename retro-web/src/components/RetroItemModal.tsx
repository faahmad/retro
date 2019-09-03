import * as React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner
} from "reactstrap";
import Octicon, { Trashcan } from "@primer/octicons-react";

const columnClassNames = {
  default: "dark",
  good: "success",
  bad: "danger",
  actions: "primary",
  questions: "info"
};

interface RetroItemModalProps {
  isOpen: boolean;
  columnType: RetroColumnType | null;
  onToggle: () => void;
  onSubmit: (
    content: RetroItem["content"],
    column: RetroColumnType
  ) => Promise<void>;
  initialRetroItem?: RetroItem;
  onEdit: (item: RetroItem, column: RetroColumnType) => Promise<void>;
  onDelete: (itemId: RetroItem["id"], column: RetroColumnType) => Promise<void>;
}

interface RetroItemModalState {
  columnType: RetroColumnType | "";
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
      content: props.initialRetroItem ? props.initialRetroItem.content : "",
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
    const { isOpen, onToggle, initialRetroItem } = this.props;
    const { columnType, content, isSubmitting } = this.state;

    return (
      <Modal isOpen={isOpen} toggle={onToggle}>
        <ModalHeader>
          <span className="font-weight-light">
            {!initialRetroItem
              ? "Add an item to the"
              : "Editing an item in the"}
            <span
              className={`font-weight-bold text-${
                columnClassNames[columnType || "default"]
              }`}
            >
              {`  ${columnType}` || ""}
            </span>{" "}
            column
          </span>
        </ModalHeader>
        <Form>
          <ModalBody>
            {!this.props.initialRetroItem ? (
              <FormGroup>
                <Label for="content">Column</Label>
                <Input
                  id="retro-item-modal-column-select-input"
                  type="select"
                  name="column"
                  value={columnType}
                  onChange={e => {
                    const columnType = e.target.value as RetroColumnType;
                    this.setState({ columnType });
                  }}
                >
                  <option disabled value="">
                    Select a column
                  </option>
                  <option value="good">good</option>
                  <option value="bad">bad</option>
                  <option value="actions">actions</option>
                  <option value="questions">questions</option>
                </Input>
              </FormGroup>
            ) : null}
            <FormGroup>
              <div className="d-flex justify-content-between">
                <Label for="content">What's on your mind?</Label>
                {this.props.initialRetroItem && (
                  <Button
                    size="sm"
                    color="light"
                    className="mb-2"
                    onClick={this.handleDelete}
                    disabled={isSubmitting}
                  >
                    <Octicon icon={Trashcan} />
                  </Button>
                )}
              </div>
              <Input
                id="retro-item-modal-content-text-input"
                type="textarea"
                name="content"
                rows={4}
                value={content}
                onChange={e => this.setState({ content: e.target.value })}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter className="d-flex justify-content-between">
            <Button color="light" onClick={onToggle} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              size="lg"
              color={columnClassNames[columnType || "default"]}
              onClick={this.handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spinner color="light" /> : "Submit"}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    );
  }
}
