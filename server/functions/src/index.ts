import * as functions from "firebase-functions";
//import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";


const app: express.Application = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/ping", (req, res) => {
    return res.status(200).send( new Date() );
})

export const api = functions.https.onRequest(app);
