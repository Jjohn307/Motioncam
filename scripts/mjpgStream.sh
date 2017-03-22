#! /bin/bash

#download zipped mjpeg
#unzip it

#install dependencies for mjpg
#probably can include dependencies for python code
#sudo apt-get install libjpeg8-dev imagemagick libv4l-dev

wget http://ec2-35-162-159-206.us-west-2.compute.amazonaws.com/downloads/mjpg-streamer.tar.gz

tar -xvzf mjpg-streamer.tar.gz

#will work after libv4l-dev is installed
sudo ln -s /usr/include/libv4l1-videodev.h /usr/include/linux/videodev.h
cd mjpg-streamer/
make

#assume that mjpg-strema is installed in home directory
#cd ~/mjpg-streamer

#run Streamer
#sudo ./mjpg_streamer -i "./input_uvc.so -f 5 -r 640x320 -n -y -q 20" -o "./output_http.so -w ./www -p 80"

