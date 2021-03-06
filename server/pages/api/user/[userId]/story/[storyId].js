import { firestore, storageGetUrl } from "../../../../../lib/firebase/server";
import isAuthenticated from "../../../../../lib/firebase/middleware";
import { cors, runMiddleware, createValidator } from "../../../../../lib/util";
import * as yup from "yup";

// *** Schemes
const QueryScheme = yup.object({
  userId: yup.string().required(),
  storyId: yup.string().required()
});

const UpdateStoryScheme = yup.object({
  title: yup.string(),
  description: yup.string().nullable(),
  date: yup.date(),
  imageUrls: yup.array(yup.string()).nullable(),
  publish: yup.boolean(),
  type: yup.string(),
})

// *** Handlers
const getStory = async (req, res) => {
  try {
    const story = await firestore.collection("user").doc(req.query.userId).collection("story").doc(req.query.storyId).get();
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
  firestore.collection("user").doc(req.query.userId).collection("story").doc(req.query.storyId).update(req.body).then(( doc ) => {
    return res.status(200).send(req.body);
  }).catch(( error ) => {
    return res.status(500).send({ error: error.message });
  });
}

const deleteStory = async (req, res) => {
  firestore.collection("user").doc(req.query.userId).collection("story").doc(req.query.storyId).delete().then(() => {
    return res.status(200).send({ message: "success" });
  }).catch(( error ) => {
    return res.status(500).send({ error: error.message });
  });
}

export default async (req, res) => {
  await runMiddleware(req, res, cors);
  await runMiddleware(req, res, createValidator(QueryScheme, "query"));
  switch (req.method){
    case "GET":
      await getStory(req, res);
      break;

    case "PATCH":
      await runMiddleware(req, res, isAuthenticated);
      await runMiddleware(req, res, createValidator(UpdateStoryScheme, "body"));
      await updateStory(req, res);
      break;

    case "DELETE":
      await runMiddleware(req, res, isAuthenticated);
      await deleteStory(req, res);
      break;


    default:
      res.status(405).json({ message: 'Method Not Allowed' });
  }
}
