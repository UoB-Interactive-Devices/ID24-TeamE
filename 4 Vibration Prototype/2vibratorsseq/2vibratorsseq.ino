/*
    Vibration Motor with Arduino
    For more details, visit: https://techzeero.com/arduino-tutorials/vibration-motor-with-arduino/
*/
int motorPin1 = 2; 
int motorPin2 = 3;
int motorPin3 = 4; 
int motorPin4 = 5;

int sequence[] = {2,3,4,5,2,5,2,4,2,3,2,5,2,3,4,3,5,2,4};

void setup()
{
pinMode(motorPin1, OUTPUT);
pinMode(motorPin2, OUTPUT);
pinMode(motorPin3, OUTPUT);
pinMode(motorPin4, OUTPUT);
}
void loop(){
  Serial.println("random sequence started.");


for (int i = 0; i < 19; i++){
  int selectedMotor = sequence[i];
  for (int j = 2; j <= 5; j++){
    if(j == selectedMotor) digitalWrite(j, HIGH); //vibrate
    else digitalWrite(j, LOW);  //stop vibrating
  }
  Serial.println(selectedMotor - 1);
  delay(2000);
}

  Serial.println("random sequence ended.");


digitalWrite(motorPin1, HIGH); //vibrate
digitalWrite(motorPin2, LOW);  //stop vibrating
digitalWrite(motorPin3, LOW);  //stop vibrating
digitalWrite(motorPin4, LOW);  //stop vibrating
delay(1000);  // delay one second
digitalWrite(motorPin1, LOW); //vibrate
digitalWrite(motorPin2, HIGH);  //stop vibrating
digitalWrite(motorPin3, LOW);  //stop vibrating
digitalWrite(motorPin4, LOW);  //stop vibrating
delay(1000); //wait 50 seconds.
digitalWrite(motorPin1, LOW); //vibrate
digitalWrite(motorPin2, LOW);  //stop vibrating
digitalWrite(motorPin3, HIGH);  //stop vibrating
digitalWrite(motorPin4, LOW);  //stop vibrating
delay(1000); //wait 50 seconds.
digitalWrite(motorPin1, LOW); //vibrate
digitalWrite(motorPin2, LOW);  //stop vibrating
digitalWrite(motorPin3, LOW);  //stop vibrating
digitalWrite(motorPin4, HIGH);  //stop vibrating
delay(1000); //wait 50 seconds.

}