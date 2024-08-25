const express = require('express');
const bcrypt = require('bcrypt');
// const chalk=require('chalk');
const bodyParser=require("body-parser");
const app = express();
//jwt

app.use(express.json());
// nodemialer 
const nodemailer = require('nodemailer');
// requiring dotenv
require('dotenv').config();

const jwt = require('jsonwebtoken');
const path = require('path');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
uuidv4();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
//design of backend
//till here

// exporting job data

const jobput = require('./jobdata/job_data.js');
const jobs = require('./jobdata/frontjob1.js');
const jobs2 = require('./jobdata/frontjob2.js');
// languauge switch data
const language=require('./language/entohi.js');
// headlines data
const newsItems=require('./news/headlines.js');



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const mongoose = require('mongoose');
const Register = require('./models/register_data.js');
const Job_post=require("./models/job_post.js");
const Company = require('./models/company_register.js');
const JobApplication = require('./models/job_apply.js');
const port = 3000;
// secret toke  generate to access from .env
const secretKey = process.env.JWT_SECRET;
//MONGO URL
const uri =process.env.MONGO_URL;

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Define a schema without strict enforcement
const schema = new mongoose.Schema({}, { strict: false });

// main().then(() => {
//     console.log('Connection successful');
// }).catch(err => console.log(err));

// async function main() {
//     await mongoose.connect('mongodb://127.0.0.1:27017/labour_register', {
     
//     });
// }





//storing sample data
// let logind1=new Login({
//     phone_number:7488204975,
//     password:"Nitin@123"

// })
// logind1.save().then((res)=>{
//     console.log(res);
// }).catch(err=>console.log(err));
// till backend





const breakingNews = [
    "Breaking News: New policy for workers announced!",
    "Update: Minimum wage increased in Delhi.",
    "Alert: Heavy rainfall expected in Mumbai this week."
];
const notices = [
    "Breaking News: New policy for workers announced!",
    "Update: Minimum wage increased in Delhi.",
    "Alert: Heavy rainfall expected in Mumbai this week."
];


app.use((req, res, next) => {
    if (!req.cookies.lang) {
        res.cookie('lang', 'en'); // Default to English if no language is set
    }
    console.log(`Request URL: ${req.url}, Method: ${req.method}, Language: ${req.cookies.lang || 'en'}`);
    next();
});


//change language logic
app.get('/change-language', (req, res) => {
    const newLang = req.query.lang;
    res.cookie('lang', newLang);
    console.log(`Language changed to: ${newLang}`);
    res.redirect('back');
});

app.get('/hello', (req, res) => {
    console.log('Visited the hello page');
    res.send('Hello, you are here at the hello page.');
});
// Handle register and login routes
app.get('/register', (req, res) => {
    const token = req.cookies.token || null;
    if(token){
        return res.status(400).send('you cant access this page please logout first to register the data ');
    }
    console.log('Labour Register page accessed');
    res.render("register.ejs");
});

app.get('/company_Register', (req, res) => {
    console.log('Company Register page accessed');
    res.render("company_register.ejs");
});
app.post('/company_register', async (req, res) => {
    try {
        // Extract form data from the request body
        const {
            companyName,
            contactEmail,
            contactPhone,
            companyAddress,
            companyRegistration,
            taxId,
            industry,
            companySize,
            website,
            companyDescription,
            finances,
            numberOfEmployees
        } = req.body;

        // Log the received data for debugging
        console.log({
            companyName,
            contactEmail,
            contactPhone,
            companyAddress,
            companyRegistration,
            taxId,
            industry,
            companySize,
            website,
            companyDescription,
            finances,
            numberOfEmployees
        });

        // Check if a company with the same email or registration number already exists
        const existingCompany = await Company.findOne({
            $or: [
                { contactEmail },
                { companyRegistration }
            ]
        });

        if (existingCompany) {
            console.log("Duplicated registration found");
            // Send an error response if the company already exists
            return res.status(400).json({
                error: 'Company with this email or registration number already exists!'
            });
        }

        // Generate a random reference number
        const referenceNumber = `REF-${Math.floor(Math.random() * 1000000)}`;

        // Create a new company document
        const newCompany = new Company({
            companyName,
            contactEmail,
            contactPhone,
            companyAddress,
            companyRegistration,
            taxId,
            industry,
            companySize,
            website,
            companyDescription,
            finances,
            numberOfEmployees,
            referenceNumber
        });

        // Save the new company to the database
        await newCompany.save();

        // Send email with reference number and logo
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender address
            to: contactEmail, // Recipient's email address
            subject: 'Registration Successful - Your Reference Number', // Email subject
            text: `Dear ${companyName},\n\nHere is your reference number: ${referenceNumber}`, // Plain text body
            html: `
                <div style="text-align: center;">
                    <img src="cid:companyLogo" alt="Company Logo" style="width: 150px;"/>
                </div>
                <p>Dear ${companyName},</p>
                <p>Here is your reference number:</p>
                <p><strong>${referenceNumber}</strong></p>
                <p>Thank you for registering with us.</p>
                <p>Best regards,</p>
                <p>RozgarSetu</p>`, // HTML body with logo and bold reference number
            attachments: [
                {
                    filename: 'logo.png', // Your logo file
                    path: 'public/images/trpzgarsetu.png', // Path to your logo file
                    cid: 'companyLogo' // Content ID for embedding the logo
                }
            ]
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        // Respond to the client with success message and reference number
        res.status(201).json({
            message: 'Registration successful! An email has been sent with your reference number.',
            referenceNumber
        });

        // Log the reference number for debugging
        console.log(`Reference Number: ${referenceNumber}`);

    } catch (error) {
        console.error('Error during registration:', error.message);
        res.status(500).json({
            error: 'An error occurred while registering the company.'
        });
    }
});

// Handle form submission from the register page
app.post('/register', async (req, res) => {
    const token = req.cookies.token || null;
    
 
    console.log('Form submitted');
    console.log('Form Data:', req.body); // Print the submitted form data to console

    const { name, fatherName, motherName, experience, age,gender, location, state, district, phone, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
    }

    try {
        // Check if the phone number already exists
        const existingUser = await Register.findOne({ phone });
        if (existingUser) {
            return res.status(400).send('Phone number already registered');
        }

        // Hash the password
        // const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new Register({
            name,
            fatherName,
            motherName,
            experience,
            age,
            gender,
            location,
            state,
            district,
            phone,
            password: password
        });

        // Save user to the database
        const savedUser = await newUser.save();

        // Generate a unique registration ID
        const registrationId = `EMP${savedUser._id.toString().slice(-6)}`;

        // Update the user with the registration ID
        savedUser.employee_id = registrationId;
        await savedUser.save();

        console.log('User registered successfully and Store in Database');
        console.log('User Details:', {
            ...req.body,
            registrationId
        });

        // Respond with registration ID
        res.status(201).json({ message: 'User registered successfully', registrationId });
    } catch (error) {
        console.error('Error saving user to the database:', error);
        return res.status(400).send('Error registering user: ' + error.message);
    }
});

// app.get('/login', (req, res) => {
//     console.log('Login page accessed');
  

//     res.render('login.ejs');
// });
// company vefirying
app.get('/verify_company', async (req, res) => {
    const token = req.cookies.token || null;
    let userPhone = null;

    if (token) {
        try {
            const decoded = jwt.verify(token, secretKey);
            userPhone = decoded.phone;
        } catch (err) {
            console.log('Invalid token:', err);
            res.clearCookie('token');
            return res.redirect('/login');
        }
    }

    try {
        const companies = await Company.find({});
        const pendingCompanies = companies.filter(company => !company.isVerified);
        const verifiedCompanies = companies.filter(company => company.isVerified);
        if(userPhone==7488204975){
        res.render('verify_company.ejs', { 
            pendingCompanies, 
            verifiedCompanies, 
            userPhone 
        });
        }else{
            return res.status(404).send(`
                <div style="text-align: center; margin-top: 50px;">
        <h1>404 - Page Not Found</h1>
        <p>You seem to be lost. The page you are looking for doesn't exist.</p>
        <img src="https://img.freepik.com/free-vector/404-error-with-landscape-concept-illustration_114360-7898.jpg?size=626&ext=jpg&ga=GA1.1.2008272138.1723593600&semt=ais_hybrid" alt="404 Error Image" style="width: 300px; height: auto;">
    </div>
            `);
            
        }
    } catch (error) {
        console.error("Error fetching companies:", error);
        res.status(500).send("Internal Server Error");
    }
});
// mail transported code




let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,  // Email address stored in .env
        pass: process.env.EMAIL_PASS   // Email password stored in .env
    }
});

// Helper function to generate a temporary password
function generateTempPassword(length = 12) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
    let tempPassword = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        tempPassword += charset[randomIndex];
    }
    return tempPassword;
}
function generateCompanyId(prefix = 'RGSTU', length = 10) {
    // Generate a numeric sequence (e.g., 6 digits from timestamp)
    const timestamp = Date.now();
    const numericSequence = String(timestamp % 1000000).padStart(6, '0');

    // Generate a random suffix (e.g., 4 characters)
    const randomSuffix = Math.random().toString(36).substring(2, 2 + length).toUpperCase();

    // Combine prefix, numeric sequence, and random suffix
    return `${prefix}${numericSequence}${randomSuffix}`;
}
app.post('/verify_company/approve/:id', async (req, res) => {
    const token = req.cookies.token || null;

    if (!token) {
        return res.redirect('/login');
    }

    try {
        // Generate unique company ID and temporary password
        const companyId = req.params.id;
        console.log(companyId);
        const company_id=generateCompanyId();
        const tempPassword = generateTempPassword(); // Generate a temporary password

        // Fetch company details
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).send('Company not found');
        }

        // Create mail options
        let mailOptions = {
            from: process.env.EMAIL_USER, // Sender address from .env file
            to: company.contactEmail, // Recipient's email address from the company document
            subject: 'Account Approval and Temporary Password', // Subject line
            text: `Your company  has been approved. Here are your details:
            
        Company ID: ${company_id} 
        Temporary Password: ${tempPassword}
        
        Please use the temporary password to log in and change it within 48 hours. If you don't update your password within this period, you will need to request a new one.`, // Plain text body
            html: `
                <div style="text-align: center;">
                    <img src="cid:companyLogo" alt="Company Logo" style="width: 150px;" />
                </div>
                <p>Your company has been approved. Here are your details:</p>
                <p><strong>Company ID:</strong> ${company_id}</p>
                <p><strong>Temporary Password:</strong> ${tempPassword}</p>
                <p>Please use the temporary password to log in and change it within 48 hours. If you don't update your password within this period, you will need to request a new one.</p>
                <p>Regards,</p>
                <p>RozgarSetu</p>`, // HTML body with embedded logo at the top
            attachments: [
                {
                    filename: 'Logo', // Name of the logo file
                    path: 'public/images/trpzgarsetu.png', // Path to the logo file
                    cid: 'companyLogo' // Content-ID for embedding the logo
                }
            ]
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Decode token and update company details
        const decoded = jwt.verify(token, secretKey);
        const userPhone = decoded.phone;

        // Update company verification details
        await Company.findByIdAndUpdate(companyId, {
            isVerified: true,
            CompanyId:company_id,
            verify_by: userPhone, // Store phone number of the user verifying
            verify_time: new Date(),
            password: tempPassword, // Store the temporary password in the company document if needed
            // tempPasswordExpiration: new Date(Date.now() + 48 * 60 * 60 * 1000) // Set expiration time for 48 hours from now
        });

        res.redirect('/verify_company');
    } catch (err) {
        console.error('Error approving company:', err);
        res.status(500).send("Internal Server Error to approving it");
    }
});

// app.get('/login', (req, res) => {
//     console.log('Login page accessed');
  

//     res.render('home.ejs');
// });

// // company_login
// app.post('/company_login', async (req, res) => {
//     const { company_id, password } = req.body;

//     try {
//         // Find the company by ID
//         const user = await Company.findOne({ CompanyId: company_id });
        
//         if (user) {
//             // Check if the password matches
//             const isMatch = password === user.password; // Updated variable from company to user

//             if (isMatch) {
//                 // Generate a JWT token
//                 const token = jwt.sign({ user: company_id }, secretKey, { expiresIn: '1h' });

//                 // Set the token in a cookie
//                 res.cookie('token', token, { httpOnly: true });
//                 res.redirect(`/?login=success&company_id=${company_id}`);
//             } else {
//                 res.status(401).send('Incorrect company ID or password.');
//             }
//         } else {
//             res.status(401).send('Incorrect company ID or password.');
//         }
//     } catch (err) {
//         console.error('Error during login:', err);
//         res.status(500).send('Server error');
//     }
// });


app.post('/login', async (req, res) => {
   
    try {
        const { phone, password } = req.body;
        console.log(req.body);
      

        const user = await Register.findOne({ phone: phone });
       console.log(user);



        if (user) {
            const isMatch = password === user.password; // Adjust if using bcrypt

            if (isMatch) {
                const token = jwt.sign({ phone: phone }, secretKey, { expiresIn: '1h' });

                res.cookie('token', token, { httpOnly: true });
                res.redirect(`/?login=success&phone=${phone}`);
            } else {
                res.status(401).send('Incorrect phone number or password.');
            }
        } else {
            res.status(401).send('Incorrect phone number or password.');
        
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('Server error');
    }
});
// home route
app.get('/', async  (req, res) => {
    try {
        const lang = req.cookies.lang || 'en';
        const token = req.cookies.token || null;
        let user = null;
        let  employee;
        

        if (token) {
            // console.log("token is : ",token);
            try {
                const decoded = jwt.verify(token, secretKey);
                 employee = await Register.findOne({ phone: decoded.phone });
                user = decoded;
            } catch (err) {
                console.log('Invalid token:', err);
                res.clearCookie('token');
            }
        }

        // Check if the login was successful based on query parameters
        const loginSuccess = req.query.login === 'success';
        const phone = req.query.phone || null;
    

        res.render('home.ejs', { 
            lang: language[lang], 
            jobs, 
            jobs2, 
            newsItems, 
            notices,
            user,
            loginSuccess,
            phone, // Pass phone number for the pop-up
            employee:employee
        });
    } catch (err) {
    
        console.error('Error serving the home page:', err);
        res.status(500).send('An error occurred while serving the home page.');
    }
});

// token verify 
const authenticateToken = async (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

    if (!token)   return res.status(401).send(`
        <div style="text-align: center; margin-top: 50px;">
<h1 style="color:red" >401 - Unauthorized Access</h1>
<p style="color:red">Access is Denied due to invaild Credentials .</p>
<img src="https://i.pinimg.com/originals/37/1f/5a/371f5aab6306463243c58fb21aca3dfa.png" alt="404 Error Image" style="width: 300px; height: auto;">
</div>
    `);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            console.error('Error verifying token:', err);
            return res.sendStatus(403);
        }
        req.user = user;
        console.log("authentication verifed");
    
        next();
    });
};
//checking which user is login
app.get('/protected', authenticateToken, (req, res) => {
    res.send(`Welcome, ${req.user.phone}!`);
});
//checking web token authentication
const handleTokenError = (err) => {
    if (err.name === 'JsonWebTokenError') {
        console.error('JWT Error:', err.message);
    } else if (err.name === 'TokenExpiredError') {
        console.error('JWT Expired:', err.message);
    } else {
        console.error('Unknown JWT Error:', err);
    }
};
// logoutsection
app.get('/logout', (req, res) => {
    res.clearCookie('token'); // Clear the token cookie
    res.redirect('/?logout=success');  // Redirect to home page
});
//forgot password section
app.post('/forgot-password', (req, res) => {
    console.log(req.body);
});


app.post('/change-password', async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const token = req.cookies.token || null;

    try {
        if (!token) {
            return res.redirect('/login');
        }

        let user = null;

        try {
            // Verify the token and extract the user's phone number
            const decoded = jwt.verify(token, secretKey);
            user = await Register.findOne({ phone: decoded.phone });

            if (!user) {
                return res.status(401).send('User not found.');
            }
        } catch (err) {
            console.log('Invalid token:', err);
            res.clearCookie('token');
            return res.redirect('/login');
        }

        // Check if the current password matches the one in the database
        if (currentPassword !== user.password) {
            return res.status(400).json({ error: 'Incorrect current password' });
        }

        // Validate that the new password and confirm password match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ error: 'New password and confirm password do not match' });
        }

        // Update the user's password with the new one
        user.password = newPassword;
        await user.save();

        return res.status(200).json({ success: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        return res.status(500).send('An error occurred while changing the password.');
    }
});
//print all data of current user
app.get('/profile', async (req, res) => {
    try {
        const token = req.cookies.token || null;
        let user = null;

        if (token) {
            try {
                const decoded = jwt.verify(token, secretKey);
                user = await Register.findOne({ phone: decoded.phone });
                if (!user) {
                    return res.status(401).send('User not found.');
                }
            } catch (err) {
                console.log('Invalid token:', err);
                res.clearCookie('token');
                return res.redirect('/login');
            }
        } else {
            return res.redirect('/login');
        }

        res.render('profile.ejs', {
            user: user,
        });
    } catch (err) {
        console.error('Error serving profile page:', err);
        res.status(500).send('An error occurred while serving the profile page.');
    }
});
app.get('/applied-jobs',authenticateToken, async (req, res) => {
    try {
        const token = req.cookies.token || null;
        let user = null;
        let employee_id;

        if (token) {
            try {
                const decoded = jwt.verify(token, secretKey); // Verify the JWT token
                user = await Register.findOne({ phone: decoded.phone }); // Find the user based on the phone number in the decoded token
                if (!user) {
                    return res.status(401).send('User not found.');
                }
                user_id = user.employee_id; // Get the employee_id from the found user
                console.log("user employee id",user_id);
            } catch (err) {
                console.log('Invalid token:', err);
                res.clearCookie('token'); // Clear the token cookie if invalid
                return res.redirect('/login'); // Redirect to login if token is invalid
            }
        } else {
            return res.redirect('/login'); // Redirect to login if no token is present
        }

        // Find all job applications for the logged-in employee
        const appliedJobs = await JobApplication.find({ employeeId: user_id });
   
        // console.log("user employee id",appliedJobs.employee_id);

        // Render the applied jobs page with the list of jobs
        res.render('applied-job.ejs', {
            appliedJobs: appliedJobs, // Pass the list of applied jobs to the EJS template
        });
    } catch (err) {
        console.error('Error serving applied jobs page:', err);
        res.status(500).send('An error occurred while serving the applied jobs page.');
    }
});


// const language = {
//     en: { welcome: "Welcome", home: "Home", register: "Register", login: "Login", job: "Find Jobs", toggleLang: "Change Language", intro: "Find Your Ideal Job" },
//     hi: { welcome: "स्वागत है", home: "मुखपृष्ठ", register: "रजिस्टर", login: "लॉगिन", job: "नौकरियाँ खोजें", toggleLang: "भाषा बदलें", intro: "अपना आदर्श नौकरी खोजें" }
// };
//logic to finjob section
app.get('/findjob', authenticateToken, async (req, res) => {
    const lang = req.cookies.lang || 'en';
    const { 'job-title': jobTitle, location, salary } = req.query;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log(`Client IP Address: ${ip}`);

    let filteredJobs = jobput;
    let employee = await Register.findOne({ phone: req.user.phone });
    if (jobTitle) {
        filteredJobs = filteredJobs.filter(job => job.title.toLowerCase().includes(jobTitle.toLowerCase()));
    }
    if (location) {
        filteredJobs = filteredJobs.filter(job => job.location.toLowerCase().includes(location.toLowerCase()));
    }
    if (salary) {
        filteredJobs = filteredJobs.filter(job => job.salary >= parseInt(salary));
    }

    res.render('findjob', { 
        lang: language[lang], 
        jobs: filteredJobs, 
        language: language,
        user: req.user, // Pass the authenticated user data to the template
        employee: employee // Pass the employee data to the template
    });
    console.log(req.user);
    
});


// Route for posting a job
app.post('/post-job', (req, res) => {
    const { title, location, salary, description } = req.body;
    jobput.push({ title, location, salary: parseInt(salary), description });
    res.redirect('/findjob');
});

// Route for applying to a job
app.post('/apply', async (req, res) => {
    const { jobTitle,job_id ,companyName, name, fatherName, dob, age, experience, phone, address, pincode, state, minimumSalary, availability, employeeId, registrationId } = req.body;

    console.log(req.body);
    // Log job and applicant details
    // console.log(`Job Applied: ${jobTitle}`);
    // console.log(`Job Post ID: ${jobPostId}`);
    // console.log(`Employee ID: ${employeeId}`);
    // console.log(`Registration ID: ${registrationId}`);
    // console.log('Applicant Details:');
    // console.log(`Name: ${name}`);
    // console.log(`Father's Name: ${fatherName}`);
    // console.log(`Date of Birth: ${dob}`);
    // console.log(`Age: ${age}`);
    // console.log(`Experience: ${experience}`);
    // console.log(`Phone: ${phone}`);
    // console.log(`Address: ${address}`);
    // console.log(`Pincode: ${pincode}`);
    // console.log(`State: ${state}`);
    // console.log(`Expected Minimum Salary: ${minimumSalary}`);
    // console.log(`Availability: ${availability}`);

    try {
        // Create a new job application document
        const jobApplication = new JobApplication({
            jobTitle,
            job_id,
            companyName,
            employeeId,
            registrationId,
            name,
            fatherName,
            dob,
            age,
            experience,
            phone,
            address,
            pincode,
            state,
            minimumSalary,
            availability,
        });

        // Save the document to MongoDB
        await jobApplication.save();

        console.log('Job application saved successfully');
        res.status(200).json({
            message: 'Application successfully submitted',
            registrationId: registrationId,
        });
    } catch (error) {
        console.error('Error saving job application:', error);
        res.status(500).send('Error submitting application.');
    }
});
// track registration 
app.get('/trackcompany-registration',(req,res)=>{
    res.render('company_registration_track.ejs');
    
});
app.post('/api/track_reference', async (req, res) => {
    try {
        const { referenceNumber } = req.body;

        // Find the company by reference number
        const company = await Company.findOne({ referenceNumber });

        if (!company) {
            // If no company is found, send an error response
            return res.status(404).json({ error: 'Invalid reference number' });
        }

        // Send the company details if found
        res.json({
            companyName: company.companyName,
            contactEmail: company.contactEmail,
            contactPhone: company.contactPhone,
            companyAddress: company.companyAddress,
            isVerified: company.isVerified
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while tracking the reference number' });
    }
});
app.get('/job-application',(req,res)=>{
    console.log("job-application tracker page accessed");
    res.render("job-application-status.ejs");
    
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
app.get('/track', async (req, res) => {
    try {
        const { registrationNumber } = req.query;

        // Find the job application based on the registration number
        const application = await JobApplication.findOne({ registrationId: registrationNumber });

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Send the application data as JSON
        res.json(application);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
