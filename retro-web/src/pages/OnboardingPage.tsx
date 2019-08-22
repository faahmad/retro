import * as React from "react";
import { FormGroup, Label, Input, Row, Col, Button } from "reactstrap";
import { Formik, Form, FormikActions, ErrorMessage } from "formik";
import * as yup from "yup";
import Octicon, { ChevronRight } from "@primer/octicons-react";
import { UserContext } from "../components/UserContext";
import { Firebase } from "../lib/Firebase";

interface CreateWorkspaceFormValue {
  workspaceName: string;
}

const validationSchema = yup.object().shape({
  workspaceName: yup
    .string()
    .trim()
    .lowercase()
    .min(2, "Too short! Min 2 characters.")
    .max(50, "Too long! Max 50 characters.")
    .required("Your workspace name is required.")
});

export class OnboardingPage extends React.Component<any, {}> {
  static contextType = UserContext;
  async componentDidMount() {
    const user = await Firebase.fetchUserById(this.context.userAuthAccount.uid);
    if (!user) {
      // If this is the first time we are seeing this user,
      // we need to create a user document for them.
      await Firebase.createUserDoc(this.context.userAuthAccount);
    }
    return;
  }

  handleSubmit = async (
    values: CreateWorkspaceFormValue,
    _formikActions: FormikActions<CreateWorkspaceFormValue>
  ) => {
    const workspaceId = await Firebase.createWorkspace(values.workspaceName);
    await Firebase.updateUserDoc(this.context.userAuthAccount.uid, {
      workspaceId,
      workspaceDisplayName: values.workspaceName
    });
    this.props.history.push("/dashboard");
  };

  render() {
    return (
      <div className="onboarding-page container">
        <h1>
          Welcome!{" "}
          <span role="img" aria-label="emoji-tada">
            🎉
          </span>
        </h1>
        <p>You're about to set up a new workspace on Retro.</p>
        <Row>
          <Col sm="12" lg="6">
            <Formik
              initialValues={{ workspaceName: "" }}
              validationSchema={validationSchema}
              onSubmit={this.handleSubmit}
            >
              {({ values, handleChange, handleBlur }) => {
                return (
                  <Form className="d-flex flex-column align-items-end">
                    <FormGroup>
                      <Label className="font-weight-bold" for="workspaceName">
                        Workspace Name
                      </Label>
                      <Input
                        type="text"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.workspaceName}
                        name="workspaceName"
                      />
                      <div className="d-flex flex-column">
                        <ErrorMessage
                          name="workspaceName"
                          render={errorMessage => (
                            <small className="text-danger mt-2">
                              {errorMessage}
                            </small>
                          )}
                        />
                        <small className="mt-2">
                          This will show up in menus and headings. It will
                          usually be (or include) the name of your company. It
                          doesn't need to be formal.
                        </small>
                      </div>
                    </FormGroup>
                    <Button
                      type="submit"
                      color="primary"
                      className="font-weight-bold"
                    >
                      Next <Octicon icon={ChevronRight} />
                    </Button>
                  </Form>
                );
              }}
            </Formik>
          </Col>
        </Row>
      </div>
    );
  }
}
