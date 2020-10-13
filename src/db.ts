import { MongoClient } from 'mongodb';

const dbConnectionUrl = `mongodb+srv://${process.env.MONGODB_USERNAME}:<${encodeURIComponent(process.env.MONGODB_PASSWORD as string)}>@cluster0.shhxs.mongodb.net/<${encodeURIComponent(process.env.MONGODB_NAME as string)}>?retryWrites=true&w=majority`

const initialize = (
    dbName: string,
    dbCollectionName: string,
    successCallback: (dbCollection: any) => void,
    failureCallback: (err: any) => void
) => {

    MongoClient.connect(dbConnectionUrl, { useUnifiedTopology: true }).then((client) => {
        const db = client.db(process.env.MONGODB_NAME)
    }).catch((err) => {
        failureCallback(err);
    })
    MongoClient.connect(dbConnectionUrl, (err, dbInstance) => {
        if (err) {
            console.log(`[MongoDB connection] ERROR: ${err}`);
            failureCallback(err);
        } else {
            const dbObject = dbInstance.db(dbName);
            const dbCollection = dbObject.collection(dbCollectionName);
            console.log("[MongoDB connection] SUCCESS");

            successCallback(dbCollection);
        }
    });
}

export default initialize;