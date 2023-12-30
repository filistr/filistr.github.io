#include "QTRSensors.h"
#include <Arduino.h>

QTRSensors qtr;

const uint8_t SensorCount = 5;
uint16_t sensorValues[SensorCount];
#define KP 2.5 //experiment to determine this, start by something small that just makes your bot follow the line at a slow speed
#define KD 1.8 //experiment to determine this, slowly increase the speeds and adjust this value. ( Note: Kp < Kd) 
int lastError = 0;
void qtrSetup()
{
    qtr.setTypeRC();
    qtr.setSensorPins((const uint8_t[]){A0, A1, A2, A3, A4}, SensorCount);
    qtr.setEmitterPin(2);

    delay(500);
    pinMode(LED_BUILTIN, OUTPUT);
    digitalWrite(LED_BUILTIN, HIGH); // turn on Arduino's LED to indicate we are in calibration mode

    // analogRead() takes about 0.1 ms on an AVR.
    // 0.1 ms per sensor * 4 samples per sensor read (default) * 6 sensors
    // * 10 reads per calibrate() call = ~24 ms per calibrate() call.
    // Call calibrate() 400 times to make calibration take about 10 seconds.
    for (uint16_t i = 0; i < 400; i++)
    {
        qtr.calibrate();
    }
    digitalWrite(LED_BUILTIN, LOW); // turn off Arduino's LED to indicate we are through with calibration

    // print the calibration minimum values measured when emitters were on
    Serial.begin(9600);
    for (uint8_t i = 0; i < SensorCount; i++)
    {
       /* Serial.print(qtr.calibrationOn.minimum[i]);
        Serial.print(' ');*/
    }
    Serial.println();

    // print the calibration maximum values measured when emitters were on
    for (uint8_t i = 0; i < SensorCount; i++)
    {
        Serial.print(qtr.calibrationOn.maximum[i]);
        Serial.print(' ');
    }
    /*Serial.println();
    Serial.println();*/
    Serial.println();
    delay(1000);
}

int returnTotSensorValues() {
  int totSensor = 0;
  for (uint8_t i = 0; i < SensorCount; i++) {
    // Serial.println("");
    // Serial.print("value: ");
    // Serial.println(sensorValues[i]);
    totSensor += sensorValues[i]; 
  }
  // Serial.print("total: ");
  // Serial.println(totSensor);
  return totSensor;
}

void readSensorValues() {
/*Sensorn som är över linjen retunrerar 1000*/

  // read calibrated sensor values and obtain a measure of the line position
  // from 0 to 5000 (for a white line, use readLineWhite() instead)
  uint16_t position = qtr.readLineBlack(sensorValues);

  // print the sensor values as numbers from 0 to 1000, where 0 means maximum
  // reflectance and 1000 means minimum reflectance, followed by the line
  // position
  for (uint8_t i = 0; i < SensorCount; i++)
  {
    Serial.print(sensorValues[i]);
    Serial.print('\t');
    // if (sensorValues[1] == 1000) {
    //   Serial.print("Too much right "); 
    // }
    // if (sensorValues[3] == 1000) {
    //     Serial.print("Too much left "); 
    // }
    // if (sensorValues[2] == 1000) {
    //     Serial.print("Centered ");
    // }
  
  }
  Serial.println("");
  // if(position > 1200 && position < 3800){
  //   Serial.print(position);
  //   Serial.println("   Centered");
  // }else{
  //   Serial.println(position);
  // }
  delay(250);
}

int returnSensorValues() {
  int position = qtr.readLineBlack(sensorValues); //get calibrated readings along with the line position, refer to the QTR Sensors Arduino Library for more details on line position.
  if (returnTotSensorValues() > 4500) {
   // Serial.println("T-korsning");
  }
  if (returnTotSensorValues() > 3000 || returnTotSensorValues() < 1000) {
   // Serial.println("Sväng/ingen linje"); 
    return 0;
    //Forward men ignore adjust
    //Sväng när hjulen är på mitten av linjen
  }
  int error = position - 2000;
  lastError = error;

  int motorSpeed = KP * error;
  return motorSpeed;
}
