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
  Input
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
  onSubmit: (column: ColumnType, content: Item["content"]) => void;
}

interface RetroItemModalState {
  columnType: ColumnType | "";
  content: Item["content"];
}

export class RetroItemModal extends React.Component<
  RetroItemModalProps,
  RetroItemModalState
> {
  constructor(props: RetroItemModalProps) {
    super(props);
    this.state = {
      columnType: props.columnType || "",
      content: ""
    };
  }
  handleSubmit = async () => {
    await this.props.onSubmit("good", "");
    this.props.onToggle();
  };
  render() {
    const { isOpen, onToggle } = this.props;
    const { columnType } = this.state;

    return (
      <Modal isOpen={isOpen} toggle={onToggle}>
        <ModalHeader>
          <span className="font-weight-normal">
            Add an item to
            <span
              className={`font-weight-bold text-${
                columnClassNames[columnType || "default"]
              }`}
            >
              {`  ${columnType}` || ""}
            </span>
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
                value={this.state.columnType}
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
                value={this.state.content}
                onChange={e => this.setState({ content: e.target.value })}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter className="d-flex justify-content-between">
            <Button color="light" onClick={this.props.onToggle}>
              Cancel
            </Button>
            <Button size="lg" color="primary" onClick={this.handleSubmit}>
              Submit
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    );
  }
}
