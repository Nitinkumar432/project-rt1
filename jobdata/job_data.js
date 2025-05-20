const { v4: uuidv4 } = require('uuid');

const jobput = [
    { 
        title: "Construction Worker", 
        companyName: "Larsen & Toubro Ltd.", // Realistic company name
        job_id: 1, // Numerical job_id
        description: "Work on various construction sites, including residential, commercial, and industrial projects. Responsibilities include site preparation, material handling, and assisting with the construction of structures.", 
        location: "Delhi",
        total_post: 1100,
        salary: 15000 
    },
    { 
        title: "Gardener", 
        companyName: "Godrej & Boyce Mfg. Co. Ltd.", // Realistic company name
        job_id: 2, // Numerical job_id
        description: "Maintain gardens and landscapes by planting, watering, weeding, and fertilizing plants. Duties also include lawn mowing, pruning, and landscape design to ensure the aesthetic appeal of gardens and green spaces.", 
        location: "Mumbai", 
        total_post: 200,
        salary: 12000 
    },
    { 
        title: "Factory Worker", 
        companyName: "Tata Steel Limited", // Realistic company name
        job_id: 3, // Numerical job_id
        description: "Operate machinery in a factory setting to assemble, package, and inspect products. Responsibilities include maintaining equipment, following safety protocols, and ensuring high-quality production standards.", 
        location: "Chennai", 
        total_post: 300,
        salary: 18000 
    },
    { 
        title: "Bridge Construction Worker", 
        companyName: "Gammon India Ltd.", // Realistic company name
        job_id: 4, // Numerical job_id
        description: "Assist in the construction and maintenance of bridges and overpasses. Tasks include operating heavy machinery, reinforcing structures, and collaborating with engineers to ensure structural integrity and safety.", 
        location: "Hazipur", 
        total_post: 130,
        salary: 20000 
    },
    { 
        title: "Warehouse Manager", 
        companyName: "Amazon India", // Realistic company name
        job_id: 5, // Numerical job_id
        description: "Oversee the daily operations of a warehouse, including inventory management, order fulfillment, and staff supervision. Ensure efficient workflow and adherence to safety and quality standards.", 
        location: "Kolkata", 
        total_post: 500,
        salary: 25000 
    },
    { 
        title: "Delivery Driver", 
        companyName: "Flipkart Pvt. Ltd.", // Realistic company name
        job_id: 6, // Numerical job_id
        description: "Transport goods and packages to various locations in a timely manner. Responsibilities include vehicle maintenance, route planning, and ensuring accurate delivery of items to customers.", 
        location: "Bangalore", 
        total_post: 100,
        salary: 14000 
    },
    { 
        title: "Janitor", 
        companyName: "ISS Facility Services India", // Realistic company name
        job_id: 7, // Numerical job_id
        description: "Perform cleaning and maintenance duties in various facilities such as offices, schools, and hospitals. Tasks include sweeping, mopping, trash removal, and ensuring a clean and hygienic environment.", 
        location: "Hyderabad", 
        total_post: 120,
        salary: 11000 
    },
    { 
        title: "Electrician", 
        companyName: "Schneider Electric India", // Realistic company name
        job_id: 8, // Numerical job_id
        description: "Install, maintain, and repair electrical systems and wiring in residential and commercial buildings. Duties include troubleshooting electrical issues, ensuring compliance with safety codes, and performing routine inspections.", 
        location: "Pune", 
        total_post: 720,
        salary: 22000 
    },
    { 
        title: "Plumber", 
        companyName: "Asian Paints Ltd.", // Realistic company name
        job_id: 9, // Numerical job_id
        description: "Install and repair plumbing systems including pipes, fixtures, and appliances. Responsibilities include diagnosing plumbing issues, performing repairs, and ensuring systems are functioning correctly and efficiently.", 
        location: "Ahmedabad", 
        total_post: 730,
        salary: 20000 
    },
    { 
        title: "Carpenter", 
        companyName: "Godrej Interio", // Realistic company name
        job_id: 10, // Numerical job_id
        description: "Construct, install, and repair wooden structures and fixtures. Tasks include reading blueprints, measuring and cutting wood, and ensuring accurate and durable construction of furniture and building components.", 
        location: "Jaipur", 
        total_post: 546,
        salary: 19000 
    }
];

module.exports = jobput;