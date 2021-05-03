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