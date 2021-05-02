class WhiteNoise {
    constructor(_freq){
        this.freq = _freq;
        this.x = -width/2;
        this.y = -height/2;
        this.stars = [];
    }

    generate(stars=undefined) {
        const hexVals = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
        for(let i = 0; i < this.freq; i++){
            for(let j = 0; j < this.freq; j++){
                const randInd1 = Math.floor(Math.random() * 32);
                const randInd2 = Math.floor(Math.random() * 32);
                if(randInd1 > 25 && randInd2 >25){
                    fill("#fff7d2");
                    square(this.x, this.y, 1);
                    this.stars.push([this.x, this.y]);
                }
                    
                

                this.x += width / this.freq;
                
                if(j == this.freq - 1){
                    this.y += height / this.freq;
                    this.x = -width/2;
                }
            }
        }
    }

    show(){
        noStroke();
        fill('#fff7d2')
        this.stars.forEach((star, i) => {
            square(this.stars[i][0], this.stars[i][1], 1);
        });
        
    }

    regenerate(_freq, _stars=undefined){
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.x = 0;
        this.y = 0;
        this.freq = _freq;
        this.generate(_stars);
    }
}