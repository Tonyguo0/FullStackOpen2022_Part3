const mongoose = require("mongoose");
// {
//     "name": "Arto Hellas",
//     "number": "040-123456",
//     "id": 1
//   },
//   {
//     "name": "Ada Lovelace",
//     "number": "39-44-5323523",
//     "id": 2
//   },
//   {
//     "name": "Dan Abramov",
//     "number": "12-43-234345",
//     "id": 3
//   },

if (process.argv.length < 3) {
  console.log("Please provide password for the connection");
  return;
} else if (process.argv.length === 4 || process.argv.length > 5) {
  console.log(
    "Please provide either just password or password and name and number"
  );
  return;
}
// console.log("random1");
const password = process.argv[2];
const url = `mongodb+srv://tgo:${password}@fullstackopen-tony.3qsjiry.mongodb.net/Phonebook?retryWrites=true&w=majority`;
// const url = `mongodb://tgo:${password}@ac-qcn4pfb-shard-00-00.3qsjiry.mongodb.net:27017,ac-qcn4pfb-shard-00-01.3qsjiry.mongodb.net:27017,ac-qcn4pfb-shard-00-02.3qsjiry.mongodb.net:27017/Phonebook?ssl=true&replicaSet=atlas-l55oxn-shard-0&authSource=admin&retryWrites=true&w=majority`;
// console.log("random2");

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});
// console.log("random3");

const Phonebook = mongoose.model("person", phonebookSchema);
// console.log("random4");

mongoose.connect(url);
// console.log("random5");

if (process.argv.length === 3) {
  // console.log("random6");

  Phonebook.find({}).then((result) => {
    console.log(`phonebook:`);
    result.forEach((phonebook) => {
      console.log(`${phonebook.name} ${phonebook.number}`);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  console.log(`processes:`, process.argv[3], process.argv[4]);
  let thisname = process.argv[3];
  let thisnumber = process.argv[4];
  console.log(`processes:`, thisnumber, typeof thisnumber);

  //   thisnumber = Number(thisnumber);
  //   console.log(`processes:`, thisnumber, typeof thisnumber);

  const phonebook = new Phonebook({
    name: thisname,
    number: thisnumber,
  });

  phonebook.save().then(() => {
    console.log(`added ${thisname} number ${thisnumber} to phonebook`);
    mongoose.connection.close();
  });
}
