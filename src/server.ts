import "core-js/stable";
import "regenerator-runtime/runtime";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import serverless from 'serverless-http';

require("dotenv").config();

const app = express();

const corsOptions = {
    origin: process.env.ORIGIN_CORS,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("./routes/index.routes"));

app.get("/.netlify/functions/server/", (_, res) => {
    res.json({ message: "Hello world" });
});

// Starting server
app.listen("1337");

module.exports = app;
module.exports.handler = serverless(app);