// TODO:
// -Investigate electron one more time
// -Investigate linking javascript to python.
// -Investigate python GUI and sound libraries.




//This code handles converting letters recieved from serial into vibrational pulses
//run this with the corresponding python program (or any program that can send a single char to serial)
//it's best practice to close Arduino IDE when using the python program.
  //Also ensure you terminate the python program before sending new code to the Arduino

  //Ensure the python program uses the port number of the arduino as shown in this IDE to begin its serial connection



// int motorPin1 = 2; int motorPin2 = 3; int motorPin3 = 4; int motorPin4 = 5; int motorPin5 = 6; int motorPin6 = 7;
//configures the output pins to 2X3 Braille grid
int motorPin1 = 2; int motorPin2 = 3;
int motorPin3 = 7; int motorPin4 = 4;
int motorPin5 = 6; int motorPin6 = 5;
int motors[6] = {motorPin1, motorPin2, motorPin3, motorPin4, motorPin5, motorPin6};


const int PULSE_DURATION = 1000;//how long should each braille buzz last



//All the motors that need to be activated for each letter
int aMotors[6] = {1,0,0,0,0,0};
int bMotors[6] = {1,0,1,0,0,0};
int cMotors[6] = {1,1,0,0,0,0};
int dMotors[6] = {1,1,0,1,0,0};
int eMotors[6] = {1,0,0,1,0,0};
int fMotors[6] = {1,1,1,0,0,0};
int gMotors[6] = {1,1,1,1,0,0};
int hMotors[6] = {1,0,1,1,0,0};
int iMotors[6] = {0,1,1,0,0,0};
int jMotors[6] = {0,1,1,1,0,0};
int kMotors[6] = {1,0,0,0,1,0};
int lMotors[6] = {1,0,1,0,1,0};
int mMotors[6] = {1,1,0,0,1,0};
int nMotors[6] = {1,1,0,1,1,0};
int oMotors[6] = {1,0,0,1,1,0};
int pMotors[6] = {1,1,1,0,1,0};
int qMotors[6] = {1,1,1,1,1,0};
int rMotors[6] = {1,0,1,1,1,0};
int sMotors[6] = {0,1,1,0,1,0};
int tMotors[6] = {0,1,1,1,1,0};
int uMotors[6] = {1,0,0,0,1,1};
int vMotors[6] = {1,0,1,0,1,1};
int wMotors[6] = {0,1,1,1,0,1};
int xMotors[6] = {1,1,0,0,1,1};
int yMotors[6] = {1,1,0,1,1,1};
int zMotors[6] = {1,0,0,1,1,1};

//array of all leters
int * brailleLetters[26] = {aMotors, bMotors, cMotors, dMotors, eMotors, fMotors, gMotors, hMotors, iMotors, jMotors, kMotors, lMotors, mMotors, nMotors, oMotors, pMotors, qMotors, rMotors, sMotors, tMotors, uMotors, vMotors, wMotors, xMotors, yMotors, zMotors};


// int* keyToBraille(String key){
//   if key == 

// }

bool serialChecked = false;


bool isVowel(char letter){
  if(letter == 'a' || letter == 'e' || letter == 'i' || letter == 'o' || letter == 'u') return true;
  else return false;
}

//regular single pulse vibration of activated motors
void vibrate(int * motorsConfig){
        for(int i = 0; i < 6; i++){
          if(motorsConfig[i] == 1){
            digitalWrite(motors[i], HIGH);
            }
        }
        delay(PULSE_DURATION);
}

//double pulsation of activated motors
void pulsateVibrate(int * motorsConfig){
  for(int pulseNumber = 0; pulseNumber < 2; pulseNumber++){
    for(int i = 0; i < 6; i++){
      if (motorsConfig[i] == 1) digitalWrite(motors[i], HIGH);
    }
    delay(PULSE_DURATION / 2);
    for(int i = 0; i < 6; i++){
      if (motorsConfig[i] == 1) digitalWrite(motors[i], HIGH);
    }
    delay(50);
  }
}

//turns all motors off
void setAllMotorsLow(){
    for(int i = 0; i < 6; i++){
      digitalWrite(motors[i], LOW);
    }
}

//returns the array indicating which motors should be activated given a number or letter
int* decodeLetter(char letter) {
    int *highMotors = new int[6]; // Dynamically allocate memory



    //accesses the corresponding letter from alphabet array based on the received letter
    //returns the associated motor configuration
    if(letter >= 'a' && letter <= 'z'){
      int index = letter - 'a';
        for (int i = 0; i < 6; ++i) {
            highMotors[i] = brailleLetters[index][i];
        }

    }

    //if it's a number referring to which motor to activate then set that one motor to HIGH
    else if (letter >= '1' && letter <= '6'){
        highMotors[letter - '1'] = 1;
        // Handle other cases, or return some default value
    }

    return highMotors;
}

void cleanup(int* ptr) {
    delete[] ptr; // Deallocate memory when done using the pointer
}

void setup() {



  //sets the output pins for the 6 motors
  pinMode(motorPin1, OUTPUT);
  pinMode(motorPin2, OUTPUT);
  pinMode(motorPin3, OUTPUT);
  pinMode(motorPin4, OUTPUT);
  pinMode(motorPin5, OUTPUT);
  pinMode(motorPin6, OUTPUT);

  Serial.begin(9600);
}

void loop() {

    setAllMotorsLow();

    if (Serial.available() > 0) {
      if(serialChecked){
        digitalWrite(motors[0], HIGH);
        delay(1000);
        digitalWrite(motors[1], HIGH);
        delay(1000);
        digitalWrite(motors[2], HIGH);
        delay(1000);
        digitalWrite(motors[3], HIGH);
        delay(1000);
        serialChecked = true;
      }
      //if signal is a number then set the corresponding motor to high
      char command = Serial.read();
      if (command >= '1' && command <= '6'){
        digitalWrite(motors[command - '0' - 1], HIGH);
            delay(1000);
      }
      //if signal is a letter then activate corosponding motor(s)
      else if (command >= 'a' && command <= 'z'){
        int* highMotors = decodeLetter(command);

        if(isVowel(command)){
          pulsateVibrate(highMotors);
        }

        else{
          vibrate(highMotors);
        }
      }

    }


}
