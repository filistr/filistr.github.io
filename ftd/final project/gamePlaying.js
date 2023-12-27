function gamePlaying() {
    imageMode(CORNER);
    image(buffer, 0, 0);
    imageMode(CENTER);
    buffer.background(colorPalette[6], colorPalette[7],colorPalette[8]);
    document.body.style.backgroundColor = 'rgb(' + colorPalette[6] + ',' +  colorPalette[7] + ',' + colorPalette[8] + ')'; 

    // PATH 
    drawPath();

    if (start) {
        waveOngoing = true;
        start = false;
    }

    // INGREDIENTS
    // spawnRate controls how fast ingredients get generated
    // the bigger the number, the slower ingredients spawn
    if (waveOngoing) {
     //   if (start) {
        let spawnRate = int(random(120/ingredientSpeed,200/ingredientSpeed))
        if (frameCount % spawnRate == 0 && cumulativeSpawnNum <= ingredientNum) {
            cumulativeSpawnNum++;
            ingredientCollection.push(new Ingredient(cumulativeSpawnNum-1, startX, startY, startDir, random(ingredientSpeed,ingredientSpeed+3), ingredientTypeWave)); //gives the ingredient a random speed
        }
    }
    // display and move each ingredient
    for (let i = 0; i < ingredientCollection.length; i++) {
        let currentIngredient = ingredientCollection[i];
        currentIngredient.display();
        currentIngredient.captureDetection();
        currentIngredient.move();
        if (currentIngredient.isOffScreen() || currentIngredient.captured) {
            ingredientCollection.splice(i,1);
            i--;
            // win condition
            if (lives > 0 && ingredientCollection.length == 0 && cumulativeSpawnNum >= ingredientNum) {
                if (wave > Object.keys(config[level]).length) { //change to 10
                    //user won the game
                    state = 3; 
                } 
                else if (start){
                    setWave(wave);
                    wave++; 
                }
                levelWonSound.play();
            }
        }
    }

    if (cumulativeSpawnNum >= ingredientNum) {
        waveOngoing = false;
    }

    // CONTROL PANEL
    drawControl();

    // TOWER
    if (towerPurchased.length != 0) {
        for (let i = 0; i < towerPurchased.length; i++) {
            towerPurchased[i].display();
            towerPurchased[i].update();
        }
    }

    // INSTRUCTION BOX
    // for start instruction
    if(!waveOngoing) {
        fill(255,255,255,127);
        rect(800,640,310,120, 20);
        fill(0);
        textAlign(CENTER,CENTER);
        textWrap(WORD);
        textSize(15);
        text("Drag and drop restaurants along the path. Remember that you can't place towers on the path, graphics or other towers.\n\nPress 'START ROUND NOW' to play.", 800,640,300);
    }
    // for tower instruction
    for (const [key, value] of Object.entries(menu)) {
        if (dist(mouseX, mouseY, value.menuX, value.menuY) < 85 && towerTypeWave.includes(key) ) {
            let x; 
            let y = 60;
            let len = value.ingredientImage.length;
            if (len > 3) {
                y = 125;
            }
            fill(255,255,255,180);
            rect(mouseX+15, mouseY-20, 100, y, 20);
            fill(0);
            textAlign(CENTER,CENTER);
            textWrap(WORD);
            
            if (len == 1) {
                x = 15;
                text("Capture ("+value.captureNumMax+")", mouseX + 15, mouseY-35, 200);
            } else if (len == 2) {
                x = len/5;
                text("Captures ("+value.captureNumMax+")", mouseX + 15, mouseY-35, 200);
            } else if (len == 3) {
                x = -15;
                text("Captures ("+value.captureNumMax+")", mouseX + 15, mouseY-35, 200);
            } else {
                x = -15;
                text("Captures ("+value.captureNumMax+")", mouseX + 15, mouseY-65, 200);
            }
            
            for (let i = 0; i < value.ingredientImage.length; i++) {
                if (len > 4) {
                    if (i < 3) {
                         image(value.ingredientImage[i], mouseX + x, mouseY-40, 30, 30);
                    } else if (i > 2 && i < 6){
                         image(value.ingredientImage[i], mouseX + x - 90, mouseY - 10, 30, 30);
                    } else {
                        image(value.ingredientImage[i], mouseX + 15, mouseY+20, 30, 30);
                    }
                    x += 30;
                } else {
                    image(value.ingredientImage[i], mouseX + x, mouseY-10, 30, 30);
                    x += 30;
                }
            }
        }
    }
    if (needMoreMoney) {
            fill(255,255,255,100);
            rect(910,45,170,60,20);
            fill(0);
            textAlign(CENTER,CENTER);
            textWrap(WORD);
            textSize(15);
            text("You need more money\nto purchase this item.", 910, 45);
        }
        
        if (frameCount % 5 == 0 && needMoreMoney) {
            timeNeedMoreMoney -= 0.5;
            if (timeNeedMoreMoney < 0){
                needMoreMoney = false;
            }
        }
}

