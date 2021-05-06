import axios from "axios";
import {db} from "../db";

// User
const getUser = async ( username ) => {
  db.collection("user").doc(req.params.username).get().then(( doc ) => {
    if (doc.exists) return res.status(200).send(doc.data());
    else return res.status(404).send({error: "User not found"});
  }).catch(( error ) => {
    return res.status(500).send(error);
  });
}

const createUser = async ( user ) => {
  const url = urljoin(process.env.API_URL, `user`);
  try {
    const res = await axios.post(url, user);
    return res;
  } catch (error){
    throw error;
  }
}

const updateUser = async ( user ) => {
  const url = urljoin(process.env.API_URL, `user`);
  try {
    const res = await axios.patch(url, user);
    return res;
  } catch (error){
    throw error;
  }
}


