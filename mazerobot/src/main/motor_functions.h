#ifndef MOTOR_FUNCTIONS_H
#define MOTOR_FUNCTIONS_H
#include <Arduino.h>

void motorSetup();
void runMotors(int leftSpeed,int rightSpeed);
void slowForward();

void fastForward();

void stop();

void slightRight();

void sharpRight();

void slightLeft();

void sharpLeft();

void adjust(int motorSpeed); 

#endif
