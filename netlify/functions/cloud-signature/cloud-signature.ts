import { Handler, HandlerContext, HandlerEvent } from "@netlify/functions";
import { v2 as cloudinary } from "cloudinary";
import { getAdminFromHeaders } from "../../common/getAdminFromHeaders";
import { GetAdminByIdQuery } from "../../common/sdk";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  const { headers } = event;
  let admin: GetAdminByIdQuery;
  try {
    admin = await getAdminFromHeaders(headers);
  } catch (error) {
    return JSON.parse(error.message);
  }

  if (!admin.admin_by_pk?.id) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: "Forbidden" }),
    };
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const publicId = `menu-${timestamp}`;
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder: "menu",
      public_id: publicId,
    },
    process.env.API_SECRET!
  );
  return {
    statusCode: 200,
    body: JSON.stringify({
      signature,
      apiKey: process.env.API_KEY,
      timestamp,
      cloudName: process.env.CLOUD_NAME,
      publicId: publicId,
    }),
  };
};

export { handler };
