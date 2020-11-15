const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
require('dotenv').config()
const Persons = require('./models/persons')

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
    res.json(persons.map(persons => persons.toJSON()))
  })
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

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }
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
app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }
  Persons.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON)
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
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})