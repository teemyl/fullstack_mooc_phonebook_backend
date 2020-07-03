const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Not enough arguments, usage: node <app> <password> (<name> <number>)')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${ password }@phonebook.czvhx.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {

  Person.find({}).then(res => {
    console.log('phonebook:')

    res.forEach(p => {
      console.log(`${ p.name } ${ p.number }`)
    })

    mongoose.connection.close()
  })

} else if (process.argv.length === 5) {

  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(() => {
    console.log(`added ${ name } ${ number } to phonebook`)
    mongoose.connection.close()
  })

} else {
  console.log('Nothing to do.')
  mongoose.connection.close()
}




