function gameOver() {
    //background
    background(colorPalette[0], colorPalette[1],colorPalette[2]);
    document.body.style.backgroundColor = 'rgb(' + colorPalette[0] + ',' +  colorPalette[1] + ',' + colorPalette[2] + ')'; 

    //text
    textAlign(CENTER);
    textSize(80);
    
    fill(0);
    text("GAME OVER", width/2-3, height/2+137);
    fill(colorPalette[6], colorPalette[7],colorPalette[8]);
    text("GAME OVER", width/2, height/2+140);
    image(cheeseImage, width/2, height/2 - 100, 400, 400); 
    
    //restart button
    noStroke(); 
    if (mouseX >= width/2 - 100 && mouseX <= width/2+100 && mouseY >= height/2+200 && mouseY <= height/2+260) {
        fill(colorPalette[3]-20, colorPalette[4]-20, colorPalette[5] - 20);
    } else {
        fill(colorPalette[3], colorPalette[4], colorPalette[5]);
    }
    rect(width/2, height/2+230, 200, 60, 20); 
    fill(0);
    textSize(28);
    textAlign(CENTER,CENTER);
    text("RESTART", width/2, height/2+230);
}

function gameWon() {
    document.body.style.backgroundColor = 'rgb(' + colorPalette[6] + ',' +  colorPalette[7] + ',' + colorPalette[8] + ')'; 
    background(colorPalette[6], colorPalette[7], colorPalette[8]); 
    textAlign(CENTER); 
    textSize(100);
    fill(0);
    text("GAME WON", width/2 - 3, height/2 - 103);
    fill(colorPalette[3], colorPalette[4],colorPalette[5]); 
    text("GAME WON", width/2, height/2 - 100);
   
    noStroke(); 
    if (mouseX >= width/2 - 100 && mouseX <= width/2+100 && mouseY >= height/2-20 && mouseY <= height/2+40) {
        fill(colorPalette[0]-20, colorPalette[1]-20,colorPalette[2]-20);
    } else {
        fill(colorPalette[0], colorPalette[1], colorPalette[2]);
    }
    rect(width/2, height/2 + 10, 200, 60, 20); 
    fill(colorPalette[3], colorPalette[4],colorPalette[5]);
    textSize(28);
    textAlign(CENTER,CENTER);
    text("PLAY AGAIN", width/2, height/2 + 10);
}

