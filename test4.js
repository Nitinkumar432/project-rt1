const mongoose = require('mongoose');
const JobApplication = require('./models/job_apply.js');

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
const sampleApplication = new JobApplication({
  jobTitle: 'Software Engineer',
  Company_Name: 'Tech Innovations',
  employeeId: 'rzs12345',
  registrationId: 'rzs56789',
  name: 'John Doe',
  fatherName: 'Michael Doe',
  dob: new Date('1990-05-15'),
  age: 34,
  experience: '5 years',
  phone: '123-456-7890',
  address: '123 Elm Street, Springfield',
  pincode: '123456',
  state: 'Illinois',
  minimumSalary: 60000,
  availability: 'Immediate',
});

sampleApplication.save()
.then(() => {
    console.log('Sample data inserted successfully.');
    mongoose.connection.close();
})
.catch(err => {
    console.error('Error inserting sample data:', err);
    mongoose.connection.close();
});
// Function to find all documents
const findDocuments = async () => {
  try {
    const documents = await JobApplication.find();
    console.log('Documents Found:', documents);
  } catch (err) {
    console.error('Error finding documents', err);
  }
};


// Run examples
findDocuments();
