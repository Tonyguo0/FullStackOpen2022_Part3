const { response } = require("express");
const express = require("express");
const app = express();
// parses incoming JSON requests and puts the parsed data in the request.body
app.use(express.json());

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
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const personObj = persons.find((person) => person.id === id);
  if (personObj) res.json(personObj);
  else {
    res.statusMessage = `person with id ${id} cannot be found`;
    res.status(404).end();
  }
});

app.get("/info", (req, res) => {
  res.send(
    `<div>Phone book has info for ${
      persons.length
    } people</div> <div>${new Date().toString()}</div>`
  );
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

const getRandomInt = (minimum, maximum) => {
  const min = Math.ceil(minimum);
  const max = Math.floor(maximum);
  console.log(min, max);
  // The +min makes it so that the value is at least mininum value
  const result = Math.floor(Math.random() * (max - min) + min);
  console.log(result);
  return result;
};

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(404).json({ status: 404, message:"name or number in the request is missing"});
  }

  if (persons.find((p) => p.name === body.name)) {
    return res.status(409).json({ status:409, message:"cannot add the same name again"});
  }

  const person = {
    id: getRandomInt(0, Number.MAX_SAFE_INTEGER),
    name: body.name,
    number: body.number,
  };

  persons = [...persons, person];
  res.status(204).json(person);
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log("listening on port 3001");
});
