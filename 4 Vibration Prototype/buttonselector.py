import tkinter as tk
import serial

arduino = serial.Serial('/dev/cu.usbmodem2101', 9600)

def send_command(command):
    arduino.write(command.encode())

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

# Run the application
root.mainloop()
