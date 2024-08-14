const button = document.getElementById('starButton');
let counter = 231000;

button.addEventListener("click", star, {once:true});

function star() {
    counter++;
    const starCountElement = document.getElementById('starCount');
    
    // Update the star count display
    if (counter >= 1000) {
        starCountElement.textContent = (counter / 1000).toFixed(1) + 'k';
    } else {
        starCountElement.textContent = counter;
    }
}
