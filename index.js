require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const errorHandler = require('./middlewares/errorHandler');
const Person = require('./models/person');
const server = express();

morgan.token('body', (request, response) => request.method === 'POST' ? JSON.stringify(request.body) : ' ');

server.use(express.static('build'));
server.use(express.json());
server.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

server.get('/info', (request, response) => Person.estimatedDocumentCount().then(nb =>
  response.send(
    `<p>Phonebook has info for ${nb} people.</p><p>${new Date()}</p>`
  )
));

server.get('/api/persons', (request, response) => {
  Person.find({}).then(data => response.json(data))
});

server.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(data => data ? response.json(data) : response.status(404).end())
    .catch(error => next(error));
})

server.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body;

  Person.countDocuments({ name }).then(nb => {
    if (nb > 0) {
      response.status(400).json({ error: "Name must be unique! Consider updating instead." });
    }
    else {
      const person = new Person({ name, number })
      person.save()
        .then(data => response.status(201).json(data))
        .catch(error => next(error));
    }
  });
});

server.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body;

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedData => response.json(updatedData))
    .catch(error => next(error));
})

server.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(data => response.status(204).end())
    .catch(error => next(error));
})

server.use(errorHandler);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server started at port ${PORT}`));