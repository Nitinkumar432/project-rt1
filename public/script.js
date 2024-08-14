
document.addEventListener('DOMContentLoaded', () => {
    const images = [
        'https://labour.gov.in/sites/default/files/imagee.png',
        'https://labour.gov.in/sites/default/files/g20_2nd_ews_brasilia.jpg',
        'https://cbpssubscriber.mygov.in/assets/uploads/juGajmc1gOVBUtt5?61'
    ];

    let currentImageIndex = 0;
    const heroSection = document.querySelector('.hero-section');

    function changeImage() {
        heroSection.style.backgroundImage = `url('${images[currentImageIndex]}')`;
        currentImageIndex = (currentImageIndex + 1) % images.length;
    }

    // Initial image load
    changeImage();
    
    // Change image every 5 seconds
    setInterval(changeImage, 5000);
//language change
document.getElementById('toggleLangBtn').addEventListener('click', () => {
    const currentLang = document.documentElement.lang;
    const newLang = currentLang === 'en' ? 'hi' : 'en';
    window.location.href = `/change-language?lang=${newLang}`;
});

//job search
document.getElementById('jobSearchBtn').addEventListener('click', () => {
    const query = document.getElementById('jobSearchInput').value.toLowerCase();
    const jobCards = document.querySelectorAll('.job-card');
    jobCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        if (title.includes(query) || description.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

   
    // Chatbot functionality
    document.getElementById('openChat').addEventListener('click', () => {
        document.querySelector('.chat-widget').style.display = 'block';
        document.getElementById('openChat').style.display = 'none';
    });

    document.getElementById('closeChat').addEventListener('click', () => {
        document.querySelector('.chat-widget').style.display = 'none';
        document.getElementById('openChat').style.display = 'block';
    });

    document.getElementById('sendChat').addEventListener('click', () => {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value;
        if (message.trim() !== "") {
            const chatBody = document.getElementById('chatBody');

            // Append user message
            const userMessage = document.createElement('div');
            userMessage.className = 'message user-message';
            userMessage.textContent = message;
            chatBody.appendChild(userMessage);

            // Clear the input field
            chatInput.value = '';

            // Scroll to the bottom
            chatBody.scrollTop = chatBody.scrollHeight;

            // Append chatbot response after a short delay
            setTimeout(() => {
                const botMessage = document.createElement('div');
                botMessage.className = 'message bot-message';
                botMessage.textContent = "Thank you for visiting us! How can I help you?";
                chatBody.appendChild(botMessage);
                chatBody.scrollTop = chatBody.scrollHeight;
            }, 500); // Adjust the delay if needed
        }
    });
});



//term and conditions

document.addEventListener('DOMContentLoaded', (event) => {
    // Check if the modal should be shown
    if (!sessionStorage.getItem('laborModalShown')) {
        setTimeout(() => {
            document.getElementById('laborTermsModal').style.display = 'block';
        }, 5000); // 5 seconds delay
    }

    // Close button functionality
    document.querySelector('.labor-close-btn').addEventListener('click', () => {
        document.getElementById('laborTermsModal').style.display = 'none';
    });

    // Checkbox functionality
    const agreeCheckbox = document.getElementById('laborAgreeCheckbox');
    const submitBtn = document.getElementById('laborSubmitBtn');

    agreeCheckbox.addEventListener('change', () => {
        submitBtn.disabled = !agreeCheckbox.checked;
    });

    // Handle form submission
    submitBtn.addEventListener('click', () => {
        // Set flag in session storage to prevent showing the modal again
        sessionStorage.setItem('laborModalShown', 'true');
        document.getElementById('laborTermsModal').style.display = 'none';
    });
});


//breaking news section
document.addEventListener('DOMContentLoaded', () => {
    const ticker = document.getElementById('ticker');

    ticker.addEventListener('mouseover', () => {
        ticker.style.animationPlayState = 'paused'; // Pause animation on hover
    });

    ticker.addEventListener('mouseout', () => {
        ticker.style.animationPlayState = 'running'; // Resume animation when mouse leaves
    });
});


//login model
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("loginModalUnique");
    const btn = document.getElementById("loginBtnUnique");
    const span = document.getElementsByClassName("close-unique")[0];
    const form = document.getElementById("loginFormUnique");
    const phoneNumber = document.getElementById("phoneNumberUnique");
    const password = document.getElementById("passwordUnique");

    // Show the modal
    btn.onclick = function(event) {
        event.preventDefault();
        modal.style.display = "block";
        modal.classList.add("show");
        history.pushState(null, null, '/login'); // Change the URL
    }

    // Close the modal
    span.onclick = function() {
        modal.style.display = "none";
        modal.classList.remove("show");
        history.pushState(null, null, '/'); // Revert the URL back
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
            modal.classList.remove("show");
            history.pushState(null, null, '/'); // Revert the URL back
        }
    }

    // Validate form before submission
    form.onsubmit = function(event) {
        if (phoneNumber.value.trim() === "" || password.value.trim() === "") {
            event.preventDefault();
            alert("Please enter both phone number and password.");
        }
    }
});


//logic of apply job
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
// job apply spinner

// login notification after login

//dropdown toggle of given phone number
document.addEventListener('DOMContentLoaded', function () {
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    dropdownToggle.addEventListener('click', function (e) {
        e.preventDefault();
        dropdownMenu.classList.toggle('show');
    });

    document.addEventListener('click', function (e) {
        if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove('show');
        }
    });
});
// login spinner model
document.getElementById('loginFormUnique').addEventListener('submit', function(event) {
    // Show the spinner overlay
    document.getElementById('spinnerOverlay').style.display = 'flex';
});
// header spinner model
// register model
// Get the modal and spinner elements
var modal = document.getElementById("register-modal");
var spinnerOverlay = document.getElementById("custom-spinner-overlay");
var btn = document.getElementById("register-link");
var closeBtn = document.getElementsByClassName("modal-enhanced-close")[0];

// When the user clicks on the button/link, show the spinner and then the modal
btn.onclick = function() {
    spinnerOverlay.style.display = "block"; // Show the spinner overlay
    setTimeout(function() {
        spinnerOverlay.style.display = "none"; // Hide the spinner
        modal.style.display = "block"; // Show the modal
    }, 1500); // Delay to simulate loading (1.5 seconds)
}

// When the user clicks on <span> (x), close the modal
closeBtn.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
