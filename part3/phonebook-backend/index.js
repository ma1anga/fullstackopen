require('dotenv').config()

const express = require('express')
const morgan = require('morgan')

const Person = require('./model/person')

const app = express()

app.use(express.json())
app.use(express.static('dist'))

morgan.token('post-data', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.number || !body.name) {
    return response.status(400).json({
      error: 'name and/or number field(s) missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { number } = request.body
  const { id } = request.params

  Person.findById(id).then(personToUpdate => {
    if (!personToUpdate) {
      response.status(404).end()
    }

    personToUpdate.number = number

    personToUpdate.save().then(updatedPerson => {
      response.json(updatedPerson)
    }).catch(error => next(error))
  }).catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findById(id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const { id } = request.params

  Person.findByIdAndDelete(id).then(deletedPerson => {
    if (deletedPerson) {
      response.json(deletedPerson)
    } else {
      response.status(204).end()
    }
  }).catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  const receivedDateTime = new Date()

  Person.countDocuments().then(total => {
    response.send(`
      <p>Phonebook has info for ${total} people</p>
      <p>${receivedDateTime}</p>
  `)
  }).catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

// This has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})