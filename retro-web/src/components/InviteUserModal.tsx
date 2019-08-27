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
  Spinner,
  Row,
  Col
} from "reactstrap";

interface InviteUserModalProps {
  isOpen: boolean;
  workspaceDisplayName: string;
  onToggle: () => void;
  onSubmit: (email: string) => void;
}

interface InviteUserModalState {
  isSubmitting: boolean;
  email: string;
}

export class InviteUserModal extends React.Component<
  InviteUserModalProps,
  InviteUserModalState
> {
  constructor(props: InviteUserModalProps) {
    super(props);
    this.state = {
      isSubmitting: false,
      email: ""
    };
  }
  handleSubmit = async (e: any) => {
    e.preventDefault();
    return this.props.onSubmit(this.state.email);
  };
  render() {
    const { isOpen, onToggle } = this.props;
    const { email, isSubmitting } = this.state;

    return (
      <Modal isOpen={isOpen} toggle={onToggle}>
        <ModalHeader>
          <span className="font-weight-light">Invite people to </span>{" "}
          <span>{this.props.workspaceDisplayName}</span>
        </ModalHeader>
        <Form onSubmit={this.handleSubmit}>
          <ModalBody>
            <Row className="d-flex align-items-center">
              <Col md="10">
                <FormGroup>
                  <Label for="email">Email Address</Label>
                  <Input
                    type="text"
                    name="email"
                    value={email}
                    onChange={e => this.setState({ email: e.target.value })}
                  />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter className="d-flex justify-content-between">
            <Button color="light" onClick={onToggle} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              onClick={this.handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spinner color="light" /> : "Send Invites"}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    );
  }
}
