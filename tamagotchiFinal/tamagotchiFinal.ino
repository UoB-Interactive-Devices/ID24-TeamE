
#include <Servo.h>

Servo myservo;  // create servo object to control a servo

const int sensorPin = A0;
const int pinTap = A1;
const int pinArray[] = {3, 5, 6, 11, 13}; // led array
const int numPins = sizeof(pinArray) / sizeof(pinArray[0]);
int ledValue[] = {255, 255, 128, 0, 0, 0};
unsigned long lastRunTime = -30000;  // Global variable to store the last sensor read time
const unsigned long ReadInterval = 30000;  // Interval to read sensor (1 minute = 60,000 milliseconds)
bool growing = false;
int servoVal = 71;
int waterLevel;
bool dead = false;
bool overFill = false;



void setup() { 
  // put your setup code here, to run once:
  Serial.begin(9600);
  for (int i = 0; i < numPins; i++) {
    pinMode(pinArray[i], OUTPUT);
  }

  myservo.attach(7);
}


void loop() {

  if (servoVal <= 70 && waterLevel < 255) { // Checks if the plant is dead
    dead = true;
  }

  if (!dead) { // do this if the plant is alive
    unsigned long currentTime = millis();
    int lightValue = analogRead(sensorPin); // Reads light value
    int tapValue = analogRead(pinTap); // Reads potentiometer value

    if (tapValue > 2) { // Set threshold to 2 because the potentiometer
      filling(tapValue);
      if (!overFill) chargeLightEffect();
    }

    waterLevel = calcWaterLevel();
    if (waterLevel > 1275 && tapValue > 2) {
      Serial.println("Overfill");
      overFiilLightEffect();
      overFill = true;
    }
    else overFill = false;
    if (waterLevel >= 1530) dead = true;


    Serial.print("Light Val: " + String(lightValue)); // Print the sensor value
    Serial.print("   Tap Val: " + String(tapValue)); // Print tap value
    Serial.print("   Water Level: " + String(waterLevel)); // Prints the water value (sum of ledValue)
    Serial.print("   Servo Pos: " + String(servoVal)); // Prints the current position of the servo
    // Print the LED values
    Serial.print("   LED Values: ");
    for (int i = 0; i < numPins; i++) {
      Serial.print(ledValue[i]);
      Serial.print(" ");
    }
    Serial.println(); // End the line

    // Runs every 30 seconds
    if (currentTime - lastRunTime >= ReadInterval) {
      waterLevelDecrease();
      dischargeLightEffect();
      if (waterLevel > 510 && lightValue >= 500) {
        if (servoVal < 180) servoVal += 5;
      }
      else {
        if (servoVal >= 70)
        servoVal -= 1;
      }
      myservo.write(servoVal);
      // Update the last sensor read time
      lastRunTime = currentTime; 
    }

    updateLights(); // updates the leds to reflect the new values
  }
  else{ // do this is the plant is dead
    Serial.println("Dead");
    myservo.write(70);
    deadLightEffect();
  }




  delay(500); 
}

int calcWaterLevel() {
  int sum = 0;
  for (int i = 0; i < numPins + 1; i++) {
    sum += ledValue[i];
  }
  if (!overFill) ledValue[5] = 0;
  return sum;
}

void filling(int tapValue) {
  int currentLED = 0;
  bool found = false;
  while (found == false){
    if (ledValue[currentLED] >= 255) {
      currentLED += 1;
    }
    else {
      found = true;
    }
  }
  int increaseValue = map(tapValue, 0, 1023, 0, 40);
  if ((ledValue[currentLED] + increaseValue) >= 255) {
    ledValue[currentLED + 1] = increaseValue - (255 - ledValue[currentLED]);
    ledValue[currentLED] = 255;
  } 
  else ledValue[currentLED] += increaseValue;
}

void waterLevelDecrease() {
  int currentLED = 4;
  bool found = false;
  while (found == false){
    if (ledValue[currentLED] <= 0) {
      currentLED -= 1;
    }
    else {
      found = true;
    }
  }
  if ((ledValue[currentLED] - 5) < 0) ledValue[currentLED] = 0;
  else ledValue[currentLED] -= 5;
}

void chargeLightEffect() {
  for (int i = 0; i < numPins; i++) {
    if (ledValue[i] > 0) {
        analogWrite(pinArray[i], ledValue[i] - (0.75 * ledValue[i]));
    }
    delay(100);
    analogWrite(pinArray[i], ledValue[i]);
  }
}

void dischargeLightEffect() {
  for (int i = 5; i >= 0; i--) {
    if (ledValue[i] > 0) {
        analogWrite(pinArray[i], ledValue[i] - (0.75 * ledValue[i]));
    }
    delay(100);
    analogWrite(pinArray[i], ledValue[i]);
  }
}

void updateLights() {
  for (int i = 0; i < numPins; i++) {
    analogWrite(pinArray[i], ledValue[i]);
  }
}

void overFiilLightEffect() {
  for (int i = 0; i < numPins; i++) {
    analogWrite(pinArray[i], 0);
  }
  delay(50);
  for (int i = 0; i < numPins; i++) {
    analogWrite(pinArray[i], 255);
  }
  delay(50);
}

void deadLightEffect() {
  for (int i = 0; i < numPins; i++) {
    analogWrite(pinArray[i], 0);
  }
  delay(500);
  analogWrite(pinArray[0], 255);
}
