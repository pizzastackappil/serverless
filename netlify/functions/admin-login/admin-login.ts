import { AdminLoginInput } from "../../common/sdk";
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { api } from "../../common/api";
import { hashPassword } from "../../common/password";
import { signToken } from "../../common/jwt";
import { config } from "../../core/config";

const invalidUsernameOrPassword = {
  statusCode: 404,
  body: JSON.stringify({ message: "user not found or password invalid" }),
};

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  const { body } = event;

  const input: AdminLoginInput = JSON.parse(body!).input.admin;

  const data = await api.GetAdminByUsername(
    { _username: input.username },
    {
      "x-hasura-admin-secret": config.hasuraAdminSecret,
    }
  );
  if (data.admin.length === 0) {
    return invalidUsernameOrPassword;
  }
  const hashedPassword = hashPassword(input.password);
  if (hashedPassword !== data.admin[0].password) {
    return invalidUsernameOrPassword
  }

    const accessToken = signToken(data.admin[0].id)

  return {
    statusCode: 200,
    body: JSON.stringify({ accessToken }),
  };
};

export { handler };
