const { v4: uuidv4 } = require('uuid');
const jobs2 = [
    { title: "Electrician", description: "Install and repair electrical systems.", location: "Delhi" ,Job_post_id:uuidv4()},
    { title: "Plumber", description: "Fix and install plumbing systems.", location: "Mumbai",Job_post_id:uuidv4() },
    { title: "Machine Operator", description: "Operate and maintain industrial machines.", location: "Chennai" ,Job_post_id:uuidv4()},
    { title: "Laptop Repair ", description: "Operate and maintain Laptop  parts.", location: "patna",Job_post_id:uuidv4() }
];
module.exports=jobs2;