const mongoose = require('mongoose');
const Register = require('./models/register_data.js'); // Adjust the path to your Register model

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/labour_register', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

async function testPlainTextPasswordStorage() {
    try {
        // Step 1: Create a new user with a plain text password
        const newUser = new Register({
            name: 'John Doe',
            fatherName: 'Father Name',
            motherName: 'Mother Name',
            experience: '5 years',
            age: 30,
            location: 'New York',
            state: 'NY',
            district: 'Manhattan',
            phone: '1234567890', // Use a unique phone number
            password: 'hello', // This is the plain text password
            employee_id: 'EMP12345'
        });

        // Step 2: Save the new user to the database
        await newUser.save();
        console.log('User created successfully');

        // Step 3: Retrieve the user to check the stored password
        const storedUser = await Register.findOne({ phone: '1234567890' });
        console.log('Stored User:', storedUser);

        // Step 4: Check if the password is stored as plain text
        if (storedUser.password === 'myPlainTextPassword') {
            console.log('Password is stored in plain text.');
        } else {
            console.log('Password is not stored in plain text.');
        }
    } catch (err) {
        console.error('Error during the test:', err);
    } finally {
        // Close the connection
        mongoose.connection.close();
    }
}

// Run the test function
testPlainTextPasswordStorage();
