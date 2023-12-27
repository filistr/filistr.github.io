function gameStart() {
    // reset
    ingredientCollection = [];
    towerPurchased = [];
    lives = 10;
    cumulativeSpawnNum = 0;
    
    // game start screen
    background(255,242,204);
    document.body.style.backgroundColor = 'rgb(' + 255 + ',' +  242 + ',' + 204 + ')'; 
    textAlign(CENTER, CENTER); 
    textSize(35); 
    fill(109, 46, 70); 
    text("Welcome to", width/2, height/2-250);
    textSize(70);
    fill(109, 46, 70); 
    text("FOOD TOWER DEFENSE", width/2-2, height/2-182); 
    fill(226,106,107);
    text("FOOD TOWER DEFENSE", width/2, height/2-180); 
    textSize(25);
    image(bakeryTowerImage, width/2 - bakeryTowerImage.width*0.8, height/2+50, 350, 350);
    image(pizzaTowerImage, width/2 + pizzaTowerImage.width*0.8, height/2+50, 350, 350);

    //choose difficulty
    fill(109, 46, 70);
    text("Choose a world to start", width/2, height/2-60);
    noStroke();

    //city
    if (mouseX >= width/2 -100 && mouseX <= width/2+100 && mouseY >= 320 && mouseY <= 380) {
        fill(79, 16, 40);
        rect(width/2, height/2, 200, 60, 20); 
    } else {
       fill(109, 46, 70);
        rect(width/2, height/2, 200, 60, 20); 
    }
     
    //forest
    if (mouseX >= width/2 -100 && mouseX <= width/2+100 && mouseY >= 390 && mouseY <= 450) {
        fill(79, 16, 40);
        rect(width/2, height/2 + 70, 200, 60, 20); 
    } else {
        fill(109, 46, 70);
        rect(width/2, height/2 + 70, 200, 60, 20); 
    }

    //ice
     if (mouseX >= width/2 -100 && mouseX <= width/2+100 && mouseY >= 460 && mouseY <= 520) {
        fill(79, 16, 40);
        rect(width/2, height/2 + 140, 200, 60, 20); 
    } else {
        fill(109, 46, 70);
        rect(width/2, height/2 + 140, 200, 60, 20); 
    }

    //assets sources
    if (mouseX >= width/2-130 && mouseX <= width/2+130 && mouseY >= height/2 + 180 && mouseY <= height/2 + 220) {
        fill(206,86,87);
        rect(width/2, height/2 + 200, 260, 40, 20); 
    } else {
        fill(226,106,107);
        rect(width/2, height/2 + 200, 260, 40, 20); 
    }

    fill(255);
    text("Desert", width/2, height/2); 
    text("Forest", width/2, height/2 + 70); 
    text("Ice", width/2, height/2 + 140);
    textSize(15); 
    text("INSTRUCTIONS & ASSETS SOURCES", width/2, height/2 + 200);
}

