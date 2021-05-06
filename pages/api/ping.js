import admin from "firebase-admin";

export default async function handler(req, res){
  res.status(200).send(new Date());
}
