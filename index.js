const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express ()
const cors = require('cors')
const Person = require('./models/persons')
require('dotenv').config()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan('tiny'))

app.get('/info', (req, res) => {
  Persons.find({}).then(persons => {
    res.send(
    `<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p> ` )
  })
})

app.get('/', (req, res) => {
  res.send('<h1>Puhelinluettelo!</h1>')
})

app.get('/api/persons', (req, res) => {
  Persons.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
  })
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

app.use(logger)

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const person = new Persons({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then(savedPerson => savedPerson.toJSON())
    .then(savedAndformattedPerson => {
      res.json(savedAndformattedPerson)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Persons.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person.toJSON())
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Persons.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})