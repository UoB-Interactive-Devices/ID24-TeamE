#BIT PACKING
#This program is a rewrite that sends signals to Serial as a packed char representing
#Which motors should be activated.


import tkinter as tk
from tkinter import ttk
from PIL import Image, ImageTk
import serial

#Avoids interacting with Serial any way and instead prints outputs of expected 
#bracelet behaviour
DEV_MODE = True

#MAC serial port format - (un)comment as needed
# SERIAL_PORT = '/dev/cu.usbmodem101'

#WINDOWS serial port format - (un)comment as needed
SERIAL_PORT = 'COM11'

#stores the motors needed to be activated for each symbol recognised by the language
alphabet = dict()

alphabet['a'] = [1,0,0,0,0,0]
alphabet['b'] = [1,0,1,0,0,0]
alphabet['c'] = [1,1,0,0,0,0]
alphabet['d'] = [1,1,0,1,0,0]
alphabet['e'] = [1,0,0,1,0,0]
alphabet['f'] = [1,1,1,0,0,0]
alphabet['g'] = [1,1,1,1,0,0]
alphabet['h'] = [1,0,1,1,0,0]
alphabet['i'] = [0,1,1,0,0,0]
alphabet['j'] = [0,1,1,1,0,0]
alphabet['k'] = [1,0,0,0,1,0]
alphabet['l'] = [1,0,1,0,1,0]
alphabet['m'] = [1,1,0,0,1,0]
alphabet['n'] = [1,1,0,1,1,0]
alphabet['o'] = [1,0,0,1,1,0]
alphabet['p'] = [1,1,1,0,1,0]
alphabet['q'] = [1,1,1,1,1,0]
alphabet['r'] = [1,0,1,1,1,0]
alphabet['s'] = [0,1,1,0,1,0]
alphabet['t'] = [0,1,1,1,1,0]
alphabet['u'] = [1,0,0,0,1,1]
alphabet['v'] = [1,0,1,0,1,1]
alphabet['w'] = [0,1,1,1,0,1]
alphabet['x'] = [1,1,0,0,1,1]
alphabet['y'] = [1,1,0,1,1,1]
alphabet['z'] = [1,0,0,1,1,1]
alphabet['motor1'] = [1,0,0,0,0,0]
alphabet['motor2'] = [0,1,0,0,0,0]
alphabet['motor3'] = [0,0,1,0,0,0]
alphabet['motor4'] = [0,0,0,1,0,0]
alphabet['motor5'] = [0,0,0,0,1,0]
alphabet['motor6'] = [0,0,0,0,0,1]

allChars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
            'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

#Converts an array correpsonding to activated motors into
#a single char that can be sent via serial
def packChar(activations):
    packedInt = 0
    for i in range(len(activations)):
        packedInt += activations[i]
        if i < 5:
            packedInt*=2
    # print("PACK -- original list: ", activations, "packed integer", packedInt)
    return packedInt

#Converts a packed char into an array of desired motor activations
def unpack(packedInt):
    activations = [0,0,0,0,0,0]
    for i in range(len(activations) - 1, -1, -1):
        print("i: ", i)
        activations[i] = packedInt%2
        packedInt = packedInt // 2
    # print("UNPACK -- packed integer: ", packedInt, "activations", activations, "\n")
    return activations

#sends the motor configuration to serial based on the symbol specified
def send_command(command):
    print("current mode: ", currentMode)
    packedChar= packChar(alphabet[command])
    print("sending packed char: ", packedChar, " from command: ", command)
    print("char form: ", chr(packedChar))

    if(not DEV_MODE):
        arduino.write(chr(packedChar).encode())
def activateMotorButton(motorButton):
    motorButton.configure(background="lightblue", highlightbackground="lightblue")
def activateMotorButtons(motorsIndices):
    for i in motorsIndices:
        buttons[i].configure(background="lightblue", highlightbackground="lightblue")

def deactivateAllMotorButtons():
    #set all buttons on GUI to default white (unactivated)
    for m in buttons:
        m.configure(background="white", highlightbackground="white")

#this runs when a key is pressed
#sends signal to arduino via serial or what char was pressed (lowercase letter or digit)
def key_press(event):
    deactivateAllMotorButtons()
    key = event.char
    print("key pressed: ", key)

    if key in ['1','2','3','4','5','6']:
        #activate a single motor
        send_command("motor" + key)
    else:
        send_command(key)

    #based on what char was sent, change the background of the corresponding motors
    if key >= 'a' and key <= 'z':
        letterConfiguration = alphabet[key]
        for i in range(len(letterConfiguration)):
            if letterConfiguration[i] == 1:
                activateMotorButtons([i])
    elif key>='1' and key <= '6':
        buttons[int(key) - 1].configure(background="lightblue", highlightbackground="lightblue")

def play_symbol(symbol):
    send_command(symbol)
    deactivateAllMotorButtons()
    motorsConfig = alphabet[symbol]#list of motor activations
    for i in range(len(motorsConfig)):
        if motorsConfig[i] == 1:
            activateMotorButtons([i])

def changeMode(mode, index):
    global currentMode
    currentMode = mode
    print("Change mode: ", mode, index)
    for i in range(len(gameModeStages)):
        if(i != index):
            gameModeStages[i].pack_forget()
    gameModeStages[index].pack()

def packPlayAlphabetButtons(container):
    buttonsPerRow = 10
    buttonWidth = 20
    buttonHeight =20

    playAlphabetRows = []

    #create rows that play buttons will be stored in
    for i in range(len(allChars) // buttonsPerRow + 1):
        row = tk.Frame(container)
        playAlphabetRows.append(row)
        row.pack()

    playAlphabetButtons = []

    for i in range(len(allChars)):
        letter = allChars[i]

        bg = "lightgreen"
        #append the button to row based on its index
        btn = tk.Button(playAlphabetRows[i // buttonsPerRow], text=letter.upper(), compound='c', highlightbackground=bg, background=bg, image = img, width=buttonWidth, height=buttonHeight)
        btn.pack(side=tk.LEFT)
        btn.configure(command= lambda letter=letter: play_symbol(letter))
        playAlphabetButtons.append(btn)
    
    return playAlphabetButtons

#Establish serial connection
if(not DEV_MODE):
    arduino = serial.Serial(SERIAL_PORT, 9600)

# Create the main window
root = tk.Tk(screenName="Vibraille")
root.title("Vibraille")
root.geometry("1000x1000")

#create a label with instructions
infoText = "\nUse the motor buttons below to calibrate bracelet positioning on your arm"
infoLabel = tk.Label(root, text = infoText)
infoLabel.pack()



#create the 2 wide by 3 high grid of buttons and their corresponding motor number
top = tk.Frame(root)
middle = tk.Frame(root)
bottom = tk.Frame(root)
top.pack(padx=5, pady=5)
middle.pack(padx=(5,5), pady=(5,5))
bottom.pack(padx=(5,5), pady=(5,5))


img = tk.PhotoImage(width=1, height=1)#dummy image used to help specify dimensions in pixels


#Create digit buttons corresponding to the activation of a single motor
motorButton1 = tk.Button(top, text="Motor 1", command=lambda: send_command("motor1"), image=img)
motorButton1.pack(side=tk.LEFT)

motorButton2 = tk.Button(top, text="Motor 2", command=lambda: send_command("motor2"), image=img)
motorButton2.pack(side=tk.RIGHT)

motorButton3 = tk.Button(middle, text="Motor 3", command=lambda: send_command("motor3"), image=img)
motorButton3.pack(side=tk.LEFT)

motorButton4 = tk.Button(middle, text="Motor 4", command=lambda: send_command("motor4"), image=img)
motorButton4.pack(side=tk.RIGHT)

motorButton5 = tk.Button(bottom, text="Motor 5", command=lambda: send_command("motor5"), image=img)
motorButton5.pack(side=tk.LEFT)

motorButton6 = tk.Button(bottom, text="Motor 6", command=lambda: send_command("motor6"), image=img)
motorButton6.pack(side=tk.RIGHT)

buttons = [motorButton1, motorButton2, motorButton3, motorButton4, motorButton5, motorButton6]

# apply common styling to all buttons
for b in buttons:
    #sets square shape
    b.configure(compound='c', width=50, height=50)
    #sets padding
    b.configure()
    b.configure(background="white", highlightbackground="white")


gameModes = tk.Frame(root)
gameModes.pack(pady=5)

modeButtonsLabel = tk.Label(gameModes, text = "Once you are ready, choose a game mode")
modeButtonsLabel.pack()

modeButtonsContainer = tk.Frame()
modeButtonsContainer.pack()

learningModeButton = tk.Button(modeButtonsContainer, text="Learn Braille", width = 15, command=lambda: changeMode("learn", 0))
quizModeButton = tk.Button(modeButtonsContainer,     text="Quiz Braille",  width = 15, command=lambda: changeMode("quiz", 1))
testingModeButton  = tk.Button(modeButtonsContainer, text="Test Braille",  width = 15, command=lambda: changeMode("test", 2))
freePlayModeButton = tk.Button(modeButtonsContainer, text="Freeplay",      width = 15, command=lambda: changeMode("play", 3))

modeButtonPadding = 10

learningModeButton.pack(side=tk.LEFT, padx = modeButtonPadding)
quizModeButton.pack(side=tk.LEFT, padx = modeButtonPadding)
testingModeButton.pack(side=tk.LEFT, padx = modeButtonPadding)
freePlayModeButton.pack(side=tk.LEFT, padx = modeButtonPadding)

currentMode = "none"

gameStage = tk.Frame(root)
gameStage.pack()

learnStage = tk.Frame(gameStage)
learnStage.pack()
learnLabel = tk.Label(learnStage, text = "LEARN", pady=20)
learnLabel.pack()
learnInfo = tk.Label(learnStage, text="Use your keyboard or the buttons below to send Braille letters to your bracelet")
learnInfo.pack()
learnButtonsContainer = tk.Frame(learnStage)
learnButtonsContainer.pack()
learnButtons = packPlayAlphabetButtons(learnButtonsContainer)
brailleRefImage=ImageTk.PhotoImage(Image.open('braille-alphabet.png').resize((500, 500)))
brailleRef = ttk.Label(learnStage, image=brailleRefImage)
brailleRef.pack(padx=50, pady=50)

quizStage = tk.Frame(gameStage)
quizStage.pack()
quizLabel = tk.Label(quizStage, text = "QUIZ", pady=20)
quizLabel.pack()
quizInfo = tk.Label(quizStage, text="A multiple choice quiz for all the letters you've been learning so far")
quizInfo.pack()

testStage = tk.Frame(gameStage)
testStage.pack()
testLabel = tk.Label(testStage, text = "TEST", pady=20)
testLabel.pack()
testInfo = tk.Label(testStage, text="A recall test for all the letters you've learnt so far. Results are given at the end")
testInfo.pack()

playStage = tk.Frame(gameStage)
playStage.pack()
playLabel = tk.Label(playStage, text = "FREEPLAY", pady=20)
playLabel.pack()
playInfo = tk.Label(playStage, text="Experiment with sending different types of signals to your bracelet and designing your own language")
playInfo.pack()



gameModeStages = [learnStage, quizStage, testStage, playStage]
for gm in gameModeStages:
    gm.pack_forget()


# Bind keyboard events
root.bind('<Key>', key_press)

# Run the application
root.mainloop()