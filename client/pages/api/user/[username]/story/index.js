import { db } from "../../../../../lib/db";
import isAuthenticated from "../../../../../lib/auth/middleware";
import { runMiddleware } from "../../../../../lib/util";

const createStory = async (req, res) => {
  req.body['addedDate'] = new Date().toISOString();
  db.collection("user").doc(req.query.username).collection("story").add(req.body).then((doc) => {
    return res.status(200).send({id: doc.id});
  }).catch(( error ) => {
    return res.status(500).send({ error: error.details });
  })
}

export default async (req, res) => {
  switch (req.method){
    case "POST":
      await runMiddleware(req, res, isAuthenticated);
      await createStory(req, res);
      break;
    default:
      res.status(405).json({ message: 'Method Not Allowed' });
  }
}
