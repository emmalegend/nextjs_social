import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import client from "../../../prisma/client";

type Data = {
  name: string;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const session = await getServerSession(req, res, authOptions);
    if (!session)
      return res.status(401).json({ message: "Please sign in to make a Post" });

    //Get AUTH users post
    try {
      const data = await client.user.findUnique({
        where: { email: session.user?.email || "" },
        include: {
          post: {
            orderBy: {
              createdAt: "desc",
            },
            include: {
              Comment: true,
            },
          },
        },
      });
      res.status(200).json(data);
    } catch (error) {
      res
        .status(403)
        .json({ error: "Error has occured while creating a Post" });
    }
  }
}
