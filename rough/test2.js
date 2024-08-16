const mongoose = require('mongoose');

// Corrected Connection URI with URL encoding
const uri = 'mongodb+srv://nitin_patel:Nitin_patel@123@rozgarsetu.rdcpc.mongodb.net/?retryWrites=true&w=majority&appName=RozgarSetu';

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Define a schema for the labour_registers collection
const labourSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  experience: { type: Number, required: true },
});

// Create a model based on the schema
const Labour = mongoose.model('Labour', labourSchema, 'labour_registers');

// Example function to add a new document
const addLabour = async () => {
  try {
    const newLabour = new Labour({
      name: 'John Doe',
      phone: '1234567890',
      experience: 5,
    });
    const result = await newLabour.save();
    console.log('New Labour Added:', result);
  } catch (err) {
    console.error('Error adding new labour', err);
  }
};

// Example function to find all documents
const findLabours = async () => {
  try {
    const labours = await Labour.find();
    console.log('Labours Found:', labours);
  } catch (err) {
    console.error('Error finding labours', err);
  }
};

// Run examples
addLabour();
findLabours();
