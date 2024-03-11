int motorPin1 = 2; 
int motorPin2 = 3;
int motorPin3 = 4; 
int motorPin4 = 5;

const int buzzer = 9; //buzzer to arduino pin 9

void setup() {
  // Set motor pins as outputs
  pinMode(motorPin1, OUTPUT);
  pinMode(motorPin2, OUTPUT);
  pinMode(motorPin3, OUTPUT);
  pinMode(motorPin4, OUTPUT);

  pinMode(buzzer, OUTPUT); // Set buzzer - pin 9 as an output

  // Start serial communication
  Serial.begin(9600);
}

void loop() {

  tone(buzzer, 5000); // Send 1KHz sound signal...
  delay(1000);         // ...for 1 sec
  noTone(buzzer);     // Stop sound...
  delay(1000);         // ...for 1sec

  if (Serial.available() > 0) {
    char command = Serial.read();
    
    // Turn off all motors
    digitalWrite(motorPin1, LOW);
    digitalWrite(motorPin2, LOW);
    digitalWrite(motorPin3, LOW);
    digitalWrite(motorPin4, LOW);

    // Check the command and activate the corresponding motor
    switch(command) {
      case '1':
        digitalWrite(motorPin1, HIGH);
        delay(1000); // Wait for 1 second
        digitalWrite(motorPin1, LOW);
        break;
      case '2':
        digitalWrite(motorPin2, HIGH);
        delay(1000); // Wait for 1 second
        digitalWrite(motorPin2, LOW);
        break;
      case '3':
        digitalWrite(motorPin3, HIGH);
        delay(1000); // Wait for 1 second
        digitalWrite(motorPin3, LOW);
        break;
      case '4':
        digitalWrite(motorPin4, HIGH);
        delay(1000); // Wait for 1 second
        digitalWrite(motorPin4, LOW);
        break;
    }
  }
}
