/**
 * REMEMBER TO ADD ENVIRONTMENT VAIRABLEES TO HEROKU
 * VIA:
 * DASHBOARD Or
 * heroku config:set MONGODB_URI='mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority'
 * heroku config:set PORT=''
 */

require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(express.static("build"));

const requestLogger = (request, response, next) => {
  console.log("Method: ", request.method);
  console.log("Path: ", request.path);
  console.log("Body: ", request.body);
  console.log("---");
  next();
};

app.use(requestLogger);
app.use(cors());
// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: "unknown endpoint" });
// };

// app.use(unknownEndpoint);

// MongoDB database: mongodb+srv://tgo:<password>@fullstackopen-tony.3qsjiry.mongodb.net/?retryWrites=true&w=majority

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2022-05-30T17:30:31.098Z",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2022-05-30T18:39:34.091Z",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2022-05-30T19:20:14.298Z",
    important: true,
  },
];

const Note = require("./models/note");
app.get("/", (request, response) => {
  response.send("<h1>Hello world!!!</h1>");
});

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

app.get("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  console.log(id);
  Note.findById(id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.statusMessage = `resource note with id ${id} can't be found`;
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      response.status(500).end();
    });
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);
  console.log(notes);
  response.status(204).end();
});

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/notes", (request, response) => {
  // request.body has the supposed new json request object note that needs to be added using post
  const body = request.body;

  if (body.content === undefined) {
    return response.status(400).json({ error: "content missing" });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  note.save().then((savedNote) => {
    response.json(savedNote);
  });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
