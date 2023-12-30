#include "motor_functions.h"
#include "Arduino.h"

int motor1pinA = 11;
int motor1pinB = 3;

int motor2pinA = 6;
int motor2pinB = 5;

int lSpeed = 0;
int rSpeed = 0;

int time = 50;

int minimumSpeed = 40; 
int maximumSpeed = 70; 


void motorSetup() {
    pinMode(motor1pinA, OUTPUT);
    pinMode(motor1pinB, OUTPUT);
}

void slowForward() {
    runMotors(-15, -15); // This speed is for slow testing
    //runMotors(-70, -70);
    delay(time);
}

void fastForward() {
    runMotors(-maximumSpeed, -maximumSpeed);
    delay(time);
}

void stop() {
    runMotors(0,0);
    delay(200);
}

void slightRight() {
    runMotors(-20, -10);
    delay(time);
}

void sharpRight() {
    runMotors(-60, 60); 
    delay(605);
}

void slightLeft() {
    runMotors(-10, -20);
    delay(time);
}

void sharpLeft() {
    runMotors(60, -60);
    delay(620);
}
void adjust(int motorSpeed) {
  int leftMotorSpeed = minimumSpeed - motorSpeed;
  int rightMotorSpeed = minimumSpeed + motorSpeed;

  if (leftMotorSpeed > maximumSpeed) {
    leftMotorSpeed = maximumSpeed; 
  }
  if (rightMotorSpeed > maximumSpeed) {
    rightMotorSpeed = maximumSpeed; 
  }
   if (leftMotorSpeed < minimumSpeed) {
    leftMotorSpeed = minimumSpeed; 
  }
  if (rightMotorSpeed < minimumSpeed) {
    rightMotorSpeed = minimumSpeed; 
  }
  //Negativ: sväng höger
  //Positiv: Sväng vänster

  // Serial.print("Left: ");
  // Serial.println(leftMotorSpeed);
  // Serial.print("Right: ");
  // Serial.println(rightMotorSpeed);
  runMotors(leftMotorSpeed*-1, rightMotorSpeed*-1);
  delay(time);
  }

void runMotors(int leftSpeed,int rightSpeed){ //Function to run the motors, the Speeds can be set between -100 and 100
  if(rightSpeed>=0 and rightSpeed != 0){
    int Speed = map(rightSpeed, 0, 100, 0, 255);
   /* Serial.print("Speed: ");
    Serial.println(Speed);*/
    analogWrite(motor1pinA, Speed);
    digitalWrite(motor1pinB, LOW);    
  }
  if(rightSpeed<=0 and rightSpeed != 0){
    int Speed = map(rightSpeed, -100, 0, 255, 0);
   /* Serial.print("Speed: ");
    Serial.println(Speed);*/
    digitalWrite(motor1pinA, LOW);
    analogWrite(motor1pinB, Speed);
  }
  if(rightSpeed == 0){
   digitalWrite(motor1pinA, LOW);
   digitalWrite(motor1pinB, LOW);
  }
  if(leftSpeed>=0 and leftSpeed != 0){
    int Speed = map(leftSpeed, 0, 100, 0, 255)+2;
   /* Serial.print("Speed: ");
    Serial.println(Speed);*/
    analogWrite(motor2pinA, Speed);
    digitalWrite(motor2pinB, LOW); 
  }
  if(leftSpeed<=0 and leftSpeed != 0){
    int Speed = map(leftSpeed, -100, 0, 255, 0)+2;
  /*  Serial.print("Speed: ");
    Serial.println(Speed);*/
    digitalWrite(motor2pinA, LOW);
    analogWrite(motor2pinB, Speed);
  }
  if(leftSpeed == 0){
    digitalWrite(motor2pinA, LOW);
    digitalWrite(motor2pinB, LOW);   
  }  
}