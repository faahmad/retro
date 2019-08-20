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

const columnClassNames = {
  default: "dark",
  good: "success",
  bad: "danger",
  actions: "primary",
  questions: "info"
};

interface RetroItemModalProps {
  isOpen: boolean;
  columnType: ColumnType | null;
  onToggle: () => void;
  onSubmit: (content: Item["content"], column: ColumnType) => Promise<void>;
}

interface RetroItemModalState {
  columnType: ColumnType | "";
  content: Item["content"];
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
      content: "",
      isSubmitting: false
    };
  }
  handleSubmit = async () => {
    const { content, columnType } = this.state;
    if (!content) {
      console.log("Content can't be empty.");
      return;
    }
    if (!columnType) {
      console.log("Column can't be empty.");
      return;
    }
    this.setState({ isSubmitting: true });
    await this.props.onSubmit(content, columnType);
    await this.setState({ isSubmitting: false });
    this.props.onToggle();
    return;
  };
  render() {
    const { isOpen, onToggle } = this.props;
    const { columnType, content, isSubmitting } = this.state;

    return (
      <Modal isOpen={isOpen} toggle={onToggle}>
        <ModalHeader>
          <span className="font-weight-light">
            Add an item to the
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
            <FormGroup>
              <Label for="content">Column</Label>
              <Input
                id="retro-item-modal-column-select-input"
                type="select"
                name="column"
                value={columnType}
                onChange={e => {
                  const columnType = e.target.value as ColumnType;
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
            <FormGroup>
              <Label for="content">What's on your mind?</Label>
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
