import { GetAdminByIdQuery } from './../../common/sdk';
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { getAdminFromHeaders } from '../../common/getAdminFromHeaders';



const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  const { headers } = event;
  let admin :GetAdminByIdQuery;
  try {
     admin = await getAdminFromHeaders(headers)
  } catch (error) {
    return JSON.parse(error.message)
  }
  

  return {
    statusCode: 200,
    body: JSON.stringify({id:admin.admin_by_pk?.id, username:admin.admin_by_pk?.username }),
  };
};

export { handler };
