const { v4: uuidv4 } = require('uuid');
const jobs = [
    { title: "Construction Worker", description: "Work on various construction sites.", location: "Delhi",Job_post_id:uuidv4()  },
    { title: "Gardener", description: "Maintain gardens and landscapes.", location: "Mumbai",Job_post_id:uuidv4() },
    { title: "Factory Worker", description: "Operate machinery in a factory.", location: "Chennai",Job_post_id:uuidv4() },
    { title: "Bridge Construction", description: "Operate machinery.", location: "Hazipur",Job_post_id:uuidv4() }
];
module.exports=jobs;