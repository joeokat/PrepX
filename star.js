const button = document.getElementById('starButton')
let counter = 800

button.addEventListener("click", star, {once:true})

function star(){
    counter++;
}