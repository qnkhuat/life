import { firestore, storageGetUrl } from "../../lib/firebase/server";
import { cors, runMiddleware } from "../../lib/util";

const getUsers = async (req, res) => {
  try {
    const snapshot = await firestore.collection("user").limit(20).get();
    var users = {};
    for (let i in snapshot.docs){
      const doc = snapshot.docs[i];
      const user = doc.data();
      user.avatar= await storageGetUrl(user.avatar);
      users[doc.id] = user;
    }
    return res.status(200).send(users);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

export default async (req, res) => {
  await runMiddleware(req, res, cors);
  switch (req.method){
    case "GET":
      await getUsers(req, res);
      break;
    default:
      res.status(405).json({ message: 'Method Not Allowed' });
  }
}
