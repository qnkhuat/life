import { firestore } from "../../lib/firebase/server";
import { cors, runMiddleware } from "../../lib/util";

const getAllUsernames= async (req, res) => {
  try {
    const isPrivate = req.query.private || false; // include private?
    const snapshot = await firestore.collection("user").get();
    var usernames = [];

    snapshot.forEach((doc) => {
      if (doc.data().private && !isPrivate) return;
      usernames.push(doc.data().username);
    });
    return res.status(200).send(usernames);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

export default async (req, res) => {
  await runMiddleware(req, res, cors);
  switch (req.method){
    case "GET":
      await getAllUsernames(req, res);
      break;
    default:
      res.status(405).json({ message: 'Method Not Allowed' });
  }
}
