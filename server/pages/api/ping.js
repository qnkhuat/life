import {runMiddleware, cors} from "../../lib/util";
export default async function handler(req, res){
  await runMiddleware(req, res, cors);
  res.status(200).send(new Date());
}
