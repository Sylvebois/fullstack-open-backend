const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Password needed !");
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://root:${password}@openclassrooms.isfx1.mongodb.net/Fullstack-open?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
  Person.find({}).then(persons => {
    console.log('Phonebook:');
    persons.forEach(person => console.log(`${person.name} ${person.number}`));
    mongoose.connection.close();
  });
}
else if (process.argv.length >= 5) {
  const newPerson = new Person({
    name: process.argv[3],
    number: process.argv[4]
  });
  newPerson.save().then(result => {
    console.log(`Added ${result.name} ${result.number} to phonebook`);
    mongoose.connection.close();
  });
}
else {
  console.log("Missing an argument (name or number) to add a person to the phonebook");
  mongoose.connection.close();
}