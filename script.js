let clickCount = 0;

const button = document.getElementById('myButton');
const messageElement = document.getElementById('message');
const clickCountElement = document.getElementById('clickCount');

// Array of fun messages to display
const messages = [
    'Great job! 🎉',
    'You clicked it! 👏',
    'Nice one! ⭐',
    'Keep going! 🚀',
    'You\'re awesome! 💪',
    'Fantastic! 🌟',
    'Excellent work! ✨',
    'Love the enthusiasm! 💖'
];

button.addEventListener('click', function() {
    clickCount++;
    
    // Update click counter
    clickCountElement.textContent = `Clicks: ${clickCount}`;
    
    // Display a random message
    const randomIndex = Math.floor(Math.random() * messages.length);
    messageElement.textContent = messages[randomIndex];
    
    // Add a fun animation effect
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 100);
});

// Optional: Log to console for debugging
console.log('Button app loaded successfully!');
