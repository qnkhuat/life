import { firestore } from "../../lib/firebase/server";

const getAllStories = async (req, res) => {
  try {
    const snapshot = await firestore.collection("user").get();
    var usernames = [];

    snapshot.forEach((doc) => {
      usernames.push(doc.id);
    })
    return res.status(200).send(usernames);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

export default async (req, res) => {
  switch (req.method){
    case "GET":
      await getAllStories(req, res);
      break;
    default:
      res.status(405).json({ message: 'Method Not Allowed' });
  }
}
