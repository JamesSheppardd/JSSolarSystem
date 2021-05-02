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
//#endregion