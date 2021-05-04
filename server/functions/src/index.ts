import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
//import * as Joi from "joi";
//import * as cookieParser from "cookie-parser";
import { Request, Response } from 'express';
import * as cert from "./credential.json";

const serviceAccount = cert as admin.ServiceAccount

// *** Validation middleware
// TODO: check to see if we can use typescript interface instead? https://stackoverflow.com/a/39146325
//type RequestProperty = "params" | "body" | "query";
//const validator = (schema: any, property: RequestProperty): Function => {
//  // https://dev.to/itnext/joi-awesome-code-validation-for-node-js-and-express-35pk
//  return (req: Request, res: Response, next: Function) => {
//    const { error } = schema.validate(req[property]);
//    const valid = error == null;
//    if ( valid ) { next(); }
//    else {
//      const { details } = error;
//      const message = details.map((i: any) => i.message).join(',');
//      console.log("error", message);
//      res.status(422).json({ error: message });
//    }
//  }
//}
//
//// *** Schemas
//const ItemSchema = Joi.object().keys({
//  id: Joi.number().required(),
//  item: Joi.object().keys({
//    description: Joi.string(),
//  }).required(),
//})

// *** Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mylife-stories.firebaseio.com"
})
admin.firestore().settings({ timestampsInSnapshots: true })
var db = admin.firestore();

export interface IGetUserAuthInfoRequest extends Request {
  user?: admin.auth.DecodedIdToken// or any other type
}

// *** Auth
const isAuthenticated = async (req: IGetUserAuthInfoRequest, res: Response, next: Function): Promise<void> => {
  // https://github.com/firebase/functions-samples/blob/master/authorized-https-endpoint/functions/index.js
  if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
      !(req.cookies && req.cookies.__session)) {
    functions.logger.error(
      'No Firebase ID token was passed as a Bearer token in the Authorization header.',
      'Make sure you authorize your request by providing the following HTTP header:',
      'Authorization: Bearer <Firebase ID Token>',
      'or by passing a "__session" cookie.'
    );
    res.status(403).send('Unauthorized');
    return;
  }

  let idToken;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    functions.logger.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else if(req.cookies) {
    functions.logger.log('Found "__session" cookie');
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  } else {
    // No cookie
    res.status(403).send('Unauthorized');
    return;
  }

  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    functions.logger.log('ID Token correctly decoded', decodedIdToken);
    req.user = decodedIdToken;
    next();
    return;
  } catch (error) {
    functions.logger.error('Error while verifying Firebase ID token:', error);
    res.status(403).send('Unauthorized');
    return;
  }
};


// *** Expressjs
const app: express.Application = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



// *** Routes
app.get("/ping", (req: Request, res: Response) => {
  return res.status(200).send( new Date() );
})

app.post("/api/create", isAuthenticated, async (req: Request, res: Response) => {
  try {
    await db.collection('items').doc('/' + req.body.id + '/')
      .create({item: req.body.item});
    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
})


//POST story
//POST stories
//GET story
//GET stories
//UPDATE story
//UPDATE stories
//POST user
//UPDATE uesr

export const api = functions.https.onRequest(app);
