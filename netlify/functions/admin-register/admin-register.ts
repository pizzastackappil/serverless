import { getSdk } from "../../common/sdk";
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { GraphQLClient } from "graphql-request";
import jwt from "jsonwebtoken";
import crypto from "crypto";

interface AdminRegisterInput {
  username: "string";
  password: "string";
}

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  const { body, headers } = event;
  if (
    !headers["x-pizzastack-secret-key"] ||
    headers["x-pizzastack-secret-key"] !== "mypizzastacksecretkey"
  ) {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "'x-pizzastack-secret-key 'is missing or value invalid" }),
    };
  }

  const input: AdminRegisterInput = JSON.parse(body!).input.admin;

  const sdk = getSdk(new GraphQLClient("http://localhost:8080/v1/graphql"));
  const password = crypto
    .pbkdf2Sync(input.password, "mygreatsaltsecret", 1000, 64, "sha512")
    .toString("hex");
  const data = await sdk.insertAdmin({
    username: input.username,
    password,
  });

  const db = data.insert_admin_one?.id;

  const accessToken = jwt.sign(
    {
      "https://hasura.io/jwt/claims": {
        "x-hasura-allowed-roles": ["admin"],
        "x-hasura-default-role": "admin",
        "x-hasura-user-id": db,
      },
    },
    "mygreatjwtsecret"
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ accessToken: accessToken }),
  };
};

export { handler };
