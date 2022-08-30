const { response } = require("express");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const morganSetPostToken = (persons1) => {
  morgan.token("post", (req, res) => {
    const body = req.body;

    if (!req.body.name || !req.body.number) {
      // console.log("if", body.name, body.number);
      return;
    } else {
      // console.log("else", body.name, body.number);
      return JSON.stringify({ name: req.body.name, number: req.body.number });
    }
  });
};

morgan.token("post", (req, res) => {
  return;
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :post")
);

// parses incoming JSON requests and puts the parsed data in the request.body
app.use(express.json());
// enable cross origin resource using from frontend to backend
app.use(cors());
app.use(express.static("build"));

const Phonebook = require("./model/phonebook");
// using Morgan to set a token functionality for the middleware to work

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  // res.json(persons);
  Phonebook.find({}).then((person) => {
    res.json(person);
  });
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;

  Phonebook.findById(id).then((person) => {
    if (person) res.json(person);
    else {
      res.statusMessage = `person with id ${id} can't be found`;
      res.status(404).end;
    }
  });
});

// shows info for the phonebook database
app.get("/info", (req, res, next) => {
  Phonebook.countDocuments({})
    .then((result) => {
      console.log(result);

      res.send(
        `<div>Phone book has info for ${result} people</div> <div>${new Date().toString()}</div>`
      );
    })
    .catch((err) => {
      next(err);
    });
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Phonebook.findByIdAndRemove(id)
    .then((person) => {
      if (person) {
        return res.status(204).json(person);
      } else {
        return res.status(404).send({ error: `can't find person id: ${id}` });
      }
    })
    .catch((err) => {
      next(err);
    });
});

const getRandomInt = (minimum, maximum) => {
  const min = Math.ceil(minimum);
  const max = Math.floor(maximum);
  // console.log(min, max);
  // The +min makes it so that the value is at least mininum value
  const result = Math.floor(Math.random() * (max - min) + min);
  // console.log(result);
  return result;
};

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  morganSetPostToken(
    Phonebook.find({}).then((people) => {
      return people;
    })
  );

  if (!body.name || !body.number) {
    return res.status(404).json({
      status: 404,
      message: "name or number in the request is missing",
    });
  }

  const person = new Phonebook({
    // id: getRandomInt(0, Number.MAX_SAFE_INTEGER),
    name: body.name,
    number: body.number,
  });
  person
    .save()
    .then((p) => {
      res.json(p);
    })
    .catch((error) => {
      next(error);
    });
});

app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  const body = req.body;

  const person = { name: body.name, number: body.number };

  Phonebook.findByIdAndUpdate(id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((p) => {
      console.log(p);
      res.status(204).send(p);
    })
    .catch((error) => {
      next(error);
    });
});

const errorHandler = (error, request, response, next) => {
  console.log(error.name);
  if (error.name === "CastError") {
    return response
      .status(400)
      .send({ error: `malformatted ID error: ${error.message}` });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("listening on port 3001");
});
