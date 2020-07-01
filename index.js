const express = require('express')
const app = express()
app.use(express.json())

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

app.get('/api/persons', (req, res) => {
  res.json(persons)
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