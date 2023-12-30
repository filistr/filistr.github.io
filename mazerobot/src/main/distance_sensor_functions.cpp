#include "distance_sensor_functions.h"

const byte frontCenter = 12;
const byte frontRight = 8; 
const byte readingRight = 13; 
const byte readingLeft = 7;

float distSensReadingFrontCenter() { 
    float distance = measureDistanceCm(frontCenter); 
    
    return distance;
}

float distSensReadingFrontRight() {
  float distance = measureDistanceCm(frontRight); 
  return distance; 
}

float distSensReadingRight() {
  float distance = measureDistanceCm(readingRight); 
  return distance; 
}

float distSensReadingLeft() {
  float distance = measureDistanceCm(readingLeft); 
  return distance; 
}

