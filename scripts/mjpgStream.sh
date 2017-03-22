#! /bin/bash

#assume that mjpg-strema is installed in home directory
cd ~/mjpg-streamer

#run Streamer
sudo ./mjpg_streamer -i "./input_uvc.so -f 5 -r 640x320 -n -y -q 20" -o "./output_http.so -w ./www -p 80"

