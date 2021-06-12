let sun, numPlanets = 3, destabilise = 0.2, selectedPlanetRef, selectedPlanet;
let planets = [], planetNames = ['Venus', 'Mercury', 'Earth', 'Mars', 'Saturn', 'Jupiter', 'Neptune', 'Uranus']
let G = 6.67430 * Math.pow(10, -28.5);

const moons = []

const planetInfoBoardNameEl = document.getElementById('planet-info-board__name');
const planetInfoBoardEl = document.getElementsByClassName('planet-info-board');

let newModalClickPos;

let bgStars;
let currMouseX, currMouseY;
function setup(){
    createCanvas(windowWidth,windowHeight);
    frameRate(60);
    bgStars = new WhiteNoise(75);
    bgStars.generate(true)
    
    // Instantiate bodies
    sun = new Body("Sun", "Star", 1.989 * pow(10, 30), 50, createVector(0), createVector(0,0), 0, 100, 'Yellow', 0)

    for(let i = 0; i < numPlanets; i++){
        const newPlanet = planetSetup();
        planets.push(new Body(newPlanet.name, "Planet", newPlanet.mass, newPlanet.radius, newPlanet.pos, newPlanet.vel, newPlanet.t, newPlanet.g, newPlanet.colour, newPlanet.r, moons));
    }
    const newPlanet = planetSetup();
    const newMoon = planetSetup();
    moons.push(new Body("moon", "Moon", newMoon.mass, newMoon.radius, newMoon.pos, newMoon.vel, newMoon.t, newMoon.g, newMoon.colour, newMoon.r))
    planets.push(new Body("moonplanet", "Planet", newPlanet.mass, newPlanet.radius, newPlanet.pos, newPlanet.vel, newPlanet.t, newPlanet.g, newPlanet.colour, newPlanet.r, moons))
}

function draw() {
    translate(width/2, height/2);
    background(0);
    // Assign translated mouse positions
    currMouseX = -width/2 + mouseX;
    currMouseY = -height/2 + mouseY;

    bgStars.show();
    // Display the bodies
    sun.show();
    // All planets
    for(let i = 0; i < planets.length; i++){
        planets[i].show();
        planets[i].update();
        sun.attract(planets[i]);
        planets[i].attract(moons[0]);
    }
    
    //moons[0].show();
    //moons[0].update();

    // text
    if(devMode){
        mouseXEl.innerHTML = `x: ${currMouseX}`;
        mouseYEl.innerHTML = `y: ${currMouseY}`;
        selectedEl.innerHTML = `selected: ${selectedPlanet}`;
    }else{
        mouseXEl.innerHTML = ``;
        mouseYEl.innerHTML = ``;
        selectedEl.innerHTML = ``;
        gFormEl.innerHTML = '';
    }
    SelectedPlanetText(selectedPlanetRef);
    DrawInfoPanel();
}

// edit button
editBtnEl.addEventListener('click', () => {
    if(frameR == 60){
        frameR = 0;
        edit();
        frameRate(0);
    } else{
        frameR = 60;
        hideEdit();
        frameRate(60);
    }
});

// Open new body modal
document.addEventListener('click', (e) => {
    if(frameR === 0 && canCreateBody){
        newBodyModal.style.display = 'block';
        newModalClickPos = {'x': -width/2 + e.x, 'y': -height/2 + e.y};
        canCreateBody = false;
    }
})
// Hide modal when click outside it
document.addEventListener('click', (e) => {
    if(e.target === newBodyModal){
        hideEdit();
    }
})

newModalSubmitEl.addEventListener('click', (e) => {
    // Check if a planet with that name already exists
    const planetNames = planets.map((currVal, ind) => currVal.name);
    const namesAlreadyUsed = planetNames.includes(newModalProps[0]);
    if(!namesAlreadyUsed)
    {
        const newPlanet = newPlanetSetup(newModalClickPos);
        planets.push( new Body(newModalProps[0], 'Planet', newModalProps[2] * Math.pow(10,24), newModalProps[3], newPlanet.pos, newPlanet.vel, newPlanet.t, newPlanet.g, newModalProps[4], newPlanet.distToSun) )
        hideEdit();
    } else {
        newModalSubmitEl.value = 'Name already in use';
        newModalSubmitEl.style.backgroundColor = '#B22222'
    }
})
newModalDiscardEl.addEventListener('click', (e) => {
    hideEdit();
})