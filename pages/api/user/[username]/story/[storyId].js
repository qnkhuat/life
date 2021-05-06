import { db } from "../../../../../lib/db";
import isAuthenticated from "../../../../../lib/auth/middleware";
import { runMiddleware } from "../../../../../lib/util";

const getStory = async (req, res) => {
  db.collection("user").doc(req.query.username).collection("story").doc(req.query.storyId).get().then(( doc ) => {
    if (doc.exists) return res.status(200).send(doc.data());
    else return res.status(404).send({error: "Story not found"});
  }).catch(( error ) => {
    return res.status(500).send({ error: error.message });
  });
}

const updateStory = async (req, res) => {
  req.body['lastModifiedDate'] = new Date().toISOString();
  console.log(req.body);
  db.collection("user").doc(req.query.username).collection("story").doc(req.query.storyId).update(req.body).then(( doc ) => {
    return res.status(200).send(req.body);
  }).catch(( error ) => {
    return res.status(500).send({ error: error.message });
  });

}


export default async (req, res) => {
  switch (req.method){
    case "GET":
      await getStory(req, res);
      break;
    case "PATCH":
      await updateStory(req, res);
      break;

    default:
      res.status(405).json({ message: 'Method Not Allowed' });
  }
}
