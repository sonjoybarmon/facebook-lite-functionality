const mongoose = require("mongoose");
const dbUri = process.env.MONGO_CONNECTION_STRING;

if (!dbUri) {
  console.error("Mongo url not set in env file");
  return new Error("Mongo url not set in env file");
}

mongoose.connect(
  dbUri,
  {
    useNewUrlParser: true,
    useFindAndModify: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.error(`failed to connect using mongoose ${err}`);
    } else {
      console.log(`database connection successfully done!`);
    }
  }
);

module.exports = mongoose;
