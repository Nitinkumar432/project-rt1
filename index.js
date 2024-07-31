const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Use cookie-parser
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
        details:"See details"
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
        details:"जानकारी देखें"
    }
};

// Sample job data
const jobs = [
    { title: "Construction Worker", description: "Work on various construction sites.", location: "Delhi" },
    { title: "Gardener", description: "Maintain gardens and landscapes.", location: "Mumbai" },
    { title: "Factory Worker", description: "Operate machinery in a factory.", location: "Chennai" }
];
const jobs2 = [
    { title: "Electrician", description: "Install and repair electrical systems.", location: "Delhi" },
    { title: "Plumber", description: "Fix and install plumbing systems.", location: "Mumbai" },
    { title: "Machine Operator", description: "Operate and maintain industrial machines.", location: "Chennai" }
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
    res.render('home.ejs', { lang: language[lang], jobs ,jobs2});
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
app.post('/register', (req, res) => {
    console.log('Register page accessed');
    res.send("Register page is open");
});

app.get('/login', (req, res) => {
    console.log('Login page accessed');
    res.send("Login page is open");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
