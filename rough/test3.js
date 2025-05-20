const mongoose = require("mongoose");

// Corrected Connection URI with URL encoding
const uri =
  "mongodb+srv://nitin_patel:nitinpatel@rozgarsetu.rdcpc.mongodb.net/applicant?retryWrites=true&w=majority&appName=rozgarsetu";

// Connect to MongoDB
mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Define a schema for the registar_data collection
const registrarSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  experience: { type: Number, required: true },
  email: { type: String, required: true },
});

// Create a model based on the schema
const Registrar = mongoose.model("Registrar", registrarSchema, "registar_data");

// Example function to add a new document
const addRegistrar = async () => {
  try {
    const newRegistrar = new Registrar({
      name: "Jane Doe",
      phone: "0987654321",
      experience: 3,
      email: "janedoe@example.com",
    });
    const result = await newRegistrar.save();
    console.log("New Registrar Added:", result);
  } catch (err) {
    console.error("Error adding new registrar", err);
  }
};

// Example function to find all documents
const findRegistrars = async () => {
  try {
    const registrars = await Registrar.find();
    console.log("Registrars Found:", registrars);
  } catch (err) {
    console.error("Error finding registrars", err);
  }
};

// Run examples
addRegistrar();
findRegistrars();
