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

persons = []

const generateId = () => {
  return Math.floor(Math.random() * 100000)
}

app.get('/api/persons', (req, res) => {
  Person.find({}).then(query => {
    persons = persons.concat(query)
    res.json(persons)
  })
})

app.post('/api/persons', (req, res) => {
  const person = req.body

  if (!person.name)
    return res.status(400).json({ error: 'Name missing'})
  else if (!person.number)
    return res.status(400).json({ error: 'Number missing'})
  else if(persons.find(p => p.name === person.name))
    return res.status(400).json({ error: 'Name must be unique'})

  person.id = generateId()
  persons = persons.concat(person)
  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)
  res.status(204).end()
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})