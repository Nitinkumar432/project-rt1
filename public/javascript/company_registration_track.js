document.getElementById('reference-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const referenceNumber = document.getElementById('reference-number').value;
    const spinnerOverlay = document.getElementById('spinner-overlay');
    const result = document.getElementById('result');

    // Show the spinner overlay
    spinnerOverlay.style.display = 'flex';
    result.textContent = '';

    try {
        // Send the reference number to the backend via a POST request
        const response = await fetch('/api/track_reference', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ referenceNumber }),
        });

        const data = await response.json();

        // Hide the spinner overlay
        spinnerOverlay.style.display = 'none';

        if (response.ok) {
            // Display company details if the reference number is valid
            result.innerHTML = `
                <h3>Company Details</h3>
                <p><strong>Company Name:</strong> ${data.companyName}</p>
                <p><strong>Contact Email:</strong> ${data.contactEmail}</p>
                <p><strong>Contact Phone:</strong> ${data.contactPhone}</p>
                <p><strong>Company Address:</strong> ${data.companyAddress}</p>
                <p class="${data.isVerified ? 'approved' : 'under-review'}">
                    ${data.isVerified ? 'Approved' : 'Under Review'}
                </p>
            `;
        } else {
            // Display an error message if the reference number is invalid
            result.innerHTML = `<p class="error">Your reference number is invalid!</p>`;
        }
    } catch (error) {
        console.error('Error:', error);
        result.innerHTML = `<p class="error">An error occurred while tracking the reference number.</p>`;
        spinnerOverlay.style.display = 'none';
    }
});
