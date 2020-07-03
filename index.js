require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

const app = express()

morgan.token('data', req => JSON.stringify(req.body))

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))


app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(query => {
      res.json(query)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person)
        res.json(person)
      else
        res.status(404).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = { number: body.number }

  const opts = {
    new: true,
    runValidators: true
  }

  Person.findByIdAndUpdate(req.params.id, person, opts)
    .then(updatedPerson => res.json(updatedPerson))
    .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
  Person.find({})
    .then(query => {
      const lenInfo = `<p>Phonebook has info for ${ query.length } people<p>`
      const timeInfo = `<p>${ new Date() }<p>`
      res.send(`${ lenInfo }${ timeInfo }`)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted parameters' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})