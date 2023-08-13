import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import clientPromise from "@/lib/mongodb";

export default withApiAuthRequired(async function getPosts(req, res) {
  try {
    const {
      user: { sub },
    } = await getSession(req, res);
    const client = await clientPromise;
    const db = await client.db("ai-blog");
    const userProfile = await db.collection("users").findOne({
      auth0Id: sub,
    });

    const { lastPostDate } = req.body;

    const posts = await db
      .collection("posts")
      .find({
        userId: userProfile._id,
        createdAt: {
          $lt: new Date(lastPostDate),
        },
      })
      .limit(5)
      .sort({
        createdAt: -1,
      })
      .toArray();

    res.status(200).json({ posts });
    return;
  } catch (error) {}
});
