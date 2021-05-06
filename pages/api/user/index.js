import { db } from "../../../lib/db";
import isAuthenticated from "../../../lib/auth/middleware";
import { runMiddleware } from "../../../lib/util";

const addUser = async (req, res) => {
  const userDocRef = db.collection("user").doc(req.body.username);
  userDocRef.get().then(( doc ) => {
    if (doc.exists) return res.status(409).send({ error: "User existed" });

    req.body.user['addedDate'] = new Date().toISOString();
    userDocRef.set(req.body.user).then(( doc ) => {
      return res.status(200).send({ id: userDocRef.id});
    }).catch(( error ) => {
      return res.status(500).send({ error: error.details });
    })
  })
}

const findUserByEmail = async (req, res) => {
  db.collection("user").where("email", "==", req.query.email).get().then( ( snapShot ) => {
    if (snapShot.size == 0 ) return  res.status(404).send({ message: "User not found" });
    else if (snapShot.size == 1) return res.status(200).send(snapShot.docs[0].data()); 
    else throw new Error("Multiple user with the same email");
  }).catch(( error ) => {
    return res.status(500).send({ error: error});
  })
}

export default async (req, res) => {
  switch (req.method){
    case "GET":
      await findUserByEmail(req, res);
      break;
    case "POST":
      await runMiddleware(req, res, isAuthenticated)
      await addUser(req, res);
      break;
    default:
      res.status(405).json({ message: 'Method Not Allowed' });
  }
}
