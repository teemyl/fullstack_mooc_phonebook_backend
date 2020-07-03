require('dotenv').config()

const express = require('express')
const { response } = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

const app = express()

morgan.token('data', (req, res) => JSON.stringify(req.body))

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))


app.get('/api/persons', (req, res) => {
  Person.find({}).then(query => {
    res.json(query)
  })
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name)
    return res.status(400).json({ error: 'Name missing'})
  else if (!body.number)
    return res.status(400).json({ error: 'Number missing'})

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
})

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
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

app.get('/info', (req, res) => {
  const lenInfo = `<p>Phonebook has info for ${ persons.length } people<p>`
  const timeInfo = `<p>${ new Date() }<p>`
  res.send(`${ lenInfo }${ timeInfo }`)
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})