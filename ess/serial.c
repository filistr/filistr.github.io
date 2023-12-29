#include "serialport.h"
#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>
#include <stdlib.h>
#include <string.h>


int main(void)
{
	/*Declaration of variables*/
	int sp,sl;
	char cin[4];
	char cout[4];
	unsigned char currentSpeed[4]; 
	unsigned char inputSpeed[4];
	char enterSpeed[3];
	
	/*Initialise serial port */
	sp = serial_init("/dev/ttyS0",0);
	if(sp == 0)
	{
		printf("Error! Serial port could not be opened.\n");
	}
	else
	{
		printf("Serial port open with identifier %d \n",sp);
	}
	
	/*Initialise both strings - they are initially different! */
	/*The max size of the strings is 6 characters (by declaration)*/
	/*Leave space for the termination character!*/
	
		printf("Write speed 'W' or read speed 'R' ");
		scanf("%s", cin);
		
		if (cin[0] == 'R') {
			write(sp,cin,1);
			read(sp, &currentSpeed[0],1);
			read(sp, &currentSpeed[1],1);
			read(sp, &currentSpeed[2],1);
			printf("Speed is: %s", currentSpeed);
			} else if (cin[0] == 'W') {
			write(sp,cin,1);
			printf("Enter speed: ");
			scanf("%s", enterSpeed);
			write(sp, enterSpeed, 3);
			read(sp, &inputSpeed[0],1);
			read(sp, &inputSpeed[1],1);
			read(sp, &inputSpeed[2],1);
			printf("Speed is updated to: %s", inputSpeed);
			printf("\n");
		
	}
	
	/*Close the serial port */	
	serial_cleanup(sp);
	return 1;
}