import tkinter as tk
import serial

#this needs changing depending on device.
arduino = serial.Serial('COM19', 9600)

def send_command(command):
    arduino.write(command.encode())

def key_press(event):
    key = event.char
    send_command(key)

# Create the main window
root = tk.Tk()
root.title("Vibration Motor Control")

# root.geometry("100x100")

info = tk.Text(root)
infoText = """Use the keyboard to send letters to the bracelet. Use the motor buttons below to calibrate pin positions"""
info.insert(tk.END, infoText)

info.pack()


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

# Bind keyboard events
root.bind('<Key>', key_press)

# Run the application
root.mainloop()

