import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "@/lib/mongodb";

export const getAppProps = async (context) => {
  const userSession = await getSession(context.req, context.res);
  const client = await clientPromise;
  const db = await client.db("ai-blog");
  const users = await db.collection("users").findOne({
    auth0Id: userSession.user.sub,
  });

  if (!users) {
    return {
      availableToken: 10,
      posts: [],
    };
  }

  const posts = await db
    .collection("posts")
    .find({
      userId: users._id,
    })
    .limit(5)
    .sort({
      createdAt: -1,
    })
    .toArray();

  return {
    availableToken: users.availableToken,
    posts: posts.map(({ createdAt, _id, userId, ...rest }) => ({
      _id: _id.toString(),
      createdAt: createdAt.toString(),
      ...rest,
    })),
    postId: context.params?.postId || null,
  };
};
