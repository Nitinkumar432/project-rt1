const mongoose = require('mongoose');
const Register = require('./models/register_data.js');

// Connection URI
const uri = 'mongodb+srv://nitin_patel:nitinpatel@rozgarsetu.rdcpc.mongodb.net/applicant?retryWrites=true&w=majority&appName=rozgarsetu';

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Define a schema without strict enforcement
const schema = new mongoose.Schema({}, { strict: false });

// Create a model for the existing collection
// const Collection = mongoose.model('Collection', schema, 'registar_data');

// Function to add a new document
const addDocument = async () => {
  try {
    const newDocument = new Register({
      name: 'John Doe',
      fatherName: 'Robert Doe',
      motherName: 'Jane Doe',
      experience: '5 years',
      age: 30,
      gender: 'Male',
      location: 'New York',
      state: 'NY',
      district: 'Manhattan',
      phone: '1234567891',
      password: 'securepassword', // Ensure to hash passwords before saving in production
      employee_id: 'EMP-001'
  });
    const result = await newDocument.save();
    console.log('New Document Added:', result);
  } catch (err) {
    console.error('Error adding new document', err);
  }
};

// Function to find all documents
const findDocuments = async () => {
  try {
    const documents = await Register.find();
    console.log('Documents Found:', documents);
  } catch (err) {
    console.error('Error finding documents', err);
  }
};


// Run examples
addDocument();
findDocuments();
