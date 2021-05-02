let sun, numPlanets = 3, destabilise = 0.2, selectedPlanetRef, selectedPlanet;
let planets = [], planetNames = ['Venus', 'Mercury', 'Earth', 'Mars', 'Saturn', 'Jupiter', 'Neptune', 'Uranus']
let G = 6.67430 * Math.pow(10, -28.5);


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
        planets.push(new Body(newPlanet.name, "Planet", newPlanet.mass, newPlanet.radius, newPlanet.pos, newPlanet.vel, newPlanet.t, newPlanet.g, newPlanet.colour, newPlanet.r));
    }
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
    }
    // text
    mouseXEl.innerHTML = `x: ${currMouseX}`;
    mouseYEl.innerHTML = `y: ${currMouseY}`;
    selectedEl.innerHTML = `selected: ${selectedPlanet}`;
    SelectedPlanetText(selectedPlanetRef);
    DrawInfoPanel();
}

// Celestial body class
class Body {
    constructor(_name, _type, _mass, _r, _pos, _vel, _T, _gfs, _col, _rToSun){
        this.name = _name;
        this.type = _type;
        this.mass = _mass;
        this.pos = _pos;
        this.vel = _vel;
        this.r = _r;
        this.t = _T;
        this.gfs = _gfs;
        this.col = _col;
        this.colRef = _col;
        this.path = [];
        this.rToSun = _rToSun;
    }
    show() {
        stroke(this.col);
        for(let i = 0; i < this.path.length - 2; i++){
            line(this.path[i].x, this.path[i].y, this.path[i+1].x, this.path[i+1].y);
        }
        noStroke();
        fill(this.col);
        ellipse(this.pos.x, this.pos.y, this.r, this.r);
        
    }

    update() {
        // update position
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        // add pos to path
        this.path.push(this.pos.copy());
        if(this.path.length > 100) {
            this.path.splice(0, 1);     // Keep path at constant length
        }

        this.rToSun = this.pos.mag() - sun.pos.mag();

        // mouse over
        if((currMouseX > this.pos.x - this.r) && (currMouseX < this.pos.x + this.r) && (currMouseY > this.pos.y - this.r) && (currMouseY < this.pos.y + this.r) && mouseIsPressed){
            selectedPlanetRef = this;
        }

        if(selectedPlanetRef?.name === this.name) {
            this.col = `#0064FF`;
        } else {
            this.col = this.colRef;
        }
    }

    applyForce(f){
        this.vel.x += f.x / this.mass // a = f/m
        this.vel.y += f.y / this.mass // a = f/m
    }

    attract(child){
        let r = dist(this.pos.x, this.pos.y, child.pos.x, child.pos.y); // Get distance - r - between child and parent
        let f = this.pos.copy().sub(child.pos); // Point the f force from the child to parent
        f.setMag(G * (this.mass * child.mass) / (r * r));   // Using F = G * m1*m2 / r*r
        child.gfs = f.mag() / child.mass * 100;
        child.applyForce(f);
    }
    
}



const SelectedPlanetText = (planet) => {
    if(selectedPlanetRef ) {
        selectedPlanet = `${planet.name} at x:${planet.pos.x.toFixed(1)}, y: ${planet.pos.y.toFixed(1)}`
    }
}

const DrawInfoPanel = () => {
    if(selectedPlanetRef) {
        stroke('white');
        line(selectedPlanetRef.pos.x, selectedPlanetRef.pos.y, selectedPlanetRef.pos.x + 50, selectedPlanetRef.pos.y - 30);
        const lineLength = selectedPlanetRef.name.split('').length * 25;
        line(selectedPlanetRef.pos.x + 50, selectedPlanetRef.pos.y - 30, selectedPlanetRef.pos.x + 50 + lineLength, selectedPlanetRef.pos.y - 30);
        
        // Text
        planetInfoBoardEl[0].setAttribute('style', `position: absolute; top: ${height/2 + (selectedPlanetRef.pos.y - 50)}px; left: ${width/2 + (selectedPlanetRef.pos.x + 56)}px;`)
        planetInfoBoardEl[1].innerHTML = selectedPlanetRef.name;
        planetInfoBoardEl[2].innerHTML = `${selectedPlanetRef.name} is currently ${selectedPlanetRef.rToSun.toFixed(2)} away from the sun`
        planetInfoBoardEl[3].innerHTML = `Speed: ${selectedPlanetRef.vel.mag().toFixed(2)}`;
        planetInfoBoardEl[4].innerHTML = `Mass: ${selectedPlanetRef.mass.toFixed(2)}kg`;
        planetInfoBoardEl[5].innerHTML = `Year length: ${selectedPlanetRef.t.toFixed(2)} Earth days`;
        planetInfoBoardEl[6].innerHTML = `GFS: ${selectedPlanetRef.gfs.toFixed(3)}`;
        for(let i = 1; i < planetInfoBoardEl.length; i++ ){
            planetInfoBoardEl[i].setAttribute('style', 'visibility: shown;')
        }
    } else{
        for(let i = 0; i < planetInfoBoardEl.length; i++ ){
            planetInfoBoardEl[i].setAttribute('style', 'visibility: hidden; position: absolute; ')
        }
    }
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

// CLEAN UP
document.addEventListener('click', (e) => {
    if(frameR === 0 && canCreateBody){
        newBodyModal.style.display = 'block';
        newModalClickPos = {'x': -width/2 + e.x, 'y': -height/2 + e.y};
        canCreateBody = false;
    }
    
    
})

document.addEventListener('click', (e) => {
    if(e.target === newBodyModal){
        newBodyModal.style.display = 'none';
        console.log(newModalClickPos);
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