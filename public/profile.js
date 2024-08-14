// JavaScript to handle the pop-up functionality

document.addEventListener('DOMContentLoaded', function() {
    const changePasswordLink = document.querySelector('.unique-change-password-link');
    const popupOverlay = document.getElementById('unique-popup-overlay');
    const popupClose = document.getElementById('unique-popup-close');

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
});
