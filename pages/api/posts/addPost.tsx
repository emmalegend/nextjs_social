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
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);
    if (!session)
      return res.status(401).json({ message: "Please sign in to make a Post" });

    const { title } = req.body;
    console.log(title);
    //Get User
    const primsaUser = await client.user.findUnique({
      where: { email: session?.user?.email },
    });
    //add check
    if (title.length > 300) {
      return res.status(403).json({ message: "Please write a shorter post" });
    }
    if (!title.length) {
      return res
        .status(403)
        .json({ message: "Please do not leave this empty" });
    }
    try {
      const result = await client.post.create({
        data: {
          title,
          userId: primsaUser.id,
        },
      });
      res.status(200).json(result);
    } catch (error) {
      res
        .status(403)
        .json({ error: "Error has occured while creating a Post" });
    }
  }
}
