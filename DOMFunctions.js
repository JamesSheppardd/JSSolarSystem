const mouseXEl = document.getElementById('mouseX');
const mouseYEl = document.getElementById('mouseY');
const selectedEl = document.getElementById('selected');
const gFormEl = document.getElementById('G-form');
const editBtnEl = document.getElementById('edit-btn');
const editDivEl = document.getElementById('edit-div');
// Modal to add new body
const newBodyModal = document.getElementsByClassName('modal')[0];
const newModalSubmitEl = document.getElementById("modal__body-submit");
const newModalDiscardEl = document.getElementById("modal__body-discard");
const modalElements = 6;    // How many elements are in such as name, mass etc
let newModalProps = [];
// hex values
const hexValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

let canCreateBody = false;
// New canvas
let editCanvas, editCtx;

let frameR = 60;

// DOM tasks
gFormEl.addEventListener("submit", (e) => {
    e.preventDefault();
    G = e.target[0].valueAsNumber;
});
document.addEventListener('keydown', (e) => {
    switch(e.key.toLowerCase()){
        case 'escape':
            e.preventDefault();
            selectedPlanetRef = null;
            break;
    }
});

newBodyModal.addEventListener('submit', (e) => {
    e.preventDefault();
})

newModalSubmitEl.addEventListener('click', (e) => {
    e.preventDefault();
    newModalProps = [];
    for(let i = 0; i < modalElements; i++){
        // 0 is name, 1 is type, 2 is mass,
        // 3 is radius, 4 is colour picker,
        // 5 is random colour
        newModalProps.push(e.target.form[i].value)
        if(i === 5 && e.target.form[i].checked){
            console.log("Random colour");
            // generate a random colour
            const randCol = randomColour();
            newModalProps[i-1] = randCol;
        }
    }
    newModalProps[2] = parseInt(newModalProps[2])
    newModalProps[3] = parseInt(newModalProps[3])
})