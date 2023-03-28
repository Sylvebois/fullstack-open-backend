const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGOURL)
  .then(result => console.log('Connected to MongoDB'))
  .catch(error => console.log(`Unable to connect: ${error.message}`));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (entry) => /^\d{2,3}-\d{5,}$/.test(entry),
      message: props => `${props.value} is not a valid phone number!`
    },
    required: true
  }
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Person', personSchema);