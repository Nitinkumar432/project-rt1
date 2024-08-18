document.addEventListener('DOMContentLoaded', function() {
    const changePasswordLink = document.querySelector('.unique-change-password-link');
    const popupOverlay = document.getElementById('unique-popup-overlay');
    const popupClose = document.getElementById('unique-popup-close');
    const changePasswordForm = document.getElementById('unique-change-password-form');
    const errorMessage = document.getElementById('error-message');
    const successPopupOverlay = document.getElementById('success-popup-overlay');
    const successPopupClose = document.getElementById('success-popup-close');
    const spinner = document.getElementById('spinner');

    changePasswordLink.addEventListener('click', function(event) {
        event.preventDefault();
        popupOverlay.style.display = 'block';
    });

    popupClose.addEventListener('click', function() {
        popupOverlay.style.display = 'none';
    });

    // Close the pop-up if the user clicks outside of the pop-up content
    window.addEventListener('click', function(event) {
        if (event.target === popupOverlay) {
            popupOverlay.style.display = 'none';
        }
    });

    // Handle form submission
    changePasswordForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        // Clear previous messages
        errorMessage.style.display = 'none';
        spinner.style.display = 'block';  // Show spinner

        const formData = new FormData(changePasswordForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.status === 200) {
                // Hide the change password popup
                popupOverlay.style.display = 'none';

                // Show the success popup
                successPopupOverlay.style.display = 'block';
                changePasswordForm.reset();  // Reset the form
            } else {
                errorMessage.textContent = result.error || 'An error occurred.';
                errorMessage.style.display = 'block';

                // Highlight the current password field in red if it's incorrect
                if (result.error === 'Incorrect current password') {
                    document.getElementById('current-password').style.borderColor = 'red';
                }
            }
        } catch (error) {
            console.error('Error:', error);
            errorMessage.textContent = 'An unexpected error occurred.';
            errorMessage.style.display = 'block';
        } finally {
            spinner.style.display = 'none';  // Hide spinner
        }
    });

    // Close the success popup when clicking the close button
    successPopupClose.addEventListener('click', function() {
        successPopupOverlay.style.display = 'none';
    });

    // Close the success popup if the user clicks outside of the popup content
    window.addEventListener('click', function(event) {
        if (event.target === successPopupOverlay) {
            successPopupOverlay.style.display = 'none';
        }
    });
});
