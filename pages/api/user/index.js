import { db } from "../../../lib/db";
import isAuthenticated from "../../../lib/auth/middleware";
import { runMiddleware } from "../../../lib/util";

const addUser = async (req, res) => {
  var userDocRef = db.collection("user").doc(req.body.username);
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

export default async (req, res) => {
  switch (req.method){
    case "POST":
      await runMiddleware(req, res, isAuthenticated)
      await addUser(req, res);
      break;
    default:
      res.status(405).json({ message: 'Method Not Allowed' });
  }
}
