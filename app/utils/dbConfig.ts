// app/lib/mongoConnect.ts
import mongoose from "mongoose";

export const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/LinkedIn_Notifyer";

export const connectToMongo = async () => {
  if (mongoose.connection.readyState >= 1) {
    return; // Prevent multiple connections
  }

  try {
    const db = await mongoose.connect(MONGO_URI);
    const dbName = db.connections[0].name;
    console.log(`Connected To Mongo! Database Name: ${dbName}`);
  } catch (err) {
    console.error("Error connecting to MongoDB: ", err);
  }
};
