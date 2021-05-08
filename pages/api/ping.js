import { getUrl } from "../../lib/firebase/server";
export default async function handler(req, res){
  const url = await storageGetUrl("img/qnkhuat/152c2644-466d-40e8-866f-cfb643c7069a.jpg");
  res.status(200).send({url: url});
}
