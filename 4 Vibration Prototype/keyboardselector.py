import tkinter as tk
import serial

#this needs changing depending on device.
arduino = serial.Serial('COM13', 9600)

def send_command(command):
    arduino.write(command.encode())

def key_press(event):
    key = event.char
    if key in ['1', '2', '3', '4', '5', '6','a','b','c','d','e']:
        send_command(key)

# Create the main window
root = tk.Tk()
root.title("Vibration Motor Control")

# Create buttons
button1 = tk.Button(root, text="Motor 1", command=lambda: send_command('1'))
button1.pack()

button2 = tk.Button(root, text="Motor 2", command=lambda: send_command('2'))
button2.pack()

button3 = tk.Button(root, text="Motor 3", command=lambda: send_command('3'))
button3.pack()

button4 = tk.Button(root, text="Motor 4", command=lambda: send_command('4'))
button4.pack()

button5 = tk.Button(root, text="Motor 5", command=lambda: send_command('5'))
button5.pack()

button6 = tk.Button(root, text="Motor 6", command=lambda: send_command('6'))
button6.pack()

# Bind keyboard events
root.bind('<Key>', key_press)

# Run the application
root.mainloop()

