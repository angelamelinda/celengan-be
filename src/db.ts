import mongoose from "mongoose";

const dbConnectionUrl = `${process.env.MONGODB_CONN_STRING}`;
mongoose.set("debug", true);

//Set up default mongoose connection
mongoose.connect(dbConnectionUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.on("connected", console.error.bind(console, "MongoDB connected:"));

export default db;
