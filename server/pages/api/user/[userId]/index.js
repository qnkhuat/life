import { firestore, storageGetUrl } from "../../../../lib/firebase/server";
import isAuthenticated from "../../../../lib/firebase/middleware";
import { cors, runMiddleware, createValidator } from "../../../../lib/util";
import * as yup from "yup";
import * as config from "../../../../config";

// *** Schemes
const QueryScheme = yup.object({
  userId: yup.string().required()
});

const UpdateBodyUserScheme = yup.object({
  username: yup.string().required().matches(config.usernameRegex),
  fullname: yup.string().required(),
  maxAge: yup.number().required(),
  avatar: yup.string().nullable().defined(),
  about: yup.string().nullable().defined(),
  private: yup.boolean().nullable(),
  birthday: yup.date().required(),
});

// *** Handlers
const getUser = async (req, res) => {
  try {
    const user = await firestore.collection("user").doc(req.query.userId).get();
    if (user.exists) {
      const data = user.data();
      if (data.avatar) data.avatar = await storageGetUrl(data.avatar);
      return res.status(200).send({id: req.query.userId, user: data});
    } else {
      return res.status(404).send({error: "User not found"});
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

const updateUser = async (req, res) => {
  const usernameDoc = await firestore.collection("user").where("username", "==", req.body.username).get();
  if (usernameDoc.docs.length > 0){
    let isCurrentUser = false;
    for (let i in usernameDoc.docs){
      if (usernameDoc.docs[i].id == req.query.userId){
        isCurrentUser = true;
        break;
      }
    }
    if (!isCurrentUser) return res.status(400).send({ error: "Username existed"});
  }

  req.body['lastModifiedDate'] = new Date().toISOString();
  firestore.collection("user").doc(req.query.userId).update(req.body).then(( doc ) => {
    return res.status(200).send(req.body);
  }).catch(( error ) => {
    return res.status(500).send({ error: error.message });
  });
}

export default async (req, res) => {
  await runMiddleware(req, res, cors);
  await runMiddleware(req, res, createValidator(QueryScheme, "query"));
  switch (req.method){
    case "GET":
      await getUser(req, res);
      break;
    case "PATCH":
      await runMiddleware(req, res, isAuthenticated)
      await runMiddleware(req, res, createValidator(UpdateBodyUserScheme, "body"));
      await updateUser(req, res);
      break;
    default:
      res.status(405).json({ message: 'Method Not Allowed' });
  }
}
