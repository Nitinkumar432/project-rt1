const mongoose = require("mongoose");

// Connection URI
const uri =
  "mongodb+srv://nitin_patel:nitinpatel@rozgarsetu.rdcpc.mongodb.net/applicant?retryWrites=true&w=majority&appName=rozgarsetu";

// Connect to MongoDB
mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Define a schema without strict enforcement
const schema = new mongoose.Schema({}, { strict: false });

// Create a model for the existing collection
const Collection = mongoose.model("Collection", schema, "registar_data");

// Function to add a new document
const addDocument = async () => {
  try {
    const newDocument = new Collection({
      name: "Jane Doe",
      phone: "0987654321",
      experience: 3,
      email: "janedoe@example.com",
    });
    const result = await newDocument.save();
    console.log("New Document Added:", result);
  } catch (err) {
    console.error("Error adding new document", err);
  }
};

// Function to find all documents
const findDocuments = async () => {
  try {
    const documents = await Collection.find();
    console.log("Documents Found:", documents);
  } catch (err) {
    console.error("Error finding documents", err);
  }
};

// Run examples
addDocument();
findDocuments();
