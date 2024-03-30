import tkinter as tk
import serial

#this needs changing depending on device and current port in use

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

#Windows file system:
arduino = serial.Serial('/dev/cu.usbmodem101', 9600)

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


# Create the main window
root = tk.Tk()
root.title("Vibration Motor Control")

root.geometry("1000x1000")

info = tk.Text(root)
infoText = """Use the keyboard to send letters to the bracelet. Use the motor buttons below to calibrate pin positions"""
info.insert(tk.END, infoText)

info.pack()



#creates the 2 wide by 3 high grid of buttons and their corresponding motor number
top = tk.Frame(root)
middle = tk.Frame(root)
bottom = tk.Frame(root)
top.pack()
middle.pack()
bottom.pack()



# Create buttons
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

