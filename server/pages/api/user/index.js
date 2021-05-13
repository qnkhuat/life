import { firestore, storageGetUrl } from "../../../lib/firebase/server";
import isAuthenticated from "../../../lib/firebase/middleware";
import { cors, runMiddleware, createValidator } from "../../../lib/util";
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import * as yup from "yup";
import * as config from "../../../config";

// *** Schemes
const AddUserScheme = yup.object({
  id: yup.string().required(),
  user: yup.object({
    username: yup.string().required().matches(config.usernameRegex),
    fullname: yup.string().required(),
    maxAge: yup.number().required(),
    avatar: yup.string().defined().nullable(),
    about: yup.string().defined().nullable(),
    private: yup.boolean().default(false),
    birthday: yup.date().required(),
  })
});

const FindUserScheme = yup.object({
  username: yup.string().required()
});


// *** Handlers
const addUser = async (req, res) => {
  const userDocRef = firestore.collection("user").doc(req.body.id);
  userDocRef.get().then(( doc ) => {
    if (doc.exists) return res.status(409).send({ error: "User existed" });
    req.body.user['addedDate'] = new Date().toISOString();
    userDocRef.set(req.body.user).then(( doc ) => {
      return res.status(200).send({ id: userDocRef.id});
    }).catch(( error ) => {
      return res.status(500).send({ error: error.message });
    })
  })
}

const findUserByUsername = async (req, res) => {
  const parsedCookies = parseCookies({ req });
  if (!req.query.username) return res.status(400).send({error: "Must provide username"});
  const snapshot = await firestore.collection("user").where("username", "==", req.query.username).get();
  if (snapshot.docs.length == 1) {
    const doc = snapshot.docs[0];
    const user = doc.data();
    return res.status(200).send({id: doc.id, user: user});
  } else if (snapshot.docs.length > 1){
    return res.status(400).send({error: "Multiple users has the same email"});
  } else {
    return res.status(400).send({error: "User not found"});
  }
}

export default async (req, res) => {
  await runMiddleware(req, res, cors);
  switch (req.method){
    case "GET":
      await runMiddleware(req, res, createValidator(FindUserScheme, "query"));
      await findUserByUsername(req, res);
      break;
    case "POST":
      await runMiddleware(req, res, isAuthenticated);
      await runMiddleware(req, res, createValidator(AddUserScheme, "body"));
      await addUser(req, res);
      break;
    default:
      res.status(405).json({ message: 'Method Not Allowed' });
  }
}
