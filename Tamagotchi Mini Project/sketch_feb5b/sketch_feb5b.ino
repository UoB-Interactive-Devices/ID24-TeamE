#include <FastLED.h>
#include <Servo.h>

#define NUM_LEDS 48 // number of LEDs in ring
#define DATA_PIN 4 // data pin for LED ring
#define LED_TYPE WS2812B // controller type for LEDs
#define WATER_MODE 0 
#define SUNLIGHT_MODE 1
#define MAX_BRIGHTNESS 30
#define MIN_GROWTH 0
#define MAX_GROWTH 10000


#define TAP_INPUT_THRESHOLD 10 //minimum value needed for tap to be considered open

const long DECAY_FREQ = 100;
const long GROWTH_INTERVAL = 5000;

const int WATER_DECREASE_RATE = 30;

CRGB leds[NUM_LEDS];
Servo myservo;  // create servo object to control a servo

const int pinTap = A1; //potentiometer port
int tapValue = 0; //fallback tap reading

const int pinLight = A0;//LDR port
int sunlightValue = 0;

const int pinButton = A2; //Button port
bool buttonChanged = false;

int waterLevel = 26*255 + 10; // Set starting water level here: this shows 26 full LED's plus some excess
const int MAX_WATER_LEVEL = 48*255;
bool statModeChanged = true; //true if user has just switched which stat they are viewing

int growth = 70;
int growthRate = 0;
int servoVal = 70; // sets inital servo angle to 70 (makes it kind of horizontal)

int buttonPushCounter = 0;  // counter for the number of button presses
int buttonState = 0;        // current state of the button
int lastButtonState = 0;    // previous state of the button
int mode = 0; //MODES: 0 = Water level. 1 = Light Level. 2 = Health Level
bool stateModeChange = true;

int lastGrowth = 0;

unsigned long growthMillis = millis();
const long updateDelay = 100; // Shorter delay for more frequent shimmer updates

void setup() {
  Serial.begin(9600);

  pinMode(pinButton, INPUT);

  FastLED.addLeds<LED_TYPE, DATA_PIN>(leds, NUM_LEDS);
  FastLED.clear();
  FastLED.show();

  myservo.attach(9);
  myservo.write(servoVal);
  delay(500);
  myservo.detach();

}

unsigned long previousMillis1 = 0;
unsigned long previousMillis = 0;
const long animationDelay = 50; // Interval at which to update LEDs


void loop() {
  unsigned long currentMillis = millis();
  growthMillis = millis();
  Serial.println("millis: " + String(currentMillis));
  Serial.println("growth millis: " + String(growthMillis));

  buttonState = digitalRead(pinButton);
  buttonStatus();

  tapValue = analogRead(pinTap);
  sunlightValue = analogRead(pinLight);

  if (tapValue > TAP_INPUT_THRESHOLD) {
    waterFilling();
  }

  if (currentMillis - previousMillis1 >= DECAY_FREQ) {
    waterLevel -= WATER_DECREASE_RATE;
    // previousMillis1 = currentMillis;
    Serial.println(waterLevel);
    if (waterLevel <= 0) waterLevel = 0;

    growthRate = sunlightValue * 0.01 * (waterLevel / 255);

    growth += growthRate;
    if(growth >= MAX_GROWTH) growth = MAX_GROWTH;
    if(growth <= MIN_GROWTH) growth = MIN_GROWTH;

    // Serial.println("growth: " + String(growth));
    // Serial.println("growth rate: " + String(growthRate));
  }

  if (growthMillis - lastGrowth >= GROWTH_INTERVAL && servoVal < 180){
    servoVal = map(growth, MIN_GROWTH, MAX_GROWTH, 70, 180);
    Serial.println("servo: " + String(servoVal));
    Serial.println("GROWING");

      myservo.attach(9);
      myservo.write(servoVal);
      delay(500);
      myservo.detach();
      lastGrowth = millis();
  }


  //---------------------------------
  //------ WATER LEVEL MODE ---------
  //---------------------------------
  if (mode == 0) {
    previousMillis = 0;
    static int currentIndex = 0;
    int num_full_leds = waterLevel / 255;
    int excessWater = waterLevel % 255;
    static unsigned long lastUpdate = 0;
    
    Serial.println("full: " + String(num_full_leds));

    if (stateModeChange) {
      setAllLeds(CRGB(0, 0, 0));
      currentIndex = 0;
      stateModeChange = false;
      lastUpdate = currentMillis;
    }

    // // Update shimmer effect for all lit LEDs
    // if (currentMillis - lastUpdate > updateDelay) {
    //   for (int i = 0; i < currentIndex; i++) {
    //     int brightness = random(MAX_BRIGHTNESS / 2, MAX_BRIGHTNESS);
    //     int blueHue = random(160, 255); // Range of blue hues
    //     leds[i] = CRGB(150, 50, blueHue).nscale8(brightness);
    //   }
    //   FastLED.show();
    //   lastUpdate = currentMillis;
    // }


    for(int i = 0; i < NUM_LEDS; i++){
        int brightness = random(MAX_BRIGHTNESS / 2, MAX_BRIGHTNESS);
        int blueHue = random(160, 255);
      if (i < num_full_leds) {

        leds[i] = CRGB(160, 50, blueHue).nscale8(brightness);
        FastLED.show();
      }
      else if(i == num_full_leds){
        leds[i] = CRGB(160, 50, blueHue).nscale8((excessWater*brightness/255));
      }
      else{
        leds[i] = CRGB(0, 0, 0);
      }
    }

    FastLED.show();



  // //Incremental filling of LEDs
  //   if (currentMillis - previousMillis >= animationDelay) {
  //     if (currentIndex < num_full_leds) {
  //       int brightness = random(MAX_BRIGHTNESS / 2, MAX_BRIGHTNESS);
  //       int blueHue = random(160, 255);
  //       leds[currentIndex] = CRGB(160, 50, blueHue).nscale8(brightness);
  //       FastLED.show();
  //       currentIndex++;
  //       // previousMillis = currentMillis;
  //     }
  //     else{
  //       leds[currentIndex] = CRGB(0, 0, 0);
  //       if(currentIndex <= NUM_LEDS) currentIndex++;
  //     }
  //     FastLED.show();
  //   }
    
  }

//---------------------------------
//------ LIGHT LEVEL MODE ---------
//---------------------------------
if (mode == 1) { // Light Level Mode
  static unsigned long lastUpdate = 0;
  const long pulseInterval = 10000; // Interval for pulsating effect
  static int pulseDirection = 1; // Direction of pulsating (1 for increasing, -1 for decreasing)
  static int pulseBrightness = MAX_BRIGHTNESS; // Current pulsating brightness
  const int minPulseBrightness = MAX_BRIGHTNESS - 20; // Minimum brightness level for pulsating
  const int maxPulseBrightness = MAX_BRIGHTNESS; // Maximum brightness level for pulsating
  int mappedSunlightValue = map(sunlightValue, 90, 1000, 0, NUM_LEDS); // Map sunlightValue to the range of LEDs

  // Reset when mode changes
  if (stateModeChange) {
    setAllLeds(CRGB(0, 0, 0));
    pulseBrightness = maxPulseBrightness;
    pulseDirection = 1;
    stateModeChange = false;
    lastUpdate = currentMillis;
  }

  // Update LEDs based on current sunlightValue
  if (currentMillis - previousMillis >= animationDelay) {
    for (int i = 0; i < NUM_LEDS; i++) {
      if (i < mappedSunlightValue) {
        leds[i] = CRGB(pulseBrightness, pulseBrightness, 0); // Use pulseBrightness for LEDs
      } else {
        leds[i] = CRGB(0, 0, 0); // Turn off remaining LEDs
      }
    }
    FastLED.show();
  }

 }












  //---------------------------------
  //------ HEALTH LEVEL MODE ---------
  //---------------------------------
  if (mode == 2) { 
    stateModeChange = false;
    for (int i = 0; i < NUM_LEDS; i++) {
      leds[i] = CRGB(0, MAX_BRIGHTNESS, 0);
    }
    FastLED.show();
  }
  previousMillis = currentMillis;
}

void updateWaterLevelLeds(unsigned long currentMillis) {
  static int ledIndex = 0; // static variable to keep track of the current LED index
  int num_full_leds = waterLevel / 255;

  if (ledIndex < num_full_leds) {
    leds[ledIndex] = CRGB(0, 0, MAX_BRIGHTNESS);
    FastLED.show();
    ledIndex++;
    previousMillis = currentMillis; // Save the last update time
  } else {
    ledIndex = 0; // Reset the index for the next cycle
  }
}


void setAllLeds(CRGB colour) {
  for (int i = 0; i < NUM_LEDS; i++) {
      leds[i] = colour;
    }
}

void fillingAnimation() {
  for (int i = 0; i < waterLevel / 255; i++) {
    leds[i] = CRGB(0, 0, 0);
  }
}

void waterFilling() {
  if (waterLevel + map(tapValue, 0, 1023, 0, 150) >= MAX_WATER_LEVEL) {
    waterLevel = MAX_WATER_LEVEL;
  }
  else waterLevel += map(tapValue, 0, 1023, 0, 150);
}

void buttonStatus() {
  if (buttonState != lastButtonState) {
    if (buttonState == HIGH) {
      buttonPushCounter++;
      mode = buttonPushCounter % 3;
      stateModeChange = true;
    }
    delay(50); // Debounce delay
    lastButtonState = buttonState;
  }

  delay(50);
}
