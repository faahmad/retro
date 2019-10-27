import * as request from "supertest";
import { server } from "../../index";

export const executeGraphQLQuery = async query => {
  const response = await request(server)
    .post("/graphql")
    .set("Accept", "application/json")
    .send({ query })
    .expect(200)
    .expect("Content-Type", /json/);

  return response.body;
};
