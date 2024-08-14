// const mongoose = require('mongoose');
// const Register = require('./models/register_data.js'); // Adjust the path to your Register model

// // Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/labour_register', { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('Connected to MongoDB'))
//     .catch(err => console.error('Could not connect to MongoDB...', err));

// async function testPlainTextPasswordStorage() {
//     try {
//         // Step 1: Create a new user with a plain text password
//         const newUser = new Register({
//             name: 'John Doe',
//             fatherName: 'Father Name',
//             motherName: 'Mother Name',
//             experience: '5 years',
//             age: 30,
//             location: 'New York',
//             state: 'NY',
//             district: 'Manhattan',
//             phone: '1234567890', // Use a unique phone number
//             password: 'hello', // This is the plain text password
//             employee_id: 'EMP12345'
//         });

//         // Step 2: Save the new user to the database
//         await newUser.save();
//         console.log('User created successfully');

//         // Step 3: Retrieve the user to check the stored password
//         const storedUser = await Register.findOne({ phone: '1234567890' });
//         console.log('Stored User:', storedUser);

//         // Step 4: Check if the password is stored as plain text
//         if (storedUser.password === 'myPlainTextPassword') {
//             console.log('Password is stored in plain text.');
//         } else {
//             console.log('Password is not stored in plain text.');
//         }
//     } catch (err) {
//         console.error('Error during the test:', err);
//     } finally {
//         // Close the connection
//         mongoose.connection.close();
//     }
// }

// // Run the test function
// testPlainTextPasswordStorage();
const mongoose = require('mongoose');
const Company = require('./models/company_register'); // Update with the correct path to your model file

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/labour_register', { // Update with your actual MongoDB URI and database name
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));

// Test data with the gender field
const sampleCompanies = [
    {
      companyName: "Tech Solutions Ltd",
      contactEmail: "info@techsolutions.com",
      contactPhone: "9876543210",
      companyAddress: "123 Tech Street, Mumbai, Maharashtra",
      companyRegistration: "TSL987654321",
      taxId: "TAX1234567890",
      industry: "Software Development",
      companySize: "200-500",
      website: "https://www.techsolutions.com",
      companyDescription: "Tech Solutions Ltd is a leading software development company specializing in enterprise solutions.",
      finances: "Revenue: $10M, Profit: $2M",
      numberOfEmployees: 250,
      referenceNumber: "REF123456",
      password: "password123",
    },
    {
      companyName: "Green Energy Inc.",
      contactEmail: "contact@greenenergy.com",
      contactPhone: "9123456789",
      companyAddress: "45 Renewable Ave, Bangalore, Karnataka",
      companyRegistration: "GEI123456789",
      taxId: "TAX9876543210",
      industry: "Renewable Energy",
      companySize: "100-200",
      website: "https://www.greenenergy.com",
      companyDescription: "Green Energy Inc. focuses on developing sustainable energy solutions for the future.",
      finances: "Revenue: $5M, Profit: $1M",
      numberOfEmployees: 150,
      referenceNumber: "REF987654",
      password: "energy123",
    },
    {
      companyName: "Foodies Restaurant Chain",
      contactEmail: "support@foodies.com",
      contactPhone: "9988776655",
      companyAddress: "89 Gourmet Lane, Delhi",
      companyRegistration: "FRC543210987",
      taxId: "TAX6543210987",
      industry: "Food and Beverage",
      companySize: "500-1000",
      website: "https://www.foodies.com",
      companyDescription: "Foodies is a popular restaurant chain known for its diverse cuisine and excellent service.",
      finances: "Revenue: $20M, Profit: $3M",
      numberOfEmployees: 600,
      referenceNumber: "REF543210",
      password: "foodie2021",
    },
    {
      companyName: "EduFuture Pvt Ltd",
      contactEmail: "nitinraj844126@gmail.com",
      contactPhone: "9345678901",
      companyAddress: "67 Learning Road, Pune, Maharashtra",
      companyRegistration: "EFL123987654",
      taxId: "TAX3210987654",
      industry: "Education",
      companySize: "50-100",
      website: "https://www.edufuture.com",
      companyDescription: "EduFuture Pvt Ltd provides online learning platforms and educational resources.",
      finances: "Revenue: $2M, Profit: $500K",
      numberOfEmployees: 80,
      referenceNumber: "REF321098",
      password: "learn123",
    },
    {
      companyName: "HealthFirst Hospital",
      contactEmail: "nitinraj844126@gmail.com",
      contactPhone: "9223344556",
      companyAddress: "101 Wellness Street, Hyderabad, Telangana",
      companyRegistration: "HFF678901234",
      taxId: "TAX8765432109",
      industry: "Healthcare",
      companySize: "1000+",
      website: "https://www.healthfirst.com",
      companyDescription: "HealthFirst is a multi-specialty hospital providing comprehensive healthcare services.",
      finances: "Revenue: $50M, Profit: $10M",
      numberOfEmployees: 1200,
      referenceNumber: "REF876543",
      password: "health123",
    },
    {
      companyName: "BrightTech Electronics",
      contactEmail: "nitinraj844126@gmail.com",
      contactPhone: "9445566778",
      companyAddress: "202 Innovation Blvd, Chennai, Tamil Nadu",
      companyRegistration: "BTE567890123",
      taxId: "TAX1234567809",
      industry: "Electronics Manufacturing",
      companySize: "500-1000",
      website: "https://www.brighttech.com",
      companyDescription: "BrightTech Electronics is a leading manufacturer of consumer electronics and gadgets.",
      finances: "Revenue: $30M, Profit: $8M",
      numberOfEmployees: 700,
      referenceNumber: "REF654321",
      password: "bright123",
    }
  ];
  
  // You can use the Company.insertMany() method to insert these documents into your MongoDB collection.
  Company.insertMany(sampleCompanies)
    .then(() => console.log("Sample data inserted successfully"))
    .catch(error => console.log("Error inserting data: ", error));
  