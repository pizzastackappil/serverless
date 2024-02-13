import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import jwt from "jsonwebtoken";

interface AdminRegisterInput {
  username: "string";
  password: "string";
}

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  const { body } = event;
  const input: AdminRegisterInput = JSON.parse(body!).input.admin;

  const accessToken = jwt.sign({
    "https://hasura.io/jwt/claims": {
      "x-hasura-default-role": "admin",
      "x-hasura-allowed-roles": ["admin"],
      "x-hasura-user-id": "123",
    },
  },'mygreatjwtsecret');

  return {
    statusCode: 200,
    body: JSON.stringify({ accessToken: accessToken }),
  };
};

export { handler };
