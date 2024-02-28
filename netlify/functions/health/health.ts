import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";


const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  const { headers } = event;

  
  return {
    statusCode: 200,
    body: JSON.stringify({ headers }),
  };
};

export { handler };
