const express = require('express');
const morgan = require('morgan');
const server = express();

let data = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
];

const generateId = () => {
  let id = Math.floor(Math.random() * 9999999);

  while (data.find(entry => entry.id === id)) {
    id = Math.floor(Math.random() * 9999999);
  }

  return id;
}

morgan.token('body', (request, response) => request.method === 'POST' ? JSON.stringify(request.body) : ' ');

server.use(express.static('build'));
server.use(express.json());
server.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

server.get('/info', (request, response) => response.send(
  `<p>Phonebook has info for ${data.length} people.</p><p>${new Date()}</p>`
))

server.get('/api/persons', (request, response) => response.json(data));

server.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = data.find(entry => entry.id === id);

  person ?
    response.json(person) :
    response.status(404).end();
})

server.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.number) {
    response.status(400).json({ error: "number missing !" });
  }
  else if (!body.name) {
    response.status(400).json({ error: "name missing !" });
  }
  else if (data.find(entry => entry.name === body.name)) {
    response.status(400).json({ error: "name must be unique !" });
  }
  else {
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number,
    }

    data = data.concat(person);
    response.status(201).json(person);
  }
});

server.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  data = data.filter(entry => entry.id !== id);

  response.status(204).end();
})

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server started at port ${PORT}`));