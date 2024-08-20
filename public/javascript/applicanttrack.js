

document.getElementById('trackForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    document.getElementById('spinner').style.display = 'block'; // Show spinner
    document.getElementById('overlay').style.display = 'block'; // Show overlay

    const registrationNumber = document.getElementById('registrationNumber').value;

    // Clear previous error message and details
    document.getElementById('errorMessage').style.display = 'none';
    const previousDetails = document.querySelector('.details-container');
    if (previousDetails) {
        previousDetails.remove();
    }

    // Fetch data from the backend
    fetch(`/track?registrationNumber=${registrationNumber}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('spinner').style.display = 'none'; // Hide spinner
            document.getElementById('overlay').style.display = 'none'; // Hide overlay

            if (data && data.registrationId) {
                displayDetails(data);
            } else {
                showError('Invalid registration number. Please check and try again.');
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('spinner').style.display = 'none'; // Hide spinner
            document.getElementById('overlay').style.display = 'none'; // Hide overlay
            showError('An error occurred while fetching data.');
        });
});

function displayDetails(data) {
    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('details-container');
    detailsContainer.innerHTML = `
        <h3>Applicant Details</h3>
        <table>
            <tr><th>Job Title</th><td>${data.jobTitle}</td></tr>
            <tr><th>Job Post ID</th><td>${data.jobPostId}</td></tr>
            <tr><th>Employee ID</th><td>${data.employeeId}</td></tr>
            <tr><th>Registration ID</th><td>${data.registrationId}</td></tr>
            <tr><th>Name</th><td>${data.name}</td></tr>
            <tr><th>Father's Name</th><td>${data.fatherName}</td></tr>
            <tr><th>Date of Birth</th><td>${new Date(data.dob).toLocaleDateString()}</td></tr>
            <tr><th>Age</th><td>${data.age}</td></tr>
            <tr><th>Experience</th><td>${data.experience}</td></tr>
            <tr><th>Phone</th><td>${data.phone}</td></tr>
            <tr><th>Address</th><td>${data.address}</td></tr>
            <tr><th>Pincode</th><td>${data.pincode}</td></tr>
            <tr><th>State</th><td>${data.state}</td></tr>
            <tr><th>Minimum Salary</th><td>${data.minimumSalary}</td></tr>
            <tr><th>Availability</th><td>${data.availability}</td></tr>
            <tr><th>Applied At</th><td>${new Date(data.appliedAt).toLocaleString()}</td></tr>
        </table>
        <button onclick='downloadPDF(${JSON.stringify(data).replace(/'/g, "\\'").replace(/"/g, "&quot;")})'>Download Form</button>
    `;
    document.body.insertBefore(detailsContainer, document.querySelector('footer'));
}

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.innerText = message;
    errorMessage.style.display = 'block';
}

function downloadPDF(data) {
    // Check if jsPDF is loaded
    if (typeof window.jspdf === 'undefined') {
        console.error('jsPDF library is not loaded.');
        return;
    }

    // Destructure jsPDF from window.jspdf
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add the logo
    // Assuming logo is at '/images/trpzgarsetu.png'
    const logo = '/images/trpzgarsetu.png'; // Update this path to your actual logo
    doc.addImage(logo, 'PNG', 10, 10, 30, 15); // x, y, width, height

    // Set document title and details
    doc.setFontSize(16);
    doc.setFont('Arial', 'bold');
    doc.text('RozgarSetu - Registration Form', 50, 20); // Title centered

    // Add important text
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Important Note: Please ensure that all details are correct before submitting the form.', 10, 30);

    // Add form details
    let y = 45; // Starting position after header and logo
    const details = [
        `Job Title: ${data.jobTitle}`,
        `Job Post ID: ${data.jobPostId}`,
        `Employee ID: ${data.employeeId}`,
        `Registration ID: ${data.registrationId}`,
        `Name: ${data.name}`,
        `Father's Name: ${data.fatherName}`,
        `Date of Birth: ${new Date(data.dob).toLocaleDateString()}`,
        `Age: ${data.age}`,
        `Experience: ${data.experience}`,
        `Phone: ${data.phone}`,
        `Address: ${data.address}`,
        `Pincode: ${data.pincode}`,
        `State: ${data.state}`,
        `Minimum Salary: ${data.minimumSalary}`,
        `Availability: ${data.availability}`,
        `Applied At: ${new Date(data.appliedAt).toLocaleString()}`
    ];

    // Center the details in the middle of the page
    const pageWidth = doc.internal.pageSize.width;
    const textWidth = 180; // Width of the text area

    details.forEach(detail => {
        const x = (pageWidth - textWidth) / 2; // Center align text
        doc.text(detail, x, y);
        y += 10; // Move down for the next line
    });

    // Add signature area
    y += 20; // Add some space before signature area
    doc.setFontSize(12);
    doc.text('Signature:', 10, y); // Label for signature
    doc.line(30, y + 5, 100, y + 5); // Draw a line for the signature

    // Add signature text
    doc.setFontSize(10);
    doc.text('Nitin Kumar', 30, y + 12); // Signature name below the line

    // Save the PDF
    doc.save('registration-form.pdf');
}
