import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/LinkedIn_Notifyer";

class MongoDBConnection {
  private static instance: MongoDBConnection;
  private isConnected = false;

  private constructor() {
  }

  public static getInstance(): MongoDBConnection {
    if (!MongoDBConnection.instance) {
      MongoDBConnection.instance = new MongoDBConnection();
    }
    return MongoDBConnection.instance;
  }

  public async connect() {
    if (this.isConnected || mongoose.connection.readyState >= 1) {
      console.log("Using existing MongoDB connection.");
      return;
    }

    try {
      const db = await mongoose.connect(MONGO_URI);
      this.isConnected = true;
      const dbName = db.connections[0].name;
      console.log(`Connected To Mongo! Database Name: ${dbName}`);
    } catch (err) {
      console.error("Error connecting to MongoDB: ", err);
      throw err;
    }
  }
}


export const connectToMongo = MongoDBConnection.getInstance();
