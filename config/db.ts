import mongoose from "mongoose";

export const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/LinkedIn_Notifyer";

export const connectToMongo = async () => {
  try {
    const db = await mongoose.connect(MONGO_URI);
    const dbName = db.connections[0].name;
    // console.log(
    //   `\nConnected To Mongo! Database Name:  \x1b[1m\x1b[34m${dbName}\x1b[0m`
    // );
  } catch (err) {
    console.error("Error connecting to mongo: ", err);
  }
};

// Call the function to connect
connectToMongo();
