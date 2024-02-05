#include <FastLED.h>
#include <Servo.h>

#define NUM_LEDS 48 // number of LEDs in ring
#define DATA_PIN 4 // data pin for LED ring
#define LED_TYPE WS2812B // controller type for LEDs
#define WATER_MODE 0 
#define SUNLIGHT_MODE 1
#define MAX_BRIGHTNESS 30
#define TAP_INPUT_THRESHOLD 10 //minimum value needed for tap to be considered open


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
int statMode = WATER_MODE; //0 = water, 1 = health

int growth = 0;
int servoVal = 70; // sets inital servo angle to 70 (makes it kind of horizontal)

int blah = 0;

void setup() {

  // initialize the pushbutton pin as an input:
  pinMode(pinButton, INPUT);

  FastLED.addLeds<LED_TYPE, DATA_PIN>(leds, NUM_LEDS);
  FastLED.clear();
  FastLED.show();
  
  Serial.begin(9600);

  myservo.attach(9);
  myservo.write(servoVal);
  delay(500);
  myservo.detach();
}

void loop() {
  
  // int buttonValue = digitalRead(pinButton);
  // Serial.print('\n');
  // Serial.print("button: ");
  // Serial.print(buttonValue);
  // Serial.print('\n');

  // updateButton();

  // Serial.print("Stat mode: ");
  // Serial.print(statMode);
  // Serial.print('\n');


  if(statMode == WATER_MODE){
    if(statModeChanged) setAllLeds(CRGB(0, 0, 0));
    int num_full_leds = waterLevel / 255; //number of LED's that should be at max brightness
    int excessWater = waterLevel % 255; //amount of water leftover after filling max LED's

    //Fill first LED's to max brightness
    for (int i = 0; i < num_full_leds; i++){
      leds[i] = CRGB(0, 0, MAX_BRIGHTNESS); //blue base colour
      if(statModeChanged){ //only animate loading up if stat we are viewing has changed (or on startup)
        delay(20);
        updateButton();
      }
      updateButton();
      FastLED.show();
    }

    //Fill next LED to leftover water brightness
    Serial.println(excessWater * 200/255);
    if (num_full_leds < NUM_LEDS){
      // Serial.print(excessWater);
      leds[num_full_leds] = CRGB(0, 0, excessWater * MAX_BRIGHTNESS / 255);
    }

    //Set remaining LED's to min brightness
    for(int i = num_full_leds + 1; i < NUM_LEDS; i++){
      leds[i] = CRGB(0, 0, 0);
    }

    FastLED.show();
    statModeChanged = false;
  }

  sunlightValue = analogRead(pinLight);
  Serial.print("sunlight: ");
  Serial.print(sunlightValue);
  Serial.print('\n');

  if(statMode == SUNLIGHT_MODE){
    Serial.print("now displaying sunlight");
    if(statModeChanged) setAllLeds(CRGB(0, 0, 0));
    int num_sunlight_leds = (sunlightValue * NUM_LEDS) / 1024;
    for(int i = 0; i < num_sunlight_leds; i++){
      leds[i] = CRGB(MAX_BRIGHTNESS, MAX_BRIGHTNESS, 0);
      if(statModeChanged){
        FastLED.show();
        delay(20);
        updateButton();
      }
    }
    statModeChanged = false;
    FastLED.show();
  }


  tapValue = analogRead(pinTap);
  if(tapValue > TAP_INPUT_THRESHOLD){
    waterLevel += map(tapValue, 0, 1023, 0, 150);
    if(statMode == WATER_MODE) tapOpenAnimation(map(tapValue, 0, 1023, 50, 10));
    else{
      for(int i = 0; i< waterLevel / 255; i++){
        delay(map(tapValue, 0, 1023, 50, 10));//fake delay so rate of change consistent when we are showing other stats
        updateButton();
      }
    }
  }
  else{
    if(statMode == WATER_MODE) tapClosedAnimation();
    else{
      for(int i = 0; i< waterLevel / 255; i++) {
        updateButton();
        delay(20);
        } //fake delay so rate of change consistent when we are showing other stats
    }
    waterLevel -= 60;
  }

  // ensure water level is bounded
  if(waterLevel < 0) waterLevel = 0;
  if(waterLevel > MAX_WATER_LEVEL) waterLevel = MAX_WATER_LEVEL;



  buttonChanged = false;
  
}

//set all Led's to a given colour
void setAllLeds(CRGB colour){
  for(int i = 0; i < NUM_LEDS; i++){
    leds[i] = colour;
  }
}

//creates water filling / loading effect by temporarily dimming each light in ascending order
void tapOpenAnimation(int fillSpeed){
  for(int i = 0; i < waterLevel / 255; i++){
      CRGB temp = leds[i];
      leds[i] = CRGB(0, 0, 3); //blue base colour
      FastLED.show();
      delay(fillSpeed);
      leds[i] = temp;
      updateButton();
  }
}

//creates water reducing effect by dimming lights in reverse order
void tapClosedAnimation(){
  for(int i = waterLevel / 255; i >= 0; i--){
      CRGB temp = leds[i];//save original colour
      leds[i] = CRGB(0, 0, 3); //dim light temporarily
      FastLED.show();
      delay(20);
      updateButton();
      leds[i] = temp;//restore light to original brightness
  }
}

//checks if button is being pressed and updates stat mode accordingly
void updateButton(){
  if(digitalRead(pinButton) == HIGH && !buttonChanged){
    statMode += 1;
    if(statMode > SUNLIGHT_MODE) statMode = 0; //reset to first mode if we've cycled through them all
    buttonChanged = true;
    statModeChanged = true;
    delay(100);//Delay added incase button click lasts longer than one tick
  }
}