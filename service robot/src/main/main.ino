#include "motor_functions.h"
#include "distance_sensor_functions.h"
#include "qtr_sensors_functions.h"
#include "servo_functions.h"

unsigned int counter;
bool ignoreLeft;
bool ignoreRight;


void setup() {
  Serial.begin(9600);
  counter = 1;
  ignoreLeft = true;
  ignoreRight = false;
  servoSetup();
  motorSetup();
  qtrSetup(); 
  delay(2000);
}
void intersectionHandler();
void deadEnd();
void loop() {

//readSensorValues();
    

  float rightWall = distSensReadingRight(); 
  float leftWall = distSensReadingLeft();
  float frontWall = distSensReadingFrontCenter();
  float frontRightWall = distSensReadingFrontRight();

  //pickUpCylinder();
  int motorSpeed = returnSensorValues()/10;

  adjust(motorSpeed);

  fastForward();
  Serial.print("Distance Front Right: "); 
  Serial.println(frontRightWall); 
  Serial.print("Distance Front: "); 
  Serial.println(frontWall); 
  Serial.print("Distance Right: "); 
  Serial.println(rightWall); 
  Serial.print("Distance Left: "); 
  Serial.println(leftWall); 
  Serial.println("");
  

  while (float newFront = distSensReadingFrontCenter() < 14 && distSensReadingFrontRight() < 15) {
  Serial.println("Wall straight ahead");
  stop();
  if (distSensReadingFrontCenter() > 14) {
    break;
  }
  else {
    if (distSensReadingFrontCenter() > 14) {
      break;
    }
  }

  if (distSensReadingFrontRight() > 17) { 
    while (distSensReadingFrontCenter() > 5.5) {
        Serial.println("Moving towards grip");
        slowForward();
        motorSpeed = returnSensorValues();
        adjust(motorSpeed);
      }
      stop();
      Serial.println("Time to pick up");
      delay(500);
      pickUpCylinder();
      delay(500);
    }
    else if (rightWall > 20 && leftWall > 20) {
      Serial.println("T section with wall ahead\n");
      Serial.print("Right wall dist: ");
      Serial.println(rightWall);
      Serial.print("Left wall dist: ");
      Serial.println(leftWall);
      intersectionHandler();
      break;
    }
    else if (rightWall > 20 && leftWall < 20) {
      Serial.println("Regular turn, right only choice");
      Serial.print("Right wall dist: ");
      Serial.println(rightWall);
      Serial.print("Left wall dist: ");
      Serial.println(leftWall);
      rightTurn();
      break;
    }
    else if (leftWall > 20 && rightWall < 20) {
      Serial.println("Regular turn, left only choice");
      Serial.print("Right wall dist: ");
      Serial.println(rightWall);
      Serial.print("Left wall dist: ");
      Serial.println(leftWall);
      Serial.print("front is ");
      Serial.println(frontWall);
      leftTurn();
      break;
    }
    else {
      //Deadend, vänd på dig
          Serial.print("Deadend, turning around\n");
          Serial.print("ignore left is ");
          Serial.println(ignoreLeft);
          Serial.print("ignore right is ");
          Serial.println(ignoreRight);
          Serial.print("left is ");
          Serial.println(leftWall);
          Serial.print("right is ");
          Serial.println(rightWall);
          Serial.print("front is ");
          Serial.println(frontWall);
          Serial.println("");
      deadEnd();
      }
  }

  /*
    Serial.print("ignore left is ");
    Serial.println(ignoreLeft);
    Serial.print("ignore right is ");
    Serial.println(ignoreRight);
    Serial.print("left is ");
    Serial.println(leftWall);
    Serial.print("right is ");
    Serial.println(rightWall);
    Serial.print("front is ");
    Serial.println(frontWall);
    Serial.print("frontright is: ");
    Serial.println(frontRightWall);
    Serial.println("");
    delay(2000);
    */
  //korsning
  if ((rightWall > 15 && frontWall > 30 && !ignoreRight) || (leftWall > 15 && frontWall > 30 && !ignoreLeft)){
    Serial.println("No wall ahead, and intersection handler.");
    Serial.print("ignore left is ");
    Serial.println(ignoreLeft);
    Serial.print("ignore right is ");
    Serial.println(ignoreRight);
    //Kör frammåt tills mitten av korsningen
    delay(100);
    intersectionHandler();
  }
  }

  void deadEnd() {
    sharpRight();
    stop();
    sharpRight();
    stop();
    ignoreRight = false;
    ignoreLeft = false;
  }

  void rightTurn() {
    sharpRight();
    stop();
    ignoreLeft = false;
    ignoreRight = true;
  }

  void leftTurn() {
    sharpLeft();
    stop();
    ignoreRight = false;
    ignoreLeft = true;
  }

  void intersectionHandler() {

  Serial.print("in intersection handler counter: ");
  Serial.println(counter);
  switch (counter) {
    case 1:
      Serial.print("Case 1, left \n");
      leftTurn();
      counter++;
      break;

    case 2:
      Serial.print("Case 2, left + ignoreRight\n");
      leftTurn();
      ignoreRight = true;
      counter++;
      break;
    case 3:
      Serial.print("Case 3, left + ignoreRight\n");
      leftTurn();
      ignoreRight = true;
      counter++;
      break;
    case 4:
      Serial.print("Case 4, left\n");
      leftTurn();
      ignoreRight = true;
      counter++;
      break;
    case 5:
      Serial.print("Case 5, left\n");
      leftTurn();
      counter++;
      break;
    case 6:
      Serial.print("Case 6, keep straight ignore right\n"); 
      ignoreRight = true;
      ignoreLeft = false;
      counter++;
      break;
    case 7: 
      Serial.print("Case 7, right\n");
      rightTurn();
      counter++;
      break;
    case 8:
      Serial.print("Case 8, striaght ignore left\n");
      ignoreLeft = true;
      counter++;
      break;
    case 9:
      Serial.print("Case 9, right + ignoreLeft\n");
      rightTurn();
      ignoreLeft = true;
      counter++;
      break;
    case 10:
      Serial.print("Case 10, straight + ignoreLeft\n");
      ignoreLeft = true;
      ignoreRight = false;
      counter++;
      break;
    case 11:
      Serial.print("Case 11, right + ignoreLeft\n");
      rightTurn();
      ignoreLeft = true;
      counter++;
      break;
    case 12:
      Serial.print("Case 12, right\n");
      rightTurn();
      counter++;
      break;
    case 13:
      Serial.print("Case 13, left\n");
      leftTurn();
      counter++;
      break;
    case 14: 
      Serial.print("Case 14, straight \n");
      ignoreRight = true;
      counter++;
    case 15:
      Serial.print("Case 14, left + ignoreRight\n"); 
      leftTurn();
      counter++;
      ignoreRight = true;
      break;
    case 16:
      Serial.print("Case 15, left + ignoreRight\n");
      leftTurn();
      counter++;
      ignoreRight = true;
      break;
    default:
      Serial.print("Something went wrong, counter over 15");
  }
}
