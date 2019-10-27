/* eslint-disable */
import request from "supertest";
import app from "../../app";
import { factory } from "../test-helpers/factory";

describe("user query", () => {
  const userQuery = `
    query($id: ID!) {
      user(id: $id) {
        id
        email
        googleAccountId
        firstName
        lastName
        createdAt
        updatedAt
      }
    }
  `;

  describe("when the user exists", () => {
    it("should return the user with that matches the id", async () => {
      const user = await factory.user();
      const variables = { id: user.id };

      const response = await request(app)
        .post("/graphql")
        .set("Accept", "application/json")
        .send({ query: userQuery, variables })
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body).toMatchObject({
        data: {
          user: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          }
        }
      });
    });
  });
});
