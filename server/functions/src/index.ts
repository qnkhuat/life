import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as cert from "./credential.json";
import { Request, Response } from 'express'

// set up firebase
admin.initializeApp({
    credential: admin.credential.cert(cert),
    databaseURL: "https://life-61d15.firebaseio.com"
})
admin.firestore().settings({ timestampsInSnapshots: true })
const db = admin.firestore();


// setup expressjs
const app: express.Application = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/ping", (req: Request, res: Response) => {
    return res.status(200).send( new Date() );
})


// routes
app.post("/api/create", async (req: Request, res: Response) => {
    try {
        await db.collection('items').doc('/' + req.body.id + '/')
            .create({item: req.body.item});
        return res.status(200).send();
    } catch (error) {
        console.log(error);
        return res.status(500.send(error));
    }
})


export const api = functions.https.onRequest(app);
