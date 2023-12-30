/*
  HCSR04 - Library for arduino, for HC-SR04 ultrasonic distance sensor.
  Created by Martin Sosic, June 11, 2016.
*/

#ifndef HCSR04_H
#define HCSR04_H

#include "Arduino.h"


    /**
     * Measures distance by sending ultrasonic waves and measuring time it takes them
     * to return.
     * @returns Distance in centimeters, or negative value if distance is greater than 400cm.
     */
float measureDistanceCm(byte sensorPin);

    /**
     * Measures distance by sending ultrasonic waves and measuring time it takes them
     * to return. Measurement can not exceed duration calculated with maxDistanceCm or maxTimeoutMicroSec.
     * @param temperature  Temperature in degrees celsius
     * @returns Distance in centimeters, or negative value if distance is greater than 400cm.
     */
float measureDistanceCm(float temperature, byte sensorPin);


#endif // HCSR04_H