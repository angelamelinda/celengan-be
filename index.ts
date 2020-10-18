import express from "express";
import morgan from "morgan";
import cors from "cors";

require("dotenv").config();

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("./src/routes/index.routes"));

app.get("/", (_, res) => {
    res.json({ message: "Hello world" });
});

// Starting server
app.listen("1337");
