const { v4: uuidv4 } = require('uuid');

const jobs = [
    { title: "Construction Worker",job_id:1234, description: "Work on various construction sites.", location: "Delhi",companyName:"Hrtc ltd"  },
    { title: "Gardener", job_id:1234 , description: "Maintain gardens and landscapes.", location: "Mumbai",companyName:"Hrtc ltd"  },
    { title: "Factory Worker", job_id:1234,description: "Operate machinery in a factory.", location: "Chennai",companyName:"Hrtc ltd"  },
    { title: "Bridge Construction", job_id:1234,description: "Operate machinery.", location: "Hazipur",companyName:"Hrtc ltd"  }
];

module.exports=jobs;