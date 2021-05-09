import { firestore, storageGetUrl } from "../../../../../lib/firebase/server";
import isAuthenticated from "../../../../../lib/firebase/middleware";
import { cors, runMiddleware } from "../../../../../lib/util";

const getStory = async (req, res) => {
  try {
    const story = await firestore.collection("user").doc(req.query.username).collection("story").doc(req.query.storyId).get();
    if (story.exists) {
      const data = story.data();
      data.imageUrls = await Promise.all(data.imageUrls.map((url) => {
        return storageGetUrl(url);
      }));
      return res.status(200).send(data);
    } else {
      return res.status(404).send({error: "Story not found"});
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

const updateStory = async (req, res) => {
  req.body['lastModifiedDate'] = new Date().toISOString();
  firestore.collection("user").doc(req.query.username).collection("story").doc(req.query.storyId).update(req.body).then(( doc ) => {
    return res.status(200).send(req.body);
  }).catch(( error ) => {
    return res.status(500).send({ error: error.message });
  });
}


export default async (req, res) => {
  await runMiddleware(req, res, cors);
  switch (req.method){
    case "GET":
      await getStory(req, res);
      break;
    case "PATCH":
      await runMiddleware(req, res, isAuthenticated);
      await updateStory(req, res);
      break;

    default:
      res.status(405).json({ message: 'Method Not Allowed' });
  }
}
