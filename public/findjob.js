document.addEventListener('DOMContentLoaded', () => {
    const applyButtons = document.querySelectorAll('.apply-btn'); // Selecting all apply buttons
    const modal = document.getElementById('apply-modal'); // Apply modal
    const closeModal = document.querySelector('.custom-close'); // Close button in the modal
    const applyForm = document.getElementById('apply-form'); // The form inside the modal
    const modalJobTitle = document.getElementById('modal-job-title'); // The element in the modal showing the job title
    const modalJobTitleField = document.getElementById('modal-job-title-field'); // Hidden input field for job title
    const modalCompanyNameField = document.getElementById('modal-company-name-field'); // Hidden input field for company name
    const modalJobJobIdField = document.getElementById('modal-job-jobid-field'); // Hidden input field for job ID
    const registrationIdField = document.getElementById('registration-id-field'); // Hidden input field for registration ID
    const successModal = document.getElementById('success-modal'); // Success modal
    const registrationIdDisplay = document.getElementById('registration-id-display'); // Element to display the registration ID in the success modal
    const closeSuccessModal = document.getElementById('close-success-modal'); // Close button in the success modal
    const downloadFormButton = document.getElementById('download-form'); // Button to download form

    // Function to generate a random registration ID
    const generateRegistrationId = () => {
        return 'REG-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    };

    // Event listener for each apply button
    applyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const jobTitle = e.target.dataset.jobTitle; // Getting job title from data attribute
            const companyName = e.target.dataset.jobCompanyName; // Getting company name from data attribute
            const jobJobId = e.target.dataset.jobJobid; // Getting job ID from data attribute

            // Check if the modal elements exist and are correctly fetched
            if (!modalJobTitle || !modalJobTitleField || !modalCompanyNameField || !modalJobJobIdField) {
                console.error('Modal elements are not properly set up in the DOM.');
                return;
            }

            // Set the values for the modal fields
            modalJobTitle.textContent = jobTitle;
            modalJobTitleField.value = jobTitle;
            modalCompanyNameField.value = companyName;
            modalJobJobIdField.value = jobJobId;
            registrationIdField.value = generateRegistrationId();

            // Display the modal
            modal.style.display = 'flex';
        });
    });

    // Close the modal when clicking the close button
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close the modal when clicking outside of it
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Form submission event listener
    applyForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Hide the apply form
        applyForm.style.display = 'none';

        // Fetch request to send the application data to the server
        fetch('/apply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jobTitle: applyForm['jobTitle'].value,
                companyName: applyForm['companyName'].value, // Send companyName in the POST request
                job_id: applyForm['job_id'].value, // Include job_id in the POST request
                employeeId: applyForm['employeeId'].value,
                registrationId: applyForm['registrationId'].value,
                name: applyForm['name'].value,
                fatherName: applyForm['fatherName'].value,
                dob: applyForm['dob'].value,
                age: applyForm['age'].value,
                experience: applyForm['experience'].value,
                phone: applyForm['phone'].value,
                address: applyForm['address'].value,
                pincode: applyForm['pincode'].value,
                state: applyForm['state'].value,
                minimumSalary: applyForm['minimumSalary'].value,
                availability: applyForm['availability'].value,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message); // 'Application successfully submitted'
            registrationIdDisplay.textContent = data.registrationId;
            modal.style.display = 'none'; // Close the application form modal
            successModal.style.display = 'flex'; // Show the success modal
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });

    // Close the success modal
    closeSuccessModal.addEventListener('click', () => {
        successModal.style.display = 'none';
    });

    // Close success modal by clicking outside of it
    window.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.style.display = 'none';
        }
    });

    // Handle download form button click (add actual download functionality as needed)
    downloadFormButton.addEventListener('click', () => {
        alert('Download form functionality goes here.');
    });

    document.querySelector('.custom-close-success').addEventListener('click', () => {
        successModal.style.display = 'none';
    });
});

// search functionlity
document.getElementById('detect-location').addEventListener('click', function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            // Fetch reverse geocoding details using latitude and longitude
            fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`)
                .then(response => response.json())
                .then(data => {
                    const city = data.city || data.locality || 'City not found';
                    const state = data.principalSubdivision || 'State not found';
                    const district = data.localityInfo.administrative[1]?.name || 'District not found';
                    
                    // Set the value of the location input field with city, state, and district
                    document.getElementById('location').value = `${city}, ${district}, ${state}`;

                    // Log the location details to the console for debugging
                    console.log('Detected Location:', { city, district, state });

                    // Display the detected location details in an enhanced way
                    document.getElementById('detected-location-display').innerHTML = `
                        <strong>Detected Location:</strong><br>
                        <strong>City:</strong> ${city}<br>
                       
                        <strong>State:</strong> ${state}
                    `;
                })
                .catch(error => {
                    console.error('Error detecting location:', error);
                    document.getElementById('detected-location-display').innerText = 'Error detecting location';
                });
        }, function (error) {
            console.error('Geolocation error:', error);
            document.getElementById('detected-location-display').innerText = 'Unable to retrieve your location';
        });
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});
