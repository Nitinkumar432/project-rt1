document.addEventListener('DOMContentLoaded', () => {
    const applyButtons = document.querySelectorAll('.apply-btn');
    const modal = document.getElementById('apply-modal');
    const closeModal = document.querySelector('.custom-close');
    const applyForm = document.getElementById('apply-form');
    const modalJobTitle = document.getElementById('modal-job-title');
    const modalJobTitleField = document.getElementById('modal-job-title-field');
    const modalJobIdField = document.getElementById('modal-job-id-field');

    applyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const jobTitle = e.target.dataset.jobTitle;
            const jobId = e.target.dataset.jobId;
            modalJobTitle.textContent = jobTitle;
            modalJobTitleField.value = jobTitle;
            modalJobIdField.value = jobId;
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
        console.log('Applied for job:', applyForm['jobTitle'].value);
        console.log('Job Post ID:', applyForm['jobPostId'].value); // Log the job_post_id
        console.log('Applicant Details:');
        console.log(`Name: ${applyForm['name'].value}`);
        console.log(`Father's Name: ${applyForm['fatherName'].value}`);
        console.log(`Age: ${applyForm['age'].value}`);
        console.log(`Experience: ${applyForm['experience'].value}`);
        console.log(`Phone: ${applyForm['phone'].value}`);
        console.log(`Address: ${applyForm['address'].value}`);
        console.log(`Pincode: ${applyForm['pincode'].value}`);
        console.log(`State: ${applyForm['state'].value}`);
        console.log(`Minimum Salary: ${applyForm['minimumSalary'].value}`);
        console.log(`Availability: ${applyForm['availability'].value}`);
        modal.style.display = 'none';
        applyForm.submit();
    });
});
