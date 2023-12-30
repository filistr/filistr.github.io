#include "servo_functions.h"
#include <Arduino.h>

Servo servoLeft; //greppa
Servo servoRight; //rotation upp och ner
int greppAngle = 23; 
int releaseAngle = 0; 

void servoSetup() {
    servoLeft.attach(4);
    servoRight.attach(2); 
    servoRight.write(120);
       
    servoLeft.write(releaseAngle);
}

void servoDesetup() {
  servoLeft.detach();
  servoRight.detach();
}

void rotationTest() {
  // Serial.println("Fäll ner");
  // servoLeft.write(greppAngle);
  // delay(1000);
  // Serial.println("Fäll upp");
  // servoLeft.write(releaseAngle); 
  // delay(1000);

  Serial.println("Fäll ner");
  servoLeft.write(greppAngle);
  delay(1000);
  Serial.println("Fäll upp");
  servoRight.write(releaseAngle); 
  delay(1000);
}

void pickUpCylinder() {
  Serial.println("Fäll ner");
  servoRight.write(18);
  delay(1000); 
  Serial.println("Grepp"); 
  servoLeft.write(greppAngle); 
  delay(1000); 
  Serial.println("Fäll upp"); 
  servoRight.write(135); 
  delay(1000); 
  Serial.println("Släpp"); 
  servoLeft.write(releaseAngle);
  delay(1000);
}


void servoTestSequence() {
/* Roterar armen i 180 grader */
  for (int angle=0; angle<180; angle+=10){
    servoLeft.write(angle); //directs servo to go to position in variable 'angle'
  }
}
