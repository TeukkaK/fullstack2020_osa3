const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const db = pluettelo 

const url = `mongodb+srv://fullstack:${password}@pluettelo.ofp0w.mongodb.net/${db}?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 4) {
    Person.find({}).then(result => {
      console.log('puhelinluettelo:')
      result.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    })
  } else {
    const person = new Person({
      name: process.argv[3],
      number: process.argv[4],
    })
    person.save().then(() => {
      console.log(`added ${person.name} number ${person.number}`)
      mongoose.connection.close()
    })
}