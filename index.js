const express = require('express');
// const bcrypt = require('bcrypt');

const bodyParser=require("body-parser");
const app = express();
//jwt
// const chalk=require('chalk');
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
const UserNotification=require('./models/UserNotification.js');
const SeparateNotification=require('./models/SeparateNotification.js');
// exporting job data

const jobput = require('./jobdata/job_data.js');
// const jobs = require('./jobdata/frontjob1.js');
// const jobs2 = require('./jobdata/frontjob2.js');
const JobPost=require('./models/job_post.js');
// languauge switch data
const language=require('./language/entohi.js');
// headlines data
const newsItems=require('./news/headlines.js');



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const mongoose = require('mongoose');
const Register = require('./models/register_data.js');

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

// Handle register and login routes
app.get('/register', (req, res) => {
    const usertoken = req.cookies.usertoken || null;
    if(usertoken){
        return res.status(400).send('you cant access this page please logout first to register the data ');
    }
    console.log('Labour Register page accessed');
    res.render("register.ejs");
});

// app.get('/company_Register', (req, res) => {
//     console.log('Company Register page accessed');
//     res.render("company_register.ejs");
// });
// company register
// Handle form submission from the register page
app.post('/register', async (req, res) => {
    const usertoken = req.cookies.usertoken || null;
    
 
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




let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,  // Email address stored in .env
        pass: process.env.EMAIL_PASS   // Email password stored in .env
    }
});

app.post('/login', async (req, res) => {
   
    try {
        const { phone, password } = req.body;
        console.log(req.body);
      

        const user = await Register.findOne({ phone: phone });
       console.log(user);



        if (user) {
            const isMatch = password === user.password; // Adjust if using bcrypt

            if (isMatch) {
                const usertoken = jwt.sign({ phone: phone }, secretKey, { expiresIn: '1h' });

                res.cookie('usertoken', usertoken, { httpOnly: true });
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


app.get('/', async (req, res) => {
    try {
        const lang = req.cookies.lang || 'en';
        const usertoken = req.cookies.usertoken || null;
        let user = null;
        let employee;

        if (usertoken) {
            try {
                const decoded = jwt.verify(usertoken, secretKey);
                employee = await Register.findOne({ phone: decoded.phone });
                user = decoded;
            } catch (err) {
                console.log('Invalid usertoken:', err);
                res.clearCookie('usertoken');
            }
        }

        // Fetch jobs that are verified and sort them by `verified_time` in descending order
        const verifiedJobs = await JobPost.find({ status: 'Verified' })
            .sort({ verified_time: -1 })  // Sort by verified_time (descending)
            .limit(8);  // Fetch only the top 8 verified jobs

        // Split jobs into two groups of 4
        const jobs = verifiedJobs.slice(0, 4);  // First 4 jobs
        const jobs2 = verifiedJobs.slice(4, 8);  // Next 4 jobs

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
            employee
        });
    } catch (err) {
        console.error('Error serving the home page:', err);
        res.status(500).send('An error occurred while serving the home page.');
    }
});
// authentiocation part;
const authenticateusertoken = async (req, res, next) => {
    const usertoken = req.cookies.usertoken || req.headers['authorization']?.split(' ')[1];

    if (!usertoken)   return res.status(401).send(`
        <div style="text-align: center; margin-top: 50px;">
<h1 style="color:red" >401 - Unauthorized Access</h1>
<p style="color:red">Access is Denied due to invaild Credentials .</p>
<img src="https://i.pinimg.com/originals/37/1f/5a/371f5aab6306463243c58fb21aca3dfa.png" alt="404 Error Image" style="width: 300px; height: auto;">
</div>
    `);

    jwt.verify(usertoken, secretKey, (err, user) => {
        if (err) {
            console.error('Error verifying usertoken:', err);
            return res.sendStatus(403);
        }
       
        req.user = user;
        console.log(user);
         console.log("authentication verifed");
    
        next();
    });
};
// here we implemnted the function to see detaisl button to see details relalated to job post ok
app.get('/job/:id',authenticateusertoken, async (req, res) => {
    const jobId = req.params.id;
    

    try {
        // Use findOne to get a single job by job_id
        const job = await JobPost.findOne({ job_id: jobId });

        if (job) {
            res.render('job-details', { job ,user:req.user}); // Render the job details page
        } else {
            res.status(404).send('Job not found'); // Handle job not found
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error'); // Handle server errors
    }
});


// usertoken verify 

//checking which user is login
app.get('/protected', authenticateusertoken, (req, res) => {
    res.send(`Welcome, ${req.user.phone}!`);
});
//checking web usertoken authentication
const handleusertokenError = (err) => {
    if (err.name === 'JsonWebusertokenError') {
        console.error('JWT Error:', err.message);
    } else if (err.name === 'usertokenExpiredError') {
        console.error('JWT Expired:', err.message);
    } else {
        console.error('Unknown JWT Error:', err);
    }
};
// logoutsection
app.get('/logout', (req, res) => {
    res.clearCookie('usertoken'); // Clear the usertoken cookie
    res.redirect('/?logout=success');  // Redirect to home page
});
//forgot password section
app.post('/forgot-password', (req, res) => {
    console.log(req.body);
});


app.post('/change-password', async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const usertoken = req.cookies.usertoken || null;

    try {
        if (!usertoken) {
            return res.redirect('/login');
        }

        let user = null;

        try {
            // Verify the usertoken and extract the user's phone number
            const decoded = jwt.verify(usertoken, secretKey);
            user = await Register.findOne({ phone: decoded.phone });

            if (!user) {
                return res.status(401).send('User not found.');
            }
        } catch (err) {
            console.log('Invalid usertoken:', err);
            res.clearCookie('usertoken');
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
        const usertoken = req.cookies.usertoken || null;
        let user = null;

        if (usertoken) {
            try {
                const decoded = jwt.verify(usertoken, secretKey);
                user = await Register.findOne({ phone: decoded.phone });
                if (!user) {
                    return res.status(401).send('User not found.');
                }
            } catch (err) {
                console.log('Invalid usertoken:', err);
                res.clearCookie('usertoken');
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
app.get('/applied-jobs',authenticateusertoken, async (req, res) => {
    try {
        const usertoken = req.cookies.usertoken || null;
        let user = null;
        let employee_id;

        if (usertoken) {
            try {
                const decoded = jwt.verify(usertoken, secretKey); // Verify the JWT usertoken
                user = await Register.findOne({ phone: decoded.phone }); // Find the user based on the phone number in the decoded usertoken
                if (!user) {
                    return res.status(401).send('User not found.');
                }
                user_id = user.employee_id; // Get the employee_id from the found user
                console.log("user employee id",user_id);
            } catch (err) {
                console.log('Invalid usertoken:', err);
                res.clearCookie('usertoken'); // Clear the usertoken cookie if invalid
                return res.redirect('/login'); // Redirect to login if usertoken is invalid
            }
        } else {
            return res.redirect('/login'); // Redirect to login if no usertoken is present
        }

        // Find all job applications for the logged-in employee
      const appliedJobs = await JobApplication.find({ employeeId: user_id });

    // Filter jobs
    const activeJob = appliedJobs.find(job => job.isActive); // Current active job
    console.log(activeJob);
    const jobHistory = appliedJobs.filter(job => job.jobLeft); // Jobs where the user has left
    const appliedHistory = appliedJobs.filter(job => !job.isActive && !job.jobLeft); // Jobs in progress

    res.render('applied-job.ejs', { activeJob: activeJob || [], jobHistory : jobHistory || [], appliedHistory : appliedHistory  || []});
   
        // console.log("user employee id",appliedJobs.employee_id);

        // Render the applied jobs page with the list of jobs
        // res.render('applied-job.ejs', {
        //     appliedJobs: appliedJobs, // Pass the list of applied jobs to the EJS template
        // });
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
app.get('/findjob', authenticateusertoken, async (req, res) => {
    console.log("find job accessed");
    const lang = req.cookies.lang || 'en';
    const { 'job-title': jobTitle, location, salary } = req.query;

    let query = { status: 'Verified' };

    if (jobTitle) {
        query.title = { $regex: new RegExp(jobTitle, 'i') };  // Case-insensitive search for job title
    }

    if (location) {
        query['location.city'] = { $regex: new RegExp(location, 'i') };  // Case-insensitive search for location
    }

    if (salary) {
        query.salary = { $gte: parseInt(salary) };  // Search for jobs with salary >= provided value
    }

    try {
        let filteredJobs = await JobPost.find(query).sort({ verified_time: -1 });

        // Fetch employee data for authenticated user
        let employee = await Register.findOne({ phone: req.user.phone });

        // Render the findjob page with the filtered jobs
        res.render('findjob', { 
            lang: language[lang], 
            jobs: filteredJobs, 
            language: language, 
            user: req.user, 
            employee: employee 
        });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Route for posting a job

// Route for applying to a job
app.post('/apply', async (req, res) => {
    const { jobTitle,job_id ,companyName, name, fatherName, dob, age, experience, phone, address, pincode, state, minimumSalary, availability, employeeId, registrationId } = req.body;

    console.log(req.body);
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
app.get('/apply/:jobId', authenticateusertoken, async (req, res) => {
    console.log("/apply/:jobId accessed");
    try {
        console.log(req.user.phone);
        const employee = await Register.findOne({ phone: req.user.phone });
        // console.log(user);

        const jobId = req.params.jobId;
        const jobData = await JobPost.findOne({ job_id: jobId });
        // console.log(jobData);

        if (!employee || !jobData) {
            return res.status(404).send('User or Job not found');
        }

        res.render('applyforstatic.ejs', { employee, jobData });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
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

// trackign data of employeers to
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




// adding notiifcation posted by admin
app.get('/notifications/:employee_id', async (req, res) => {
    const { employee_id } = req.params;
    console.log(employee_id);
    try {
        // Fetch UserNotification as it is
        const notifications = await UserNotification.find().sort({ createdAt: -1 });

        // Fetch messages from the SeparateNotification collection for the specific employee
        const userMessages = await SeparateNotification.find({ recipients: { $in: [employee_id] } }).sort({ timestamp: -1 });

        console.log(userMessages);

        // Pass both datasets to the template
        res.render('userNotifications', { notifications, userMessages });
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to fetch notifications.');
    }
});
  app.post('/notifications/mark-as-read', async (req, res) => {
    try {
      const { notificationId } = req.body;
      if (!notificationId) {
        return res.status(400).json({ error: 'Notification ID is required' });
      }
  
      await UserNotification.findByIdAndUpdate(notificationId, { read: true });
      res.status(200).json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });
  app.post('/messages/mark-as-read', async (req, res) => {
    try {
      const { messageId } = req.body;
      if (!messageId) return res.status(400).json({ error: 'Message ID is required' });
  
      const message = await SeparateNotification.findByIdAndUpdate(
        messageId,
        { isRead: true },
        { new: true }
      );
  
      if (!message) return res.status(404).json({ error: 'Message not found' });
  
      res.json({ success: true, message });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });


//   SEPARATE Notification to User 

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});