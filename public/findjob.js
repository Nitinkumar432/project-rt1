document.addEventListener('DOMContentLoaded', () => {
    const applyButtons = document.querySelectorAll('.apply-btn');
    const modal = document.getElementById('apply-modal');
    const closeModal = document.querySelector('.custom-close');
    const applyForm = document.getElementById('apply-form');
    const modalJobTitle = document.getElementById('modal-job-title');
    const modalJobTitleField = document.getElementById('modal-job-title-field');
    const modalJobIdField = document.getElementById('modal-job-id-field');
    const registrationIdField = document.getElementById('registration-id-field');
    const successModal = document.getElementById('success-modal');
    const registrationIdDisplay = document.getElementById('registration-id-display');
    const closeSuccessModal = document.getElementById('close-success-modal');
    const downloadFormButton = document.getElementById('download-form');

    // Function to generate a random registration ID
    const generateRegistrationId = () => {
        return 'REG-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    };

    applyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const jobTitle = e.target.dataset.jobTitle;
            const jobId = e.target.dataset.jobId;
            modalJobTitle.textContent = jobTitle;
            modalJobTitleField.value = jobTitle;
            modalJobIdField.value = jobId;
            registrationIdField.value = generateRegistrationId();
            modal.style.display = 'flex';
        });
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    applyForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Hide the apply form
        applyForm.style.display = 'none';

        fetch('/apply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jobTitle: applyForm['jobTitle'].value,
                jobPostId: applyForm['jobPostId'].value,
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

    // Download form button (you would implement the actual download functionality here)
    downloadFormButton.addEventListener('click', () => {
        alert('Download form functionality goes here.');
    });

    // Close success modal by clicking outside of it
    window.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.style.display = 'none';
        }
    });

    document.querySelector('.custom-close-success').addEventListener('click', () => {
        successModal.style.display = 'none';
    });
});