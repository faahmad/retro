import request from "supertest";
import app from "../../app";

export const executeGraphQLQuery = async (query, variables) => {
  const response = await request(app)
    .post("/graphql")
    .set("Accept", "application/json")
    .send({ query, variables })
    .expect("Content-Type", /json/);

  return response.body;
};
