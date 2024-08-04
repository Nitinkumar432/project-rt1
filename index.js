const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const port = 3000;

const language = {
    en: {
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
    { title: "Construction Worker", description: "Work on various construction sites.", location: "Delhi" },
    { title: "Gardener", description: "Maintain gardens and landscapes.", location: "Mumbai" },
    { title: "Factory Worker", description: "Operate machinery in a factory.", location: "Chennai" },
    { title: "Bridge Construction", description: "Operate machinery.", location: "Hazipur" }
];
const jobs2 = [
    { title: "Electrician", description: "Install and repair electrical systems.", location: "Delhi" },
    { title: "Plumber", description: "Fix and install plumbing systems.", location: "Mumbai" },
    { title: "Machine Operator", description: "Operate and maintain industrial machines.", location: "Chennai" },
    { title: "Laptop Repair ", description: "Operate and maintain Laptop  parts.", location: "patna" }
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
app.post('/register', (req, res) => {
    console.log('Form submitted');
    console.log('Form Data:', req.body); // Print the submitted form data to console
    res.send('Form submitted successfully'); // Respond to the client
});

// app.get('/login', (req, res) => {
//     console.log('Login page accessed');
  

//     res.render('login.ejs');
// });
app.post('/login', (req, res) => {
    const { phone, password } = req.body;
    console.log(`Login With ${phone} and password is ${password}`);
    // Here, you would handle the login logic, like checking the credentials
    res.send(`Logged in with phone: ${phone} and password: ${password}`);
});

app.get('/forgot-password', (req, res) => {
    res.send('Forgot Password Page');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
