const mongoose = require("mongoose");
const dotenv = require("dotenv-defaults");
dotenv.config();

if (!process.env.MONGO_URL) {
  console.error("Missing MONGO_URL!!!");
  process.exit(1);
}

function connectMongo() {
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  const db = mongoose.connection;

  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function () {
    console.log("mongo connected!");
  });
}

const mongo = {
  connect: connectMongo,
};

module.exports = mongo;
