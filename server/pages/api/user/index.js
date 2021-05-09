import { firestore, storageGetUrl } from "../../../lib/firebase/server";
import isAuthenticated from "../../../lib/firebase/middleware";
import { cors, runMiddleware } from "../../../lib/util";

const addUser = async (req, res) => {
  const userDocRef = firestore.collection("user").doc(req.body.username);
  userDocRef.get().then(( doc ) => {
    if (doc.exists) return res.status(409).send({ error: "User existed" });

    req.body.user['username'] = req.body.username;
    req.body.user['addedDate'] = new Date().toISOString();
    userDocRef.set(req.body.user).then(( doc ) => {
      return res.status(200).send({ id: userDocRef.id});
    }).catch(( error ) => {
      return res.status(500).send({ error: error.message });
    })
  })
}

export const findUserByEmailResult = async (email) => {
  firestore.collection("user").where("email", "==", email).get().then( ( snapShot ) => {
    if (snapShot.size == 0 ) return { message: "User not found" };
    else if (snapShot.size == 1) return snapShot.docs[0].data(); 
    else return { message: "Exists multiple users with 1 email" };
  }).catch(( error ) => {
    console.log("Error cmnr");
    return;
  })
}

const findUserByEmail = async (req, res) => {
    const snapshot = await firestore.collection("user").where("email", "==", req.query.email).get();
    if (snapshot.docs.length == 1) {
      const user = snapshot.docs[0].data();
      if (user.avatar) user.avatar = await storageGetUrl(user.avatar);
      return res.status(200).send(user);
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
