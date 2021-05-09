import { firestore, storageGetUrl } from "../../../../lib/firebase/server";
import { cors, runMiddleware } from "../../../../lib/util";

const getAllStories = async (req, res) => {
  try {
    const snapshot = await firestore.collection("user").doc(req.query.username).collection("story").get();
    var docs = {};

    for (let i in snapshot.docs){
      const doc = snapshot.docs[i];
      const data = doc.data();
      data.imageUrls = await Promise.all(data.imageUrls.map((url) => {
        return storageGetUrl(url);
      }));
      docs[doc.id] = data;
    }
    return res.status(200).send(docs);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

export default async (req, res) => {
  await runMiddleware(req, res, cors);
  switch (req.method){
    case "GET":
      await getAllStories(req, res);
      break;
    default:
      res.status(405).json({ message: 'Method Not Allowed' });
  }
}
