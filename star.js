const button = document.getElementById('starButton');
const starCountElement = document.getElementById('starCount');

// Retrieve the count from localStorage or set to 231k if it doesn't exist
let counter = localStorage.getItem('starCount') ? parseInt(localStorage.getItem('starCount')) : 231000;

// Update the display when the page loads
updateStarDisplay();

button.addEventListener("click", star, {once:true});

function star() {
    counter++;
    localStorage.setItem('starCount', counter);
    updateStarDisplay();
}

function updateStarDisplay() {
    if (counter >= 1000) {
        starCountElement.textContent = (counter / 1000).toFixed(1) + 'k';
    } else {
        starCountElement.textContent = counter;
    }
}
