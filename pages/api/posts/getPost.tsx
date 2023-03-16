import type { NextApiRequest, NextApiResponse } from "next";
import client from "../../../prisma/client";

type Data = {
  name: string;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    //Fetch all post
    try {
      const result = await client.post.findMany({
        include: {
          user: true,
          Comment: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      res.status(200).json(result);
    } catch (error) {
      res.status(403).json({ error: "Error has occured while Fetching Post" });
    }
  }
}
