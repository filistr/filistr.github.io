// Reference: https://editor.p5js.org/codingtrain/sketches/U0R5B6Z88
class Tower {
    constructor(x, y, towerType, captureNumMax, price) {
        this.x = x;
        this.y = y;
        this.towerType = towerType;
        this.dragging = false; 
        this.hitUnder = 0;
        this.hitAbove = 0; 
        this.hitRight = 0; 
        this.hitLeft = 0;
        this.hitTowerArray = [];
        this.capturingIngredients = [];
        this.hitTower = false; 
        this.shrinking = false;
        this.captureNumMax = captureNumMax;
        this.showOptions = false; 
        this.sellingPrice = 0.5*price;
        this.upgradePrice = 0.6*price;
        this.sellButtonX = this.x - 80;
        this.sellButtonY = this.y;
        this.upgradeButtonX = this.x + 90;
        this.upgradeButtonY = this.y;
        this.sold = false;
        this.upgraded = false;
        this.targetArea = 270;
        this.hitGraphic = false;

        switch (towerType) {
            case "pizza":
                this.graphic = pizzaTowerImage;
                break;
            case "bakery":
                this.graphic = bakeryTowerImage;
                break;
            case "burger": 
                this.graphic = burgerTowerImage; 
                break;
            case "sushi":
                this.graphic = sushiTowerImage;
                break;
            case "super":
                this.graphic = superTowerImage;
                break;
            default:
                this.graphic = missingImage;
                break;
        }
    }

    display() {
        noStroke();
        if (this.hitAbove == colorPalette[3]|| this.hitUnder == colorPalette[3]|| this.hitRight == colorPalette[3] || this.hitLeft == colorPalette[3] ||
            (this.x <= 1300 && this.x >= 1000) || this.hitTower) {
            fill(226,106,107,100);
        } else {
            fill(255,255,255,100);
        }
        
        ellipse(this.x, this.y, this.targetArea, this.targetArea);
        image(this.graphic, this.x, this.y, 170, 170);

        //sell and upgrade buttons
        if (this.showOptions) {

            if(mouseX > this.x - 120 && mouseX < this.x - 40 && mouseY > this.y - 40 && mouseY < this.y + 40) {
                fill(colorPalette[0]-20, colorPalette[1]-20, colorPalette[2]-20);
            } else {
                fill(colorPalette[0], colorPalette[1], colorPalette[2]);
            }
            
            //sell
            ellipse(this.x - this.targetArea*0.3, this.y, 80, 80);
            fill(255);
            textSize(13);

            if (!this.upgraded) {
                if (mouseX > this.x + 40 && mouseX < this.x + 120 && mouseY > this.y - 40 && mouseY < this.y + 40) {
                    fill(colorPalette[0]-20, colorPalette[1]-20, colorPalette[2]-20);
                } else {
                    fill(colorPalette[0], colorPalette[1], colorPalette[2]);
                }
                ellipse(this.x + this.targetArea*0.3, this.y, 80, 80);
                fill(255);
                text("UPGRADE\n-$" + this.upgradePrice, this.x + this.targetArea*0.3, this.y)
            } else {
                fill(0);
                ellipse(this.x + this.targetArea*0.3, this.y, 80, 80);
                fill(255);
                text("ALREADY\nUPDATED", this.x + this.targetArea*0.3, this.y);
            }
            text("SELL\n+$" + this.sellingPrice, this.x - this.targetArea*0.3, this.y);
        }
        
        if ((dist(mouseX, mouseY, this.x, this.y) < this.targetArea/2) && !this.dragging && !this.showOptions) {
            fill(colorPalette[0], colorPalette[1], colorPalette[2]);
            rect(mouseX, mouseY - 20, 200,50,20);
            textSize(15);
            fill(255);
            textAlign(CENTER,CENTER);
            textWrap(WORD);
            text("Click to sell\nor upgrade tower", mouseX, mouseY-20, 200);
        }
    }

    // for draggable
    pressed() {
        this.dragging = true;
        this.offsetX = this.x - mouseX;
        this.offsetY = this.y - mouseY;
    }

    update() {
        // adjust location if being dragged
        if (this.dragging) {
            
            // update the tower location
            this.x = mouseX + this.offsetX;
            this.y = mouseY + this.offsetY;
 
            // check if it hits the path
            this.hitLeft = red(buffer.get(this.x - 60, this.y))
            this.hitRight = red(buffer.get(this.x + 60, this.y))
            this.hitUnder = red(buffer.get(this.x, this.y - 60));
            this.hitAbove = red(buffer.get(this.x, this.y + 60));

            // check if it hits other placed towers or graphics
            if (towerPurchased.length > 1) {
                for (let i = 0; i < towerPurchased.length - 1; i++) {
                    if (dist(this.x, this.y, towerPurchased[i].x, towerPurchased[i].y) < 200) {
                        this.hitTowerArray[i] = true;
                    } else if (level == "desert" && ((dist(this.x, this.y, 280, 450) < 200) || (dist(this.x, this.y, 800, 100) < 100))) {
                        this.hitGraphic = true;
                    } else if (level == "forest" && ((dist(this.x, this.y, 450, 500) < 175) || (dist(this.x, this.y, 800, 200) < 100))) {
                        this.hitGraphic = true;
                    } else if (level == "ice" && ((dist(this.x, this.y, 400, 130) < 140) || (dist(this.x, this.y, 500, 220) < 175))) {
                        this.hitGraphic = true;
                    } else {
                        this.hitTowerArray[i] = false;
                        this.hitGraphic = false;
                    }
                }  
            } else {
                if (level == "desert" && ((dist(this.x, this.y, 280, 450) < 200) || (dist(this.x, this.y, 800, 100) < 100))) {
                    this.hitGraphic = true;
                } else if (level == "forest" && ((dist(this.x, this.y, 450, 500) < 175) || (dist(this.x, this.y, 800, 200) < 100))) {
                    this.hitGraphic= true;
                } else if (level == "ice" && ((dist(this.x, this.y, 400, 130) < 140) || (dist(this.x, this.y, 500, 220) < 175))) {
                    this.hitGraphic = true;
                } else {
                    this.hitGraphic = false;
                }
            }          
            
            if (towerPurchased.length > 1) {
                for (let i = 0; i < this.hitTowerArray.length; i++) {
                    if (this.hitTowerArray[i] == true || this.hitGraphic) {
                        this.hitTower = true;
                        break;
                    } else {
                        this.hitTower = false; 
                    }
                }    
            } else {
                if (this.hitGraphic) {
                    this.hitTower = true;
                } else {
                    this.hitTower = false; 
                }
            }            
        }
    }

    released() {
        if (this.hitAbove == colorPalette[3] || this.hitUnder == colorPalette[3] || this.hitRight == colorPalette[3] || this.hitLeft == colorPalette[3] ||
        (this.x <= 1300 && this.x >= 1000) || this.hitTower) {
           this.dragging = true;
        } else {
            this.dragging = false;
            this.hitTower = false; 
        }   
    }
}
