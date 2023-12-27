function setup() {
    canvas = createCanvas(1300,700); 
    canvas.id('cnv');
    canvas.parent("#cnv");
    canvas.style('width', '100%');
    canvas.style('height', '100%');
    imageMode(CENTER);
    rectMode(CENTER);

    buffer = createGraphics(width, height);

    // add images to the menu object
    menu['pizza'].image = pizzaTowerImage;
    menu['bakery'].image = bakeryTowerImage;
    menu['burger'].image = burgerTowerImage;
    menu['sushi'].image = sushiTowerImage;
    menu['super'].image = superTowerImage;
    menu['pizza'].ingredientImage = [cheeseImage,sausageImage,tomatoImage];
    menu['bakery'].ingredientImage = [cupcakeImage]; 
    menu['burger'].ingredientImage = [cheeseImage, tomatoImage, breadImage];
    menu['sushi'].ingredientImage = [riceImage, salmonImage];
    menu['super'].ingredientImage = [cupcakeImage, cheeseImage, tomatoImage, sausageImage, breadImage, salmonImage, riceImage];

    // add ingredient images to array
    ingredientImages['cheese'] = cheeseImage;
    ingredientImages['sausage'] = sausageImage;
    ingredientImages['cupcake'] = cupcakeImage;
    ingredientImages['bread'] = breadImage;
    ingredientImages['tomato'] = tomatoImage;
    ingredientImages['salmon'] = salmonImage;
    ingredientImages['rice'] = riceImage;
    
    textFont(font);
    backgroundSound.play();
    backgroundSound.loop();
    backgroundSound.setVolume(0.08);
    purchaseSound.setVolume(0.4);
    upgradeSound.setVolume(0.4);   
}

function draw() {
    if (state == 0) {
        gameStart(); 
    } else if (state == 1) {
        gamePlaying();
        if (lives <= 0) {
            state = 2;
            gameOverSound.play();    // game over sound
        }
        // show level
        fill(0);
        textAlign(LEFT);
        textSize(20);
        text("WORLD: " + level, 10,20);
        textAlign(CENTER);
    } else if (state == 2) {
        gameOver(); 
    } else {
        gameWon();
    }
}


function mousePressed() { 
    // start screen - choose difficulty
    if (state == 0) {
        //dessert
        if (mouseX >= width/2 -100 && mouseX <= width/2+100 && mouseY >= 320 && mouseY <= 380) {
            state = 1;
            money = 1400;
            level = "desert";
            setLevel(level);
            setTimer(wave);
            buttonSound.play();
            // set the ingredient start X, Y, and direction
            world = turnData[level];
            startX = world[0].x;
            startY = world[0].y;
            startDir = world[0].dir;
        } 
        //forest
        if (mouseX >= width/2 -100 && mouseX <= width/2+100 && mouseY >= 390 && mouseY <= 450) {
            state = 1;
            level = "forest"; 
            money = 700;
            setLevel(level);
            setTimer(wave);
            buttonSound.play();
            // set the ingredient start X, Y, and direction
            world = turnData[level];
            startX = world[0].x;
            startY = world[0].y;
            startDir = world[0].dir;
        }
        //ice
        if (mouseX >= width/2 -100 && mouseX <= width/2+100 && mouseY >= 460 && mouseY <= 520) {
            state = 1;
            money = 2300; 
            level = "ice";
            setLevel(level);
            setTimer(wave);
            buttonSound.play();
            // set the ingredient start X, Y, and direction
            world = turnData[level];
            startX = world[0].x;
            startY = world[0].y;
            startDir = world[0].dir;
        }
        cumulativeSpawnNum = 0;
        ingredientNum = 0;

        //assets sources
         if (mouseX >= width/2-130 && mouseX <= width/2+130 && mouseY >= height/2 + 180 && mouseY <= height/2 + 220) {
            window.location.replace('sources.html'); 
         }

    }

    // game playing
    else if (state == 1) {
        // press start round now
        if (wave <= Object.keys(config[level]).length && mouseX >= 20 && mouseX <= 150 && mouseY >= 160 && mouseY <= 190) {
            let bonus = int(200 * widthBar / 130);
            money += bonus;
            start = true;
            waveOngoing = true;
            startLevelSound.play();
            setWave(wave);
            wave++;
            setTimer(wave);
        }

        // press restart
        if (mouseX >= 1090 && mouseX <= 1210 && mouseY >= 650 && mouseY <= 690) {
            buttonSound.play();
            state = 0;
        }

        // purchase tower
        for (const [key, value] of Object.entries(menu)) {
            if (dist(mouseX, mouseY, value.menuX, value.menuY) < 85 &&  towerTypeWave.includes(key)) {
                if (money >= value.price) {
                    if ((towerPurchased.length && towerPurchased[towerPurchased.length - 1].dragging == false) ||
                        towerPurchased.length == 0) {
                        // create the corresponding tower object
                        let temp = new Tower(value.menuX, value.menuY, key, value.captureNumMax, value.price);
                        temp.pressed();
                        towerPurchased.push(temp);
                        // deduct money
                        money -= value.price;
                        purchaseSound.play();
                    }            
                } else {
                    needMoreMoney = true;
                    timeNeedMoreMoney = 10;
                }
            }
        }

        //click on tower to display upgrade or sell options
        for (let i = 0; i < towerPurchased.length; i++) {
            //user choose to sell tower
            if (mouseX > towerPurchased[i].x - 120 && mouseX < towerPurchased[i].x - 40 && mouseY > towerPurchased[i].y - 40 && mouseY < towerPurchased[i].y + 40 && towerPurchased[i].showOptions) {
                sellSound.play();
                sellTower(towerPurchased[i]);
            }
            //user choose to upgrade tower
            else if (mouseX > towerPurchased[i].x + 40 && mouseX < towerPurchased[i].x + 120 && mouseY > towerPurchased[i].y - 40 && mouseY < towerPurchased[i].y + 40 && towerPurchased[i].showOptions && !towerPurchased[i].upgraded) {
                if (towerPurchased[i].upgradePrice <= money) {
                    upgradeTower(towerPurchased[i]);
                    upgradeSound.play();
                } else {
                    needMoreMoney = true;
                    timeNeedMoreMoney = 10;
                }
            }
            if (towerPurchased[i] !== undefined) {
                if (mouseX > towerPurchased[i].x - 135 && mouseX < towerPurchased[i].x + 135 && mouseY > towerPurchased[i].y - 135 && mouseY < towerPurchased[i].y + 135 && !towerPurchased[i].dragging) {
                    towerPurchased[i].showOptions = true;
                } else {
                towerPurchased[i].showOptions = false; 
                }
            }
        }
    }
    // game over, press restart
    else if (state == 2) {
        if (mouseX >= width/2 - 100 && mouseX <= width/2+100 && mouseY >= height/2+200 && mouseY <= height/2+260) {
            buttonSound.play();
            state = 0;
        }
    }
    // game won, press restart
    else {
        if (mouseX >= width/2 - 100 && mouseX <= width/2+100 && mouseY >= height/2-20 && mouseY <= height/2+40) {
            buttonSound.play();
            state = 0;
        }
    }
}


function mouseReleased() {
    if (towerPurchased.length != 0) {
        towerPurchased[towerPurchased.length - 1].released();
    }
}

function setWave(wave) {
    ingredientSpeed = config[level][wave].ingredientSpeed;
    // this is the number of ingredients for a wave
    // it will be added to ingredientNum which is the total for a world
    ingredientNumWave = config[level][wave].ingredientNum;
    ingredientTypeWave = config[level][wave].ingredientType;
    ingredientNum += ingredientNumWave;
}

function setTimer(wave) {
    speedBar = config[level][wave].barSpeed;
    nextWaveIndgredient = config[level][wave].ingredientType;
    towerTypeWave = config[level][wave].towerType;
    widthBar = 130;
    heightBar = 30;
}

function setLevel(level) {
    if (level == "desert") {
        colorPalette = desertColor;
        backgroundImage = cactusImage;
    } else if (level == "forest") {
        colorPalette = forestColor;
        backgroundImage = treeImage;
    } else if (level == "ice") {
        colorPalette = iceColor;
        backgroundImage = mountainImage;
    }
    wave = 1;
    start = false;
    waveOngoing = false;
}

function drawPath() {
    buffer.strokeWeight(50);
    buffer.stroke(colorPalette[3], colorPalette[4],colorPalette[5]);
    buffer.strokeCap(PROJECT);

    let keys = Object.keys(world);
    for (let i = 1; i < keys.length; i++) {
        let current = keys[i];
        let previous = keys[i-1];
        let preX = world[previous].x;
        let preY = world[previous].y;
        let curX = world[current].x;
        let curY = world[current].y;
        buffer.line(preX, preY, curX, curY);
    }
}


function sellTower(t) {
    t.sold = true;
    money += t.sellingPrice;
    let index = towerPurchased.indexOf(t);
    towerPurchased.splice(index, 1);
}

function upgradeTower(t) {
    t.upgraded = true;
    money -= t.upgradePrice;
    t.sellingPrice += t.upgradePrice * 0.5; 
    t.targetArea += 50;
}   

function drawControl() {
    //side menu
    noStroke();
    fill(colorPalette[0], colorPalette[1], colorPalette[2]);
    rect(1150, height/2, 300,700,30);
    
    // money and lives
    fill(colorPalette[3], colorPalette[4],colorPalette[5]);
    textSize(25);
    if (level == "ice") {
        image(icicleImage, menu["pizza"].menuX-50, 105, 270, 270);
    }
    text("MONEY $" + money, 1150, 50);
    text("LIVES " + lives + "/10", 1150, 90);

    // purchase options
    for (const [key, value] of Object.entries(menu)) {
        if (towerTypeWave.includes(key)) {
            image(value.image, value.menuX, value.menuY, 135,135);
        } else {
            tint("black");
            image(value.image, value.menuX, value.menuY, 135,135);
            noTint();
            image(lockImage, value.menuX, value.menuY, 80,80);
        }
        if (towerTypeWave.includes(key)) {
            fill(colorPalette[3], colorPalette[4],colorPalette[5]);
            rect(value.menuX, value.menuY + 80, 100,30, 20);
            textAlign(CENTER);
            textSize(15); 
            fill(0);
            text("$" + value.price, value.menuX, value.menuY + 80);
        }
    }
    
    //restart button 
    textAlign(CENTER, CENTER);

    //hover effect
    if (mouseX >= 1090 && mouseX <= 1210 && mouseY >= 650 && mouseY <= 690) {
        fill(colorPalette[6] - 20, colorPalette[7] - 20, colorPalette[8] - 20);
    } else {
        fill(colorPalette[6], colorPalette[7],colorPalette[8]);
    }
    rect(1150, 670, 120, 40, 20);
    fill(255);
    textSize(20);
    text("RESTART", 1150, 670);

    // background images
    if (level == "desert") {
        image(backgroundImage, 280, 450, 400, 400);
        image(backgroundImage, 800, 100, 200, 200);
    } else if (level == 'forest') {
        image(backgroundImage, 450, 500, 350, 350);
        image(backgroundImage, 800, 200, 200, 200);
    } else if (level=="ice") {
        image(backgroundImage, 400, 140, 280, 280);
        image(backgroundImage, 500, 220, 150, 150);
    } 
    
    // wave countdown
    if (wave <= Object.keys(config[level]).length) {
        fill(colorPalette[0], colorPalette[1], colorPalette[2]); 
        rect(85, 125, 170, 150, 20);
        fill(colorPalette[3], colorPalette[4], colorPalette[5]);
        //start now button
        rect(85, 175, 130, 30, 20); 
        
        textSize(16);
        fill(colorPalette[3], colorPalette[4], colorPalette[5],120);
        ellipse(45,100,32,32);
        ellipse(85,100,32,32);
        ellipse(125,100,32,32);
        ellipse(25,135,32,32);
        ellipse(65,135,32,32);
        ellipse(105,135,32,32);
        ellipse(145,135,32,32);
        fill(255);
        text("NEXT ROUND " + wave +"/10", 85, 70);
        rectMode(CORNER);
        //hover effect start button
        if (mouseX >= 20 && mouseX <= 150 && mouseY >= 160 && mouseY <= 190) {
            if (widthBar < 50) {
                    colorTime -=1;
                    if (colorTime < 0) {
                        switchColor *= -1; 
                        colorTime = 20;
                    }
                if (switchColor < 0) {
                    fill(206,86,87,100);
                } else {
                    fill(colorPalette[6]-20, colorPalette[7]-20, colorPalette[8]-20);
                } 
            } else {
                fill(colorPalette[6] - 20 , colorPalette[7] - 20, colorPalette[8] - 20);
            }
        } else {
            if (widthBar < 50) {
                    colorTime -=1;
                    if (colorTime < 0) {
                        switchColor *= -1; 
                        colorTime = 20;
                    }
                if (switchColor < 0) {
                     fill(226,106,107,100);
                } else {
                    fill(colorPalette[6], colorPalette[7],colorPalette[8]);
                } 
            }  else {
                fill(colorPalette[6], colorPalette[7],colorPalette[8]);
            }
        }
        rect(20, 160, widthBar, heightBar, 20);
        rectMode(CENTER);
        fill(0);
        textSize(13);
        text("START ROUND NOW", 85, 174);

        // draw upcoming ingredient types in countdown
        for (let i = 0; i < nextWaveIndgredient.length; i++) {

            let imageDist = 40;

            if (i < 3) {
                image(ingredientImages[nextWaveIndgredient[i]], imageDist*i +45, 100, 30, 30);
            }
            else {
                image(ingredientImages[nextWaveIndgredient[i]], imageDist*(i-3) +25, 135, 30, 30);
            }
        }

        if (frameCount % speedBar == 0) {
            widthBar -= 0.1; 
            if (widthBar <= 10) {
                heightBar = 0;
                widthBar = 0; 
                start = true;
                waveOngoing = true;
                setWave(wave);
                if (wave <= Object.keys(config[level]).length - 1) {
                    wave++;
                    setTimer(wave);
                }
            }
        }
    }
    // when it's the last wave
    if (wave == Object.keys(config[level]).length + 1) {
        fill(colorPalette[0], colorPalette[1], colorPalette[2]); 
        rect(85, 125, 170, 150, 20);
        textSize(16);
        fill(255);
        text("THIS IS THE\nLAST WAVE", 85, 120);

    }
}


