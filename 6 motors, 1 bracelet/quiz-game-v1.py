import tkinter as tk
import serial
import random


alphabet = dict()

allChars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
            'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']


print(len(allChars))

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

#Windows file system:
arduino = serial.Serial('/dev/cu.usbmodem101', 9600)
#this needs changing depending on device and current port in use


def send_command(command):
    arduino.write(command.encode())

#this runs when a key is pressed
#sends signal to arduino via serial or what char was pressed (lowercase letter or digit)
def key_press(event):
    #set all buttons on GUI to default white (unactivated)
    for i in range(len(buttons)):
        buttons[i].configure(background="white")
    key = event.char
    send_command(key)

    #based on what char was sent, change the background of the corresponding motors
    if key >= 'a' and key <= 'z':
        letterConfiguration = alphabet[key]
        for i in range(len(letterConfiguration)):
            if letterConfiguration[i] == 1:
                buttons[i].configure(background="lightblue")
    elif key>='1' and key <= '6':
        buttons[int(key) - 1].configure(background="blue")


def set_all_elements_colour(elements, colour):
    for i in range(len(elements)):
        optionButtons[i].configure(background=colour)

def check_answer(guess, index):
    print("answer check", guess)

    set_all_elements_colour(optionButtons, "white")

    if currentAnswer[0] == guess:
        print("correct")
        optionButtons[index].configure(background="green")
    else:
        print("incorrect")
        optionButtons[index].configure(background="red")

#second version of answer checking uses a boolean as input, this is a different approach I used to assign a button's
#lambda function depending on whether it corresponds to the correct answer or not. This differs to
#v1 because v1 encodes the buttons answer within the lambda function but this became troublesome due to
#scoping and the difference between pass by reference and pass by value when defining what the next answer will be.
        
#TLDR - I don't fully get python lol oops
def check_answer2(isCorrect, index):
    print("answer V2 check", index)

    set_all_elements_colour(optionButtons, "white")

    if isCorrect:
        print("correct")
        optionButtons[index].configure(background="green")
    else:
        print("incorrect")
        optionButtons[index].configure(background="red")


def are_there_repeats(lst):
    return len(lst) > len(set(lst))

#sets up the next question by choosing 4 random letters and selecting 1 as the correct answer
def next_question(options, currentAnswer):
    print("NEXT")

    #(re)set all option buttons to default background colour
    set_all_elements_colour(optionButtons, "white")

    #randomly 4 new and unique options
    for i in range(len(options)):
        options[i] = allChars[random.randint(0, len(allChars) - 1)]
        while(are_there_repeats(options)):
            options[i] = allChars[random.randint(0, len(allChars) - 1)]
    
    print(currentAnswer)

    #randomly select the new answer and set that lettetr to sent to serial (bracelet)
    currentAnswer = [options[random.randint(0, len(options) - 1)]]
    playLetterButton.configure(text="Play letter", command = lambda currentAnswer=currentAnswer: play_letter(currentAnswer[0]))

    print(currentAnswer)

    updateOptionButtons(options, currentAnswer)

    return currentAnswer
    #return the value of the new answer
    
    
#change the appearance of the option buttons based on the new round of the quiz
#ensure the button representing the correct answer is encoded with a truthy lambda function argument
def updateOptionButtons(options, currentAnswer):

    for i in range(len(optionButtons)):
        o = options[i]
        optionButtons[i].configure(text=o, command= lambda i=i, o=o,: check_answer(o, i))
        print(currentAnswer, o)
        if o == currentAnswer[0]:
            optionButtons[i].configure(text=o, command= lambda i=i, o=o,: check_answer2(True, i))
        else:
            optionButtons[i].configure(text=o, command= lambda i=i, o=o,: check_answer2(False, i))

#sends a letter to serial (bracelet)
def play_letter(letter):
    send_command(letter)



global currentAnswer
currentAnswer = ['a']#stores the currently acceptable answer(s)

# Create the main window
root = tk.Tk()
root.title("Vibration Motor Control")


root.geometry("1000x1000")

gamemode = "calibration"

questionNo = 1
options = ['a', 'b', 'c', 'd']


# gamemodesContainer = tk.Frame(root)
# gamemodesContainer.pack()
# gamemodesLabel = tk.Label(gamemodesContainer, text="Choose mode")
# gamemodesLabel.pack()


# gamemodes = ["freeplay", "quiz"]
# gamemodeButtons = []
# for i in range(len(gamemodes)):
    # gmb = tk.Button(gamemodesContainer, text=gamemodes[i])
    # gmb.pack()

#container for all quiz/game elements
gameStage = tk.Frame(root)
gameStage.pack()
# gameStage.configure(background="blue")

optionButtonsContainer = tk.Frame(root)
optionButtonsContainer.pack()

promptLabel = tk.Label(gameStage, text = "What letter is this?")
promptLabel.pack()

gameControls = tk.Frame(gameStage)
gameControls.pack()

#button for moving to next letter in quiz
nextButton = tk.Button(gameControls, text="next question", command = lambda: next_question(options, currentAnswer))
nextButton.pack(padx=10, side=tk.LEFT)

#button for (re)playing the current letter's vibrations
playLetterButton = tk.Button(gameControls, text="Play letter", command = lambda: play_letter(currentAnswer[0]))
playLetterButton.pack(padx=10, side=tk.LEFT)




optionButtons = []
for i in range(len(options)):
    o = options[i] #get the actual text content of the answer
    ob = tk.Button(optionButtonsContainer, text=o, width=30, command=lambda o=o, i=i: check_answer(o, i))
    ob.pack(padx=10, pady=10, side=tk.LEFT)
    optionButtons.append(ob)




# info = tk.Text(root)
# infoText = """Use the keyboard to send letters to the bracelet. Use the motor buttons below to calibrate pin positions"""
# info.insert(tk.END, infoText)

# info.pack()



#creates the 2 wide by 3 high grid of buttons and their corresponding motor number
top = tk.Frame(root)
middle = tk.Frame(root)
bottom = tk.Frame(root)
top.pack()
middle.pack()
bottom.pack()



# Create buttons representing the motors of the bracelets
button1 = tk.Button(root, text="Motor 1", command=lambda: send_command('1'))
button1.pack(in_=top, side=tk.LEFT)

button2 = tk.Button(root, text="Motor 2", command=lambda: send_command('2'))
button2.pack(in_=top, side=tk.RIGHT)

button3 = tk.Button(root, text="Motor 3", command=lambda: send_command('3'))
button3.pack(in_=middle, side=tk.LEFT)

button4 = tk.Button(root, text="Motor 4", command=lambda: send_command('4'))
button4.pack(in_=middle, side=tk.RIGHT)

button5 = tk.Button(root, text="Motor 5", command=lambda: send_command('5'))
button5.pack(in_=bottom, side=tk.LEFT)

button6 = tk.Button(root, text="Motor 6", command=lambda: send_command('6'))
button6.pack(in_=bottom, side=tk.RIGHT)

buttons = [button1, button2, button3, button4, button5, button6]

# Bind keyboard events
root.bind('<Key>', key_press)

# Run the application
root.mainloop()

