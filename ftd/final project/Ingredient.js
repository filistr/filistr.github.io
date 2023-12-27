class Ingredient {
    constructor(id, startX, startY, startDir, speed, ingredientTypeWave) {
        this.id = id; // this would be the index from ingredientCollection array      
        this.x = startX;
        this.y = startY;
        this.graphic = ingredientImages[random(ingredientTypeWave)];
        this.dir = startDir;
        this.captured = false;
        this.speed = speed;
        switch (this.graphic) {
            case cheeseImage:
                this.ingredientType = ["pizza", "burger", "super"];
                this.size = 100;
                this.shrink = 1;
                this.sizeToDelete = 40;
                break; 
            case sausageImage:
                this.ingredientType = ["pizza", "super"];
                this.size = 100;
                this.shrink = 1;
                this.sizeToDelete =40;
                break;
             case cupcakeImage:
                this.ingredientType = ["bakery", "super"];
                this.size = 100;
                this.shrink = 1;
                this.sizeToDelete = 40;
                break;
             case breadImage:
                this.ingredientType = ["burger", "super"];
                this.size = 100;
                this.shrink = 1;
                this.sizeToDelete = 40;
                break;
             case tomatoImage:
                this.ingredientType = ["burger", "pizza", "super"];
                this.size = 100;
                this.shrink = 1;
                this.sizeToDelete = 40;
                break;
            case salmonImage:
                this.ingredientType = ["sushi", "super"];
                this.size = 140;
                this.shrink = 1;
                this.sizeToDelete = 40;
                break;
             case riceImage:
                this.ingredientType = ["sushi", "super"];
                this.size = 100;
                this.shrink = 1;
                this.sizeToDelete = 40;
                break;
            default:
                break;
        }
    }

    display() {
        image(this.graphic, this.x, this.y, this.size, this.size);
    }

    captureDetection() {
        fill(255);
        stroke(12);
        // check if there are towers purchased
        if (towerPurchased.length != 0) {
            // for each tower, check the distance and if type matches
            for (let i = 0; i < towerPurchased.length; i++) {
                let currentTower = towerPurchased[i];
                if (this.ingredientType.includes(currentTower.towerType) && !currentTower.dragging) {
                    if (dist(currentTower.x, currentTower.y, this.x, this.y) < towerPurchased[i].targetArea/2) {
                        // check if current ingredient is in the capturing array
                        let index = currentTower.capturingIngredients.indexOf(this.id)
                        // if yes, then shrink
                        if ( index != -1 ) {
                            // earn money
                            money++;
                            // shrink the ingredient
                            this.size -= this.shrink;
                            if (this.size <= this.sizeToDelete) {
                                this.captured = true;
                                collectIngredientSound.play();
                            }
                        }
                        // if not, check if capturing array is full, if not, add to capturing array
                        else {
                            if ( currentTower.capturingIngredients.length < currentTower.captureNumMax) {
                                // add the ingredient's id into the capturing array if it's in the radius
                                // and it's not currently in the array
                                currentTower.capturingIngredients.push(this.id);      
                            }
                        }
                    }
                    // if the current ingredient is not in radius
                    else {
                        // but it is still in current tower capturing array, then remove it
                        let index = currentTower.capturingIngredients.indexOf(this.id);
                        if (index != -1) {
                            currentTower.capturingIngredients.splice(index,1);
                        }
                    }

                    // if it's captured, then remove it from capturing array
                    let index = currentTower.capturingIngredients.indexOf(this.id);
                    if ( this.captured && index != -1) {
                        currentTower.capturingIngredients.splice(index,1);
                    }
                }   
            }
        }
    }

    move() {
        // if it enters the "turn zone"
        for (let turn in world) {
            if (turn !== "0" && turn != "end") {
                fill(255,0,0);
                if (dist(this.x, this.y, world[turn].x, world[turn].y) <= 20) {
                    let c;
                    if (this.dir == "down") {
                        c = buffer.get(this.x, this.y + 20);
                    } 
                    else if (this.dir == "right") {
                        c = buffer.get(this.x + 20, this.y);
                    }     
                    else if (this.dir == "up") {
                        c = buffer.get(this.x, this.y - 20);

                    }
                    else if (this.dir == "left") {
                        c = buffer.get(this.x-20, this.y);
                    }
                    if (c[0] == colorPalette[6]) {
                        this.dir = world[turn].dir
                    }
                }
            }
        }
    
        // move based on direction
        switch (this.dir) {
            case "right":
                this.x += this.speed;
                break;
            case "up":
                this.y -= this.speed;
                break;
            case "left":
                this.x -= this.speed;
                break;
            case "down":
                this.y += this.speed;
                break;
            default:
                this.x = this.x;
                break;
        }
    }

    isOffScreen() {
        if (this.x > width-300 || this.x < -20 || this.y < -20 || this.y > height) {
            lives--;
            return true;
        }
        return false;
    }
}
