const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let generatedOtp = '';

app.post('/send-otp', (req, res) => {
    const phone = req.body.phone;
    generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`OTP sent to ${phone}: ${generatedOtp}`); // This is just for simulation
    res.send({ success: true });
});

app.post('/validate-otp', (req, res) => {
    const otp = req.body.otp;
    if (otp === generatedOtp) {
        res.send({ success: true });
    } else {
        res.send({ success: false });
    }
});

app.post('/register', (req, res) => {
    const userData = req.body;
    console.log('User data:', userData); // Handle saving user data here
    res.send('Registration successful');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
