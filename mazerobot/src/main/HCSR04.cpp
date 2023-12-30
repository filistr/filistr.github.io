/*
  HCSR04 - Library for arduino, for HC-SR04 ultrasonic distance sensor.
  Created by Martin Sosic, June 11, 2016.
*/

#include "Arduino.h"
#include "HCSR04.h"

unsigned short maxDistanceCm = 400;
unsigned long maxTimeoutMicroSec = 0;

float measureDistanceCm(byte sensorPin) {
    //Using the approximate formula 19.307°C results in roughly 343m/s which is the commonly used value for air.
    return measureDistanceCm(19.307, sensorPin);
}

float measureDistanceCm(float temperature, byte sensorPin) {
    unsigned long maxDistanceDurationMicroSec;
    pinMode(sensorPin, OUTPUT);
   // Make sure that trigger pin is LOW.
    digitalWrite(sensorPin, LOW);
    delayMicroseconds(2);
    // Hold trigger for 10 microseconds, which is signal for sensor to measure distance.
    digitalWrite(sensorPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(sensorPin, LOW);
    float speedOfSoundInCmPerMicroSec = 0.03313 + 0.0000606 * temperature; // Cair ≈ (331.3 + 0.606 ⋅ ϑ) m/s

    // Compute max delay based on max distance with 25% margin in microseconds
    maxDistanceDurationMicroSec = 2.5 * maxDistanceCm / speedOfSoundInCmPerMicroSec;
    if (maxTimeoutMicroSec > 0) {
    	maxDistanceDurationMicroSec = min(maxDistanceDurationMicroSec, maxTimeoutMicroSec);
    }
    pinMode(sensorPin, INPUT); 

    // Measure the length of echo signal, which is equal to the time needed for sound to go there and back.
    unsigned long durationMicroSec = pulseIn(sensorPin, HIGH, maxDistanceDurationMicroSec); // can't measure beyond max distance
    //unsigned long durationMicroSec = pulseIn(triggerPin, HIGH, maxDistanceDurationMicroSec);

    float distanceCm = durationMicroSec / 2.0 * speedOfSoundInCmPerMicroSec;
    if (distanceCm == 0 || distanceCm > maxDistanceCm) {
        if (distanceCm > maxDistanceCm) { //la till detta
            return maxDistanceCm; 
        }
        return 200;
    } else {
        return distanceCm;
    }
}