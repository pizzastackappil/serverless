import { AdminRegisterInput } from "../../common/sdk";
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { hashPassword } from "../../common/password";
import { signToken } from "../../common/jwt";
import { api } from "../../common/api";
import { config } from "../../core/config";



const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  const { body, headers } = event;
  if (
    !headers["x-pizzastack-secret-key"] ||
    headers["x-pizzastack-secret-key"] !== config.hasuraPizzastackSecret
  ) {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "'x-pizzastack-secret-key 'is missing or value invalid" }),
    };
  }

  const input: AdminRegisterInput = JSON.parse(body!).input.admin;

  
  const password = hashPassword(input.password)
  const data = await api.insertAdmin({
    username: input.username,
    password,
  },{
    'x-hasura-admin-secret':config.hasuraAdminSecret
  });

  

  const accessToken = signToken(data.insert_admin_one?.id)

  return {
    statusCode: 200,
    body: JSON.stringify({ accessToken: accessToken }),
  };
};

export { handler };
