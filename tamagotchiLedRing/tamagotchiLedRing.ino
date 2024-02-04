#include <FastLED.h>

#define NUM_LEDS 48
#define DATA_PIN 3
#define LED_TYPE WS2812B

CRGB leds[NUM_LEDS];

const int pinTap = A1;
int waterLevel = 24*255; // Set your maximum water level here


void setup() {
  FastLED.addLeds<LED_TYPE, DATA_PIN>(leds, NUM_LEDS);
  FastLED.clear();
  FastLED.show();
}

void loop() {

  // Gradually fill up the LED strip
  for (int level = 0; level < waterLevel / 255; level++) {
    for (int i = 0; i < NUM_LEDS; i++) {
      if (i <= level) {
        leds[i] = CRGB(0, 0, 200); // Base blue color
      } else {
        // leds[i] = CRGB::Black; // LEDs above water level are off
      }
    }

    FastLED.show();
    delay(100); // Control the speed of the 'filling up' effect
  }

  // Apply the twinkling effect constantly
  while (true) {
    for (int i = 0; i < waterLevel; i++) {
      // Add subtle twinkling with minor color variations
      if (random(10) > 7) { // Adjust the frequency of twinkles here
        int subtleTwinkle = 180 + random(76); // Subtle variation in blue
        leds[i] = CRGB(0, 0, subtleTwinkle);
      } else {
        leds[i] = CRGB(0, 0, 200); // Base blue color
      }
    }
    FastLED.show();
    delay(50); // Control the speed of the twinkling effect
  }
}