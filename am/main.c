
#define F_CPU 1000000
#include <avr/io.h>
#include <avr/interrupt.h>
#include <util/delay.h>
#include <stdio.h>
#include <inttypes.h>
#include <string.h>
#include <stdlib.h>

#define STATE_00 0b00000000
#define STATE_01 0b00010000
#define STATE_10 0b00100000
#define STATE_11 0b00110000

#define BAUD 2400
#define FOSC 1000000 // Clock Speed
#define MYUBRR FOSC/16/BAUD-1 //25
#define BUFFER_SIZE 16
#define FRACTION_BITS 8

int init_INTs(void);
int updatePWM(int);
int initPWM(void);
int init_LEDs(void);
void USART_Init(unsigned int);
void USART_Transmit(unsigned char);
int set_LED(int, int); 
unsigned char USART_Receive(void); 
void init_Ex1(void);
int calculateSpeed();
void printSpeed(); 
void USART_Receive_String(int); 
void USART_Flush();
void control();
void init_ADC();
void fineTune();
int32_t multiply(int32_t x, int32_t y);

volatile int n = 100;
volatile uint64_t ticks[BUFFER_SIZE]; 
volatile unsigned int myIndex = 0;
volatile int inputSpeed;
volatile int refSpeed;
int32_t KP = 256; //2 * (1 << FRACTION_BITS) 128
int32_t KI = 512; //1 *(1 << FRACTION_BITS); 128
int32_t iteration_time = 80; //24 for 0.098
int32_t integral = 0;
volatile int overflows = 0; 
volatile int8_t ADC_value = 0;
//uint8_t AB; /*TEST INTERRUPT*/

//0000 . 1000 0000 = 128 = 0.5

int main(void)
{
	
	init_Ex1();
	init_INTs();
	initPWM();
	init_LEDs();
	init_ADC();
	//updatePWM(n);
	USART_Init(MYUBRR);
	sei(); 
		 while (1) {
			/*TEST PWM*/
			/*
				_delay_ms(500);
				n+=10;
				if (n>255)
				{
				n = 10;
				}
				updatePWM(n);*/
			}
}
	
void USART_Init(unsigned int ubrr)
{
	/*Set baud rate */
	UBRR0H = (unsigned char)(ubrr>>8);
	UBRR0L = (unsigned char)ubrr;
	/*Enable receiver and transmitter */
	UCSR0B = (1<<RXEN0)|(1<<TXEN0)|(1<<RXCIE0); 
	/* Set frame format: 8data, 1 stop bit */
	//UCSR0C = (3<<UCSZ00);
}
	
ISR (USART_RX_vect) {
	char c = USART_Receive();
	if (c == 'R') {
		int currentSpeed = calculateSpeed();
		printSpeed(currentSpeed);
		
	} else if (c == 'W') {
		uint8_t oldSpeed = inputSpeed; 
		USART_Receive_String(3);
		if (oldSpeed != inputSpeed) {
			if (inputSpeed < 0) {
				inputSpeed = 0;
				} else if (inputSpeed > 255) {
				inputSpeed = 255;
			}
			refSpeed = inputSpeed; 
		}
	}
}

void USART_Receive_String(int size)
	{
		char string[size];
		for (int i = 0; i < size; i++) {
			string[i] = USART_Receive(); 
		}
		inputSpeed = atoi(string); 
		USART_Flush();
		printSpeed(inputSpeed); 
	}
	
	void USART_Flush( void )
	{
		unsigned char dummy;
		while ( UCSR0A & (1<<RXC0) ) dummy = UDR0;
	}


void USART_Transmit( unsigned char data )
{
	/* Wait for empty transmit buffer */
	while ( !( UCSR0A & (1<<UDRE0)) )
	;
	/* Put data into buffer, sends the data */
	UDR0 = data;
}


unsigned char USART_Receive( void )
{
	/* Wait for data to be received */
	while ( !(UCSR0A & (1<<RXC0)) )
	;
	/* Get and return received data from buffer */
	return UDR0;
}

int calculateSpeed(void)
{
	unsigned long tot_ticks = 0;
	
	for (int k = 0; k < BUFFER_SIZE; k++) {
		tot_ticks += ticks[k];
	}
	int speed = (BUFFER_SIZE*F_CPU*60)/(8*96*tot_ticks);

	return speed;
}

void printSpeed(unsigned int speed) {
		char string[3]; 
		sprintf(string, "%d", speed);
		for (int i = 0; i < 3; i++) {
			USART_Transmit(string[i]);
		}
		
		USART_Transmit(' ');
}

void init_ADC() {
	 //voltage reference REFS0 and pin MUX1 
	ADCSRA |= (1 << ADPS2) | (1 << ADPS1) | (1 << ADPS0); //PRESCALE 128
	ADCSRA |= (1 << ADEN); 
	DDRC &= ~(1<<DDC3);
	ADMUX |=  (1 << REFS0) | (1 << MUX0) | (1 << MUX1) ;
}

void fineTune() {
	ADCSRA |= (1 << ADSC); //ADC start conversion
	while (ADCSRA & (1 << ADSC));
	int ADC_input = ADC;
	int ADC_speed = (ADC_input - 512) / 51; // -10 if ADC = 0 and 10 if ADC = 1023
	ADC_value = ADC_speed;
}

void control() {
	int speed = calculateSpeed(); 
	int32_t error = ((refSpeed + ADC_value) - speed) * (1 << FRACTION_BITS);
	integral += multiply(error, iteration_time);
	int32_t pwm = (multiply(KP, error) + multiply(KI, integral)) >> FRACTION_BITS; 
	
	if (pwm > 255) {
	pwm = 255;
	}
	if (pwm < 0) {
	pwm = 0;
	}
	updatePWM(pwm); //COMMENT WHEN /*TEST INTERRUPT*/ or /*TEST PWM/*
	}
	
int32_t multiply(int32_t x, int32_t y) {
	int64_t product = (x * y); 
	int32_t rounded_product = (int32_t) product + 128; //+128 0.5 ROUNDING
	return rounded_product >> FRACTION_BITS;	
	//(<< multiply) (>> divide)
	//mulitplier must be a 2^
	//if we use 32 bit ints, MSB for integer part and LSB for fraction
	//(integer) 0000000000000000.0000000000000000 (fraction)
	
}

ISR(PCINT1_vect)
{ 
	cli(); 
	
	unsigned int i = TCNT1; 
	
	if (i > 370 && i < 15725) { //15725 //9765
		if (myIndex == BUFFER_SIZE) {
			myIndex = 0;
		}
		ticks[myIndex] = i; 
		myIndex++;
		
	}
	TCNT1 = 0; 
	
	sei();
	
	/*TEST INTERRUPTS*/
	
	/*uint8_t ABnew = PINC & ((1<<PINC5)|(1<<PINC4));
		switch (ABnew) {
			case STATE_00:
			if (AB==STATE_01) {
				n++;
				} else {
				n--;
			}
			break;
			case STATE_01:
			if (AB==STATE_11) {
				n++;
				} else {
				n--;
			}
			break;
			case STATE_10:
			if (AB==STATE_00) {
				n++;
				} else {
				n--;
				
			}
			break;
			case STATE_11:
			if (AB==STATE_10) {
				n++;
				} else {
				n--;
			}
			break;
		}
		
		if (n > 254) {
			n = 255;
		}
		if (n < 0) {
			n = 0;
		}
		
		AB = ABnew;
		updatePWM(n);
		sei();

	*/
	} 

int init_INTs(void)
{
	DDRC &= ~((1<<DDC5)|(1<<DDC4)); // PINC5 - PINC4 set as inputs
	PORTC &= (1<<PC5)|(1<<PC4); 
	PCICR |= (1<<PCIE1); // The PC interrupt group 1 (PCINT14 -> PCINT8) enabled
	PCMSK1 |= (1<<PCINT13)|(1<<PCINT12);   //PCINT13 - PCINT11 enabled
	/*TEST INTERRUPTS*/
	//AB = PINC & ((1<<PINC5)|(1<<PINC4));  
	return 1;
}

void init_Ex1(void) 
{
	TCCR1B |= (1<<CS11); //8 PRESCALE
	TCCR2B = (1 << CS22) | (1 << CS20); //control clock, 8-bit counter with prescale 128
	
	/* Enable Overflow Interrupt */
	//Will overflow after 32.768 ms
	TIMSK2 = (1 << TOIE2); 
}

ISR (TIMER2_OVF_vect) 
{
	cli(); 
	overflows++; 
	if (overflows == 5) { //98.304 ms (interval time) *3 && 163.840
		fineTune();
		control(); 	
		overflows = 0;
		
	}
	/* Clear overflow flag */
	TIFR2 = (1 << TOV2);
	sei(); 
}


int initPWM(void)
{
	DDRD |= (1<<DDD5);		//Set PIND5
	TCCR0A |= 0b10110011;	//001//Configure fast PWM mode, non-inverted output on OCA and inverted output on OCB
	TCCR0B |=  0x01;		
	return 1;
}


int updatePWM(int value)
{
	OCR0A = value; 
	OCR0B = value;
	return value;
}



int init_LEDs(void)
{
	DDRD |= (1 << PD7) | (1 << PD6); //LED 0 & 1
	DDRB |= (1 << PB7) | (1 << PB6); //LED 2 & 3
	return 1;
}

int set_LED(int position, int value)
{
	switch(position)
	{
		case 0:
		if (value == 0)
		{
			PORTD &= ~(1 << PD7);
		}
		else
		{
			PORTD |= (1 << PD7);
		}
		break;
		case 1:
		if (value == 0)
		{
			PORTD &= ~(1 << PD6);
		}
		else
		{
			PORTD |= (1 << PD6);
		}
		break;
		case 2:
		if (value == 0)
		{
			PORTB &= ~(1 << PB7);
		}
		else
		{
			PORTB |= (1 << PB7);
		}
		break;
		case 3:
		if (value == 0)
		{
			PORTB &= ~(1 << PB6);
		}
		else
		{
			PORTB |= (1 << PB6);
		}
		break;
		
	}
	return 1;
}
			


				