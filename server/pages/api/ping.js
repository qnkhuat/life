import {runMiddleware} from "../../lib/util";
export default async function handler(req, res){
  res.status(200).send(new Date());
}
