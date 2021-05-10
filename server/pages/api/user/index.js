import { firestore, storageGetUrl } from "../../../lib/firebase/server";
import isAuthenticated from "../../../lib/firebase/middleware";
import { cors, runMiddleware } from "../../../lib/util";
import { parseCookies, setCookie, destroyCookie } from 'nookies';

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
    const snapshot = await firestore.collection("user").where("username", "==", req.query.username).get();
    if (snapshot.docs.length == 1) {
      const doc = snapshot.docs[0];
      const user = doc.data();
      if (user.avatar) user.avatar = await storageGetUrl(user.avatar);
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
      await findUserByUsername(req, res);
      break;
    case "POST":
      await runMiddleware(req, res, isAuthenticated)
      await addUser(req, res);
      break;
    default:
      res.status(405).json({ message: 'Method Not Allowed' });
  }
}
