import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  const { user } = await getSession(req, res);

  console.log("user", user);
  const client = await clientPromise;
  const db = await client.db("ai-blog");

  const userProfile = await db.collection("users").updateOne(
    {
      auth0Id: user.sub,
    },
    {
      $inc: { availableToken: 10 },
      $setOnInsert: {
        auth0Id: user.sub,
      },
    },
    {
      upsert: true,
    }
  );

  // const existingUser = await db.collection("users").findOne({
  //   auth0Id: user.sub,
  // });

  // let userInfo;

  // if (existingUser) {
  //   userInfo = await db.collection("users").updateOne(
  //     {
  //       auth0Id: user.sub,
  //     },
  //     {
  //       $inc: { availableToken: 10 },
  //     }
  //   );
  // } else {
  //   userInfo = await db.collection("users").insertOne({
  //     auth0Id: user.sub,
  //     availableToken: 10,
  //   });
  // }

  res.status(200).json({ name: "John Doe" });
}
