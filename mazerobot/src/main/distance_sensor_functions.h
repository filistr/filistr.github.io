#ifndef DISTANCE_SENSOR_FUNCTIONS_H
#define DISTANCE_SENSOR_FUNCTIONS_H
#include <Arduino.h>
#include "HCSR04.h"

void sensSetup();

float distSensReadingFrontCenter();

float distSensReadingFrontRight();

float distSensReadingRight();

float distSensReadingLeft();
#endif