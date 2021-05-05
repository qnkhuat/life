import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as yup from "yup";
//import * as cookieParser from "cookie-parser";
import { Request, Response } from 'express';
import * as cert from "./credential.json";
import * as dayjs from "dayjs";
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const serviceAccount = cert as admin.ServiceAccount

// *** Validation middleware
type RequestProperty = "params" | "body" | "query";
type CallbackFunction = (req: Request, res: Response, next: Function) => void;
const validator = (schema: yup.AnySchema, property: RequestProperty): CallbackFunction => {
  return async (req: Request, res: Response, next: Function) => {
    schema.validate(req[property], {strict: false, abortEarly: false}).then((value) => {
      next();
    }).catch((error: yup.ValidationError) => {
      res.status(422).send({error: error?.errors.join(". ")});
    })
  }
}

// *** Schemas

const StoryTypes = ["birthday", "career", "travel", "experience", "achievement", "memory", "family"];
const StoryCreateSchema: yup.AnySchema  = yup.object({
  publish: yup.boolean().required(),
  date: yup.date().required(), // ISO  
  title:  yup.string().required(),
  content: yup.string().defined(),
  imageUrls: yup.array(yup.string()).min(0).defined(),
  videoUrls: yup.array(yup.string()).min(0).defined(),
  type: yup.mixed().oneOf(StoryTypes).required(),
})

const StoryUpdateSchema: yup.AnySchema  = yup.object({
  publish: yup.boolean(),
  date: yup.date(), // ISO  
  title:  yup.string(),
  content: yup.string(),
  imageUrls: yup.array(yup.string()).min(0),
  videoUrls: yup.array(yup.string()).min(0),
  type: yup.mixed().oneOf(StoryTypes),
})


const UserSchema: yup.AnySchema = yup.object({
  birthday: yup.date().required(),
  maxAge: yup.number().required(),
})

const UserUpdateSchema: yup.AnySchema = yup.object({
  birthday: yup.date(),
  maxAge: yup.number(),
})


const UserCreateSchema: yup.AnySchema = yup.object({
  username: yup.string().required(),
  user: UserSchema.required(),
})


const UsernameField: yup.AnySchema = yup.object({
  username: yup.string().required()
})

const UserStoryGetScheme: yup.AnySchema = yup.object({
  username: yup.string().required(),
  storyId: yup.string().required()
})




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
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else if (req.cookies) {
    idToken = req.cookies.__session;
  } else {
    res.status(403).send('Unauthorized');
    return;
  }

  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedIdToken;
    next();
    return;
  } catch (error) {
    functions.logger.error('Error while verifying Firebase ID token:', error);
    res.status(403).send('Unauthorized');
    return;
  }
};


// *** Expressjs setting middleware
const app: express.Application = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// *** Routes
app.get("/ping", (req: Request, res: Response) => {
  return res.status(200).send( new Date().toISOString() );
})

app.post("/user", isAuthenticated, validator(UserCreateSchema, "body"), async (req: Request, res: Response) => {
  var userDocRef = db.collection("user").doc(req.body.username);
  userDocRef.get().then(( doc ) => {
    if (doc.exists) return res.status(409).send({ error: "User existed" });
    req.body.user['addedDate'] = new Date();
    userDocRef.set(req.body.user).then(( doc ) => {
      return res.status(200).send({ id: userDocRef.id});
    }).catch(( error ) => {
      return res.status(500).send(error);
    })
    return;
  })
})

app.get("/user/:username", isAuthenticated, validator(UsernameField, "params"), async (req: Request, res: Response) => {
  db.collection("user").doc(req.params.username).get().then(( doc ) => {
    if (doc.exists) return res.status(200).send(doc.data());
    else return res.status(404).send({error: "User not found"});
  }).catch(( error ) => {
    return res.status(500).send(error);
  });
})


app.patch("/user/:username", validator(UsernameField, "params"), validator(UserUpdateSchema, "body"), async (req: Request, res: Response) => {
  req.body['lastModifiedDate'] = new Date();
  db.collection("user").doc(req.params.username).update(req.body).then(( doc ) => {
    return res.status(200).send(req.body);
  }).catch(( error ) => {
    return res.status(500).send(error);
  });
})



app.post("/user/:username/story", validator(UsernameField, "params"), validator(StoryCreateSchema, "body"), async (req: Request, res: Response) => {
  req.body['addedDate'] = new Date();
  db.collection("user").doc(req.params.username).collection("story").add(req.body).then((doc) => {
    return res.status(200).send({id: doc.id});
  }).catch(( error ) => {
    return res.status(500).send({ error: error });
  })
})

app.get("/user/:username/story/:storyId", validator(UserStoryGetScheme, "params"), async (req: Request, res: Response) => {
  db.collection("user").doc(req.params.username).collection("story").doc(req.params.storyId).get().then(( doc ) => {
    if (doc.exists) return res.status(200).send(doc.data());
    else return res.status(404).send({error: "Story not found"});
  }).catch(( error ) => {
    return res.status(500).send(error);
  });
})


app.patch("/user/:username/story/:storyId", validator(StoryUpdateSchema, "params"), async (req: Request, res: Response) => {
  req.body['lastModifiedDate'] = new Date();
  console.log(req.body);
  db.collection("user").doc(req.params.username).collection("story").doc(req.params.storyId).update(req.body).then(( doc ) => {
    return res.status(200).send(req.body);
  }).catch(( error ) => {
    return res.status(500).send(error);
  });
})

app.delete("/user/:username/story/:storyId", validator(UserStoryGetScheme, "params"), async (req: Request, res: Response) => {
  var storyDocRef = db.collection("user").doc(req.params.username).collection("story").doc(req.params.storyId);
  storyDocRef.get().then(( doc ) => {
    if (!doc.exists) return res.status(409).send({ error: "Story not found" });
    storyDocRef.delete().then(( doc ) => {
      return res.status(200).send({ id: storyDocRef.id});
    }).catch(( error ) => {
      return res.status(500).send(error);
    })
    return;
  })
})

app.get("/user/:username/stories", validator(UsernameField, "params"), async (req: Request, res: Response) => {
  db.collection("user").doc(req.params.username).collection("story").get().then(( snapShot ) => {
    var docs: {[key:string]: any} = {};
    snapShot.docs.forEach( (doc) => docs[doc.id] = doc.data() );
    return res.status(200).send(docs);
  }).catch(( error ) => {
    return res.status(500).send(error);
  });
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
