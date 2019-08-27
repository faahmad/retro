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
import Octicon, { MailRead } from "@primer/octicons-react";

interface InviteUserModalProps {
  isOpen: boolean;
  workspaceDisplayName: string;
  onToggle: () => void;
  onSubmit: (email: string) => void;
}

interface InviteUserModalState {
  isSubmitting: boolean;
  email: string;
  name: string;
}

export class InviteUserModal extends React.Component<
  InviteUserModalProps,
  InviteUserModalState
> {
  constructor(props: InviteUserModalProps) {
    super(props);
    this.state = {
      isSubmitting: false,
      email: "",
      name: ""
    };
  }
  handleSubmit = async (e: any) => {
    e.preventDefaul();
    return this.props.onSubmit(this.state.email);
  };
  render() {
    const { isOpen, onToggle } = this.props;
    const { email, isSubmitting, name } = this.state;

    return (
      <Modal size="lg" isOpen={isOpen} toggle={onToggle}>
        <ModalHeader>
          <span className="font-weight-light">Invite people to </span>{" "}
          <span>{this.props.workspaceDisplayName}</span>
        </ModalHeader>
        <Form onSubmit={this.handleSubmit}>
          <ModalBody>
            <Row className="d-flex align-items-center">
              <Col md="6">
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
              <Col md="5">
                <FormGroup>
                  <Label for="name">Name (optional)</Label>
                  <Input
                    type="text"
                    name="name"
                    value={name}
                    onChange={e => this.setState({ name: e.target.value })}
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
