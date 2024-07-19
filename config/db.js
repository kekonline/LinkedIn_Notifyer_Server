const mongoose = require("mongoose");

const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/LinkedIn_Notifyer";

const connectToMongo = async () => {
  try {
    const x = await mongoose.connect(MONGO_URI);
    const dbName = x.connections[0].name;
    console.log(
      `\nConnected To Mongo! Database Name:  \x1b[1m\x1b[34m${dbName}\x1b[0m`
    );
  } catch (err) {
    console.error("Error connecting to mongo: ", err);
  }
};

// Call the function to connect
connectToMongo();

module.exports = connectToMongo;