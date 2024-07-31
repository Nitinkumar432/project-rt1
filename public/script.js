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

