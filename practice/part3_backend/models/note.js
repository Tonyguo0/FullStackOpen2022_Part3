const mongoose = require("mongoose");

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
// NO PASSWORD SAVED SO NOT WORKING
// const url = `mongodb+srv://tgo:{password}@fullstackopen-tony.3qsjiry.mongodb.net/noteApp?retryWrites=true&w=majority`;
const url = process.env.MONGODB_URI;

// console.log("connecting to", url);

// `mongodb://tgo:PASSWORD@ac-qcn4pfb-shard-00-00.3qsjiry.mongodb.net:27017,ac-qcn4pfb-shard-00-01.3qsjiry.mongodb.net:27017,ac-qcn4pfb-shard-00-02.3qsjiry.mongodb.net:27017/noteApp?ssl=true&replicaSet=atlas-l55oxn-shard-0&authSource=admin&retryWrites=true&w=majority`

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.log("error connecting to MongoDB:", err.message);
  });

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Note", noteSchema);
