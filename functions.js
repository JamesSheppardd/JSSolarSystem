// Planet functions \\
//#region 
const planetSetup = () => {
    // mass
    const planetMass = random(5*pow(10, 24), 6*pow(10, 24));
    // radius
    const planetR = random(5, 30)
    // orbital radius
    let r = random(sun.r, Math.min(windowWidth/2, windowHeight/2));
    // Random angle
    let theta = random(TWO_PI);
    let planetPos = createVector(r*cos(theta), r*sin(theta));

    let sunPlanetDist = planetPos.mag() - sun.pos.mag();
    // time period for one orbit
    const planetT = 2 * PI * sqrt( (pow(sunPlanetDist, 3)) / (G * sun.mass) );  // T = 2π sqrt(r^3 / Gm)
    // gfs of planet
    let g = ( G * sun.mass ) / pow(sunPlanetDist, 2);

    // planet velocity
    let planetVel = planetPos.copy();
    planetVel.rotate(HALF_PI)   // Want the velocity direction to be 90 degrees to position
    //planetVel.setMag(sqrt(G*sun.mass/planetPos.mag())); // Using mean orbital speed equation - sqrt((G*M)/r)
    planetVel.setMag((2 * PI * r) / planetT);
    planetVel.mult(random(1 - destabilise, 1 + destabilise));   // Make elliptical orbit

    // Make random name
    const planetNameInd = Math.floor(Math.random() * planetNames.length);
    const planetName = planetNames[planetNameInd];
    planetNames.splice(planetNameInd, 1);

    // COlour
    const planetColour = randomColour();
    return {
        name: planetName,
        mass: planetMass,
        radius: planetR,
        pos: planetPos,
        vel: planetVel,
        t: planetT,
        g: g,
        colour: planetColour,
        r: r
    }
}
const newPlanetSetup = (clickPos) => {
    // orbital radius
    let r = sun.pos - createVector(clickPos.x, clickPos.y);
    let planetPos = createVector(clickPos.x, clickPos.y)

    let sunPlanetDist = planetPos.mag() - sun.pos.mag();
    // time period for one orbit
    const planetT = 2 * PI * sqrt( (pow(sunPlanetDist, 3)) / (G * sun.mass) );  // T = 2π sqrt(r^3 / Gm)
    // gfs of planet
    let g = ( G * sun.mass ) / pow(sunPlanetDist, 2);

    // planet velocity
    let planetVel = planetPos.copy();
    planetVel.rotate(HALF_PI)   // Want the velocity direction to be 90 degrees to position
        //planetVel.setMag(sqrt(G*sun.mass/planetPos.mag())); // Using mean orbital speed equation - sqrt((G*M)/r)
    planetVel.setMag((2 * PI * r) / planetT);
    planetVel.mult(random(1 - destabilise, 1 + destabilise));   // Make elliptical orbit

    return {
        pos: planetPos,
        vel: planetVel,
        t: planetT,
        g: g,
        distToSun: sunPlanetDist
    }
}

// Logic for selecting a planet
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

//#endregion


// DOM functions \\
//#region 

// Editing
const edit = () => {
    console.log("Is Editing");
    // Create new canvas that isn't paused
    editCanvas = document.createElement('canvas');
    editDivEl.appendChild(editCanvas);
    editCtx = editCanvas.getContext('2d');

    editCanvas.width = 32;
    editCanvas.height = 32;

    editCtx.fillStyle = "#ffffff";
    editCtx.beginPath();
    //editCtx.fillRect(0,0,editCanvas.width, editCanvas.height)
    editCtx.arc(editCanvas.width/2,editCanvas.height/2,editCanvas.width / 2, 0, 2 * Math.PI);
    editCtx.fill()

    window.addEventListener('mousemove', (e) => {
        editDivEl.style.top = `${e.clientY - editCanvas.width/2}px`;
        editDivEl.style.left = `${e.clientX - editCanvas.height/2}px`;
    });
    setTimeout(() => {
        canCreateBody = true;
    }, 500);
}
const hideEdit = () => {
    editDivEl.removeChild(editCanvas);
    newBodyModal.style.display = 'none';
    newModalSubmitEl.value = 'Create Body';
    frameRate(60);
    frameR = 60;
}

//#endregion

// Event Listener functions \\
//#region 


//#endregion

// Miscellaneous functions \\
//#region 

// Random colour
const randomColour = () => {
    let randCol = [];
    for(let i = 0; i < 6; i++){
        randCol.push(hexValues[Math.floor(Math.random() * 16)]);
    }
    return `#${randCol.join('')}`;
}

//#endregion
