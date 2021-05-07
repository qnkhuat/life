import { firestore } from "../../../../lib/firebase/server";

const getAllStories = async (req, res) => {
  firestore.collection("user").doc(req.query.username).collection("story").get().then(( snapShot ) => {
    var docs = {};
    snapShot.docs.forEach( (doc) => docs[doc.id] = doc.data() );
    return res.status(200).send(docs);
  }).catch(( error ) => {
    return res.status(500).send({ error: error.message });
  });

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
