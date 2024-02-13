import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
interface AdminRegisterInput {
    username:'string';
    password:'string'
}

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    const {body} = event
    const input:AdminRegisterInput = JSON.parse(body!).input.admin
    return {
    statusCode: 200,
    body: JSON.stringify({ accessToken:"Hello World!!!" }),
  };
};

export { handler };