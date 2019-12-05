import React from "react";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Button } from "../components/Button";

const LIST_USERS_QUERY = gql`
  query users {
    users {
      id
      email
    }
  }
`;

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput) {
    createUser(input: $input) {
      id
      email
      createdAt
    }
  }
`;

export const DevelopmentOnlyWorkspacesPage = () => {
  const { loading, data } = useQuery(LIST_USERS_QUERY);
  const [createUser] = useMutation(CREATE_USER_MUTATION);
  const [email, setEmail] = React.useState("");

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!email) {
      return;
    }
    const input = { email };
    console.log("creating...");
    await createUser({ variables: { input } });
  };

  console.log(data);

  return (
    <div className="flex flex-col m-8">
      <div className="bg-white border text-blue border-blue shadow max-w-md p-8 mb-4">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label className="mb-4" htmlFor="email">
              What's your email?
            </label>
            <input
              name="email"
              className="border py-2 font text-xl shadow"
              onChange={event => setEmail(event.target.value)}
            />
          </div>
          <Button className="mt-2 float-right" type="submit">
            Submit
          </Button>
        </form>
      </div>
      {loading && <div>Loading...</div>}
      {!loading && data && (
        <div>
          <pre>
            <code>{JSON.stringify(data.users, null, 2)}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
