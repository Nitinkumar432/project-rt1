const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser=require("body-parser");
const app = express();
//jwt
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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const mongoose = require('mongoose');
const Register = require('./models/register_data.js');
const port = 3000;
main().then(() => {
    console.log('Connection successful');
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/labour_register', {
     
    });
}
//storing sample data
// let logind1=new Login({
//     phone_number:7488204975,
//     password:"Nitin@123"

// })
// logind1.save().then((res)=>{
//     console.log(res);
// }).catch(err=>console.log(err));
// till backend

const language = {
    en: {
        job:"Find More Job",
        home: "Home",
        register: "Register",
        login: "Login",
        toggleLang: "Switch to Hindi",
        welcome: "Welcome to Labour Job Finder",
        intro: "Find the best jobs near you",
        jobListings: "Job Listings",
        location: "Location",
        apply: "Apply Now",
        details: "See details"
    },
    hi: {
        job:"नौकरी खोजें",
        home: "होम",
        register: "रजिस्टर करें",
        login: "लॉगिन",
        toggleLang: "अंग्रेजी में बदलें",
        welcome: "लेबर जॉब फाइंडर में आपका स्वागत है",
        intro: "अपने निकटतम सर्वश्रेष्ठ नौकरियां ढूंढें",
        jobListings: "नौकरी सूची",
        location: "स्थान",
        apply: "अभी आवेदन करें",
        details: "जानकारी देखें"
    }
};

// Sample job data
const jobs = [
    { title: "Construction Worker", description: "Work on various construction sites.", location: "Delhi",Job_post_id:uuidv4()  },
    { title: "Gardener", description: "Maintain gardens and landscapes.", location: "Mumbai",Job_post_id:uuidv4() },
    { title: "Factory Worker", description: "Operate machinery in a factory.", location: "Chennai",Job_post_id:uuidv4() },
    { title: "Bridge Construction", description: "Operate machinery.", location: "Hazipur",Job_post_id:uuidv4() }
];
const jobs2 = [
    { title: "Electrician", description: "Install and repair electrical systems.", location: "Delhi" ,Job_post_id:uuidv4()},
    { title: "Plumber", description: "Fix and install plumbing systems.", location: "Mumbai",Job_post_id:uuidv4() },
    { title: "Machine Operator", description: "Operate and maintain industrial machines.", location: "Chennai" ,Job_post_id:uuidv4()},
    { title: "Laptop Repair ", description: "Operate and maintain Laptop  parts.", location: "patna",Job_post_id:uuidv4() }
];


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
const newsItems = [
    { text: "Breaking News: Major event happening now! - महत्वपूर्ण समाचार: बड़ा घटना अभी हो रही है!" },
    { text: "Update: New technology launch next week! - अपडेट: अगले सप्ताह नई तकनीक की लॉन्च!" },
    { text: "Special Report: Market trends analysis - विशेष रिपोर्ट: बाजार प्रवृत्तियों का विश्लेषण" },
    { text: "Alert: Weather warning issued - अलर्ट: मौसम की चेतावनी जारी" }
    // Add more news items as needed
];

app.use((req, res, next) => {
    if (!req.cookies.lang) {
        res.cookie('lang', 'en'); // Default to English if no language is set
    }
    console.log(`Request URL: ${req.url}, Method: ${req.method}, Language: ${req.cookies.lang || 'en'}`);
    next();
});

app.get('/', (req, res) => {
    const lang = req.cookies.lang || 'en';
    console.log('Serving home page');
    res.render('home.ejs', { lang: language[lang], jobs, jobs2,newsItems,notices});
});

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
    console.log('Register page accessed');
    res.render("register.ejs");
});

// Handle form submission from the register page
app.post('/register', async (req, res) => {
    console.log('Form submitted');
    console.log('Form Data:', req.body); // Print the submitted form data to console

    const { name, fatherName, motherName, experience, age, location, state, district, phone, password, confirmPassword } = req.body;

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
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new Register({
            name,
            fatherName,
            motherName,
            experience,
            age,
            location,
            state,
            district,
            phone,
            password: hashedPassword
        });

        // Save user to the database
        const savedUser = await newUser.save();

        // Generate a unique registration ID
        const registrationId = `EMP${savedUser._id.toString().slice(-6)}`;

        // Update the user with the registration ID
        savedUser.employee_id = registrationId;
        await savedUser.save();

        console.log('User registered successfully');
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
app.get('/alldata', async (req,res)=>{
    let alldata= await Register.find();
    console.log(alldata);
    res.render("login.ejs",{alldata});
});
app.get('/login',(req,res)=>{
    const {phone, password} = req.body;
    // console.log(`Login With Phone: ${phone}, Password: ${password}`);
    res.send("hello login successfully Redirection to main page");
    


})

app.post('/login', async (req, res) => {
    try {
        const { phone, password } = req.body;  // Destructure phone and password from req.body
        console.log(`Received login data: Phone - ${phone}, Entered Password - ${password}`);

        // Find the user in the database by phone
        const user = await Register.findOne({ phone: phone });

        if (user) {
            console.log(`User found: ${user}`);

            // Directly compare the entered password with the stored password (no bcrypt needed)
            const isMatch = password === user.password;

            console.log(`Stored Password: ${user.password}`);
            console.log(`Password comparison result: ${isMatch}`);

            if (isMatch) {
                console.log(`Successfully logged in with phone: ${phone}`);
                res.send('Login successful. Redirecting to the main page...');
                
               
            } else {
                console.log('Incorrect password attempt.');
                res.status(401).send('Incorrect phone number or password.');
            }
        } else {
            console.log('User not found');
            res.status(401).send('Incorrect phone number or password.');
        }
    } catch (err) {
        // Handle errors
        console.error('Error during login:', err);
        res.status(500).send('Server error');
    }
});

app.get('/forgot-password', (req, res) => {
    res.send('Forgot Password Page');
});

//puting in job in that
const jobput = [
    { 
        title: "Construction Worker", 
        Job_post_id:uuidv4(),
        description: "Work on various construction sites, including residential, commercial, and industrial projects. Responsibilities include site preparation, material handling, and assisting with the construction of structures.", 
        location: "Delhi",
        total_post:1100,
        salary: 15000 
    
    },
    { 
        title: "Gardener", 
        Job_post_id:uuidv4(),
        description: "Maintain gardens and landscapes by planting, watering, weeding, and fertilizing plants. Duties also include lawn mowing, pruning, and landscape design to ensure the aesthetic appeal of gardens and green spaces.", 
        location: "Mumbai", 
        total_post:200,
        salary: 12000 
    },
    { 
        title: "Factory Worker", 
        Job_post_id:uuidv4(),
        description: "Operate machinery in a factory setting to assemble, package, and inspect products. Responsibilities include maintaining equipment, following safety protocols, and ensuring high-quality production standards.", 
        location: "Chennai", 
        total_post:300,
        salary: 18000 

    },
    { 
        title: "Bridge Construction Worker", 
        Job_post_id:uuidv4(),
        description: "Assist in the construction and maintenance of bridges and overpasses. Tasks include operating heavy machinery, reinforcing structures, and collaborating with engineers to ensure structural integrity and safety.", 
        location: "Hazipur", 
        total_post:130,
        salary: 20000 
    },
    { 
        title: "Warehouse Manager", 
        Job_post_id:uuidv4(),
        description: "Oversee the daily operations of a warehouse, including inventory management, order fulfillment, and staff supervision. Ensure efficient workflow and adherence to safety and quality standards.", 
        location: "Kolkata", 
        total_post:500,
        salary: 25000 
    },
    { 
        title: "Delivery Driver", 
        Job_post_id:uuidv4(),
        description: "Transport goods and packages to various locations in a timely manner. Responsibilities include vehicle maintenance, route planning, and ensuring accurate delivery of items to customers.", 
        location: "Bangalore", 
        total_post:100,
        salary: 14000 
    },
    { 
        title: "Janitor", 
        Job_post_id:uuidv4(),
        description: "Perform cleaning and maintenance duties in various facilities such as offices, schools, and hospitals. Tasks include sweeping, mopping, trash removal, and ensuring a clean and hygienic environment.", 
        location: "Hyderabad", 
        total_post:120,
        salary: 11000 
    },
    { 
        title: "Electrician", 
        Job_post_id:uuidv4(),
        description: "Install, maintain, and repair electrical systems and wiring in residential and commercial buildings. Duties include troubleshooting electrical issues, ensuring compliance with safety codes, and performing routine inspections.", 
        location: "Pune", 
        total_post:720,
        salary: 22000 
    },
    { 
        title: "Plumber", 
        Job_post_id:uuidv4(),
        description: "Install and repair plumbing systems including pipes, fixtures, and appliances. Responsibilities include diagnosing plumbing issues, performing repairs, and ensuring systems are functioning correctly and efficiently.", 
        location: "Ahmedabad", 
        total_post:730,
        salary: 20000 
    },
    { 
        title: "Carpenter", 
        Job_post_id:uuidv4(),
        description: "Construct, install, and repair wooden structures and fixtures. Tasks include reading blueprints, measuring and cutting wood, and ensuring accurate and durable construction of furniture and building components.", 
        location: "Jaipur", 
        total_post:546,
        salary: 19000 
    }
];

// const language = {
//     en: { welcome: "Welcome", home: "Home", register: "Register", login: "Login", job: "Find Jobs", toggleLang: "Change Language", intro: "Find Your Ideal Job" },
//     hi: { welcome: "स्वागत है", home: "मुखपृष्ठ", register: "रजिस्टर", login: "लॉगिन", job: "नौकरियाँ खोजें", toggleLang: "भाषा बदलें", intro: "अपना आदर्श नौकरी खोजें" }
// };
//logic to finjob section
app.get('/findjob', (req, res) => {
    const lang = req.cookies.lang || 'en';
    const { 'job-title': jobTitle, location, salary } = req.query;

    let filteredJobs = jobput;

    if (jobTitle) {
        filteredJobs = filteredJobs.filter(job => job.title.toLowerCase().includes(jobTitle.toLowerCase()));
    }
    if (location) {
        filteredJobs = filteredJobs.filter(job => job.location.toLowerCase().includes(location.toLowerCase()));
    }
    if (salary) {
        filteredJobs = filteredJobs.filter(job => job.salary >= parseInt(salary));
    }

    res.render('findjob', { lang: language[lang], jobs: filteredJobs, language: language });
});

// Route for posting a job
app.post('/post-job', (req, res) => {
    const { title, location, salary, description } = req.body;
    jobput.push({ title, location, salary: parseInt(salary), description });
    res.redirect('/findjob');
});

// Route for applying to a job
app.post('/apply', (req, res) => {
    const { jobTitle, jobPostId, name, fatherName, dob, age, experience, phone, address, pincode, state, minimumSalary, availability } = req.body;

    // Log job and applicant details
    console.log(`Job Applied: ${jobTitle}`);
    console.log(`Job Post ID: ${jobPostId}`);
    console.log('Applicant Details:');
    console.log(`Name: ${name}`);
    console.log(`Father's Name: ${fatherName}`);
    console.log(`Date of Birth: ${dob}`);
    console.log(`Age: ${age}`);
    console.log(`Experience: ${experience}`);
    console.log(`Phone: ${phone}`);
    console.log(`Address: ${address}`);
    console.log(`Pincode: ${pincode}`);
    console.log(`State: ${state}`);
    console.log(`Expected Minimum Salary: ${minimumSalary}`);
    console.log(`Availability: ${availability}`);

    // Redirect or send a response
    // res.redirect('/findjob');
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
