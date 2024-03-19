int motorPin1 = 2;
int motorPin2 = 3;
int motorPin3 = 4;
int motorPin4 = 5;
int motorPin5 = 6;
int motorPin6 = 7;
int motors[6] = {motorPin1, motorPin2, motorPin3, motorPin4, motorPin5, motorPin6};

int aMotors[6] = {1,0,0,0,0,0};
int bMotors[6] = {1,0,1,0,0,0};
int cMotors[6] = {0,1,0,0,0,0};
int dMotors[6] = {0,1,1,0,0,0};
int eMotors[6] = {0,0,1,0,0,0};




//turns all motors off
void setAllMotorsLow(){
    for(int i = 0; i < 6; i++){
      digitalWrite(motors[i], LOW);
    }
}

int* decodeLetter(char letter) {
    int *highMotors = new int[6]; // Dynamically allocate memory

    if (letter == 'a') {
        for (int i = 0; i < 6; ++i) {
            highMotors[i] = aMotors[i];
        }
    } else if (letter == 'b') {
        for (int i = 0; i < 6; ++i) {
            highMotors[i] = bMotors[i];
        }
    } else if (letter == 'c') {
        for (int i = 0; i < 6; ++i) {
            highMotors[i] = cMotors[i];
        }
        }else if (letter == 'd') {
        for (int i = 0; i < 6; ++i) {
            highMotors[i] = dMotors[i];
        }
      }else if (letter == 'e') {
        for (int i = 0; i < 6; ++i) {
            highMotors[i] = eMotors[i];
        }
    } else {
        // Handle other cases, or return some default value
    }

    return highMotors;
}

void cleanup(int* ptr) {
    delete[] ptr; // Deallocate memory when done using the pointer
}

void setup() {
  // put your setup code here, to run once:
  pinMode(motorPin1, OUTPUT);
  pinMode(motorPin2, OUTPUT);
  pinMode(motorPin3, OUTPUT);
  pinMode(motorPin4, OUTPUT);
  pinMode(motorPin5, OUTPUT);
  pinMode(motorPin6, OUTPUT);

  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  // digitalWrite(motorPin1, LOW);
  // digitalWrite(motorPin2, LOW);
  // digitalWrite(motorPin3, LOW);  
  // digitalWrite(motorPin4, LOW);
  // digitalWrite(motorPin5, LOW);
  // digitalWrite(motorPin6, LOW);

  // delay(1000);
  // digitalWrite(motorPin1, HIGH);
  // digitalWrite(motorPin2, HIGH);
  // digitalWrite(motorPin3, HIGH);
  // digitalWrite(motorPin4, HIGH);
  // digitalWrite(motorPin5, HIGH);
  // digitalWrite(motorPin6, HIGH);
  // delay(1000);

    setAllMotorsLow();

    if (Serial.available() > 0) {
      //if signal is a number then set the corresponding motor to high
      char command = Serial.read();
      if (command >= '1' && command <= '6'){
        digitalWrite(motors[command - '0' - 1], HIGH);
            delay(1000);
      }
      //if signal is a letter then activate corosponding motor(s)
      else if (command >= 'a' && command <= 'z'){
        int* highMotors = decodeLetter(command);
        for(int i = 0; i < 6; i++){
          if(highMotors[i] == 1){
            digitalWrite(motors[i], HIGH);

          }
        }
            delay(1000);
      }

    }


}
