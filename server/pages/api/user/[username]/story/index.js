import { firestore } from "../../../../../lib/firebase/server";
import isAuthenticated from "../../../../../lib/firebase/middleware";
import { cors, runMiddleware } from "../../../../../lib/util";

const createStory = async (req, res) => {
  req.body['addedDate'] = new Date().toISOString();
  firestore.collection("user").doc(req.query.username).collection("story").add(req.body).then((doc) => {
    return res.status(200).send({ id: doc.id });
  }).catch(( error ) => {
    return res.status(500).send({ error: error.message });
  })
}

export default async (req, res) => {
  await runMiddleware(req, res, cors);
  switch (req.method){
    case "POST":
      await runMiddleware(req, res, isAuthenticated);
      await createStory(req, res);
      break;
    default:
      res.status(405).json({ message: 'Method Not Allowed' });
  }
}
