
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
    const modal = document.getElementById("uniqueLoginModal");
    const btn = document.getElementById("uniqueLoginLink");
    const span = document.getElementsByClassName("custom-close")[0];
    const form = document.getElementById("uniqueLoginForm");
    const phoneNumber = document.getElementById("phoneNumber");
    const password = document.getElementById("password");

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
