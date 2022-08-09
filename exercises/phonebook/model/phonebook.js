const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then((result) => {
    console.log("connect to MONGODB!");
  })
  .catch((err) => {
    console.log(`connection to mongoDB failed because of error: ${err}`);
  });

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

// phonebookSchema.virtual("id").get(() => {
//   return this._id.toString();
// });
// get rid of _id and __v field and virtuals enabled automatically serialises the _id to be a id key and string value
phonebookSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, converted) => {
    delete converted._id;
  },
});

module.exports = mongoose.model("person", phonebookSchema);
