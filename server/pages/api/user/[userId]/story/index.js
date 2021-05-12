import { firestore } from "../../../../../lib/firebase/server";
import isAuthenticated from "../../../../../lib/firebase/middleware";
import { cors, runMiddleware, createValidator } from "../../../../../lib/util";
import * as yup from "yup";

// *** Schemes
const QueryScheme = yup.object({
  userId: yup.string().required(),
  storyId: yup.string().required()
});

const CreateStoryScheme = yup.object({
  title: yup.string().required(),
  description: yup.string().nullable(),
  date: yup.date().required(),
  imageUrls: yup.array(yup.string()).nullable(),
  publish: yup.boolean().requried(),
  type: yup.string().requried(),
})


// *** Handlers
const createStory = async (req, res) => {
  req.body['addedDate'] = new Date().toISOString();
  firestore.collection("user").doc(req.query.userId).collection("story").add(req.body).then((doc) => {
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
      await runMiddleware(req, res, createValidator(CreateStoryScheme, "body"));
      await createStory(req, res);
      break;
    default:
      res.status(405).json({ message: 'Method Not Allowed' });
  }
}
