import request from "supertest";
import faker from "faker";
import app from "../../app";

export const executeGraphQLQuery = async ({
  query,
  variables,
  userId = faker.random.uuid()
}) => {
  const response = await request(app)
    .post("/graphql")
    .set({ Accept: "application/json", "x-retro-auth": userId })
    .send({ query, variables })
    .expect("Content-Type", /json/);

  return response.body;
};
