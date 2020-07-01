const express = require('express')
const { response } = require('express')

const app = express()

app.use(express.json())
app.use((request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
})

let persons = [
  {
    id: 0,
    name: "Teemu Mahanne",
    number: "040-123123"
  },
  {
    id: 1,
    name: "John Smith",
    number: "040-234234"
  },
  {
    id: 2,
    name: "David Brown",
    number: "12-23-34-456"
  },
  {
    id: 3,
    name: "Leeroy Jenkins",
    number: "024-680-86420"
  },
]

const generateId = () => {
  return Math.floor(Math.random() * 100000)
}

app.get('/api/persons', (req, res) => {
  res.json(persons)
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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})