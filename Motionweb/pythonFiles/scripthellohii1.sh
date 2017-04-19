#! /bin/bash

#load the module
sudo modprobe bcm2835-v4l2

cd /etc

#intalling
#if module exist then do nothing, otherwise insert module
if [ $(grep -i bcm2835-v4l2 modules) ];
then
	echo "module exist"
else
	echo bcm2835-v4l2 >> modules
	echo "not exist, please insert"
fi

cd /home/pi
if [ $(grep -i "python motion.py" .bashrc) ];
then 
    echo " exists"
else
    echo "cd ~/mjpg-streamer
sudo ./mjpg_streamer -i './input_uvc.so -f 5 -r 640x320 -n -y -q 20' -o './output_http.so -w ./www -p 80'&
sleep 5
sudo python motion.py" >> .bashrc
fi

#python dependencies
pip install boto numpy imutils

#mjpeg streamer dependencies
#install mjpeg
sudo apt-get -y install libjpeg8-dev imagemagick libv4l-dev libav-tools python-opencv
wget http://ec2-35-162-159-206.us-west-2.compute.amazonaws.com/downloads/mjpg-streamer.tar.gz
tar -xvzf mjpg-streamer.tar.gz

#will work after libv4l-dev is installed
sudo ln -s /usr/include/libv4l1-videodev.h /usr/include/linux/videodev.h
cd mjpg-streamer/
make

#assume that mjpg-strema is installed in home directory
#cd ~/mjpg-streamer

#cp startScript.sh to /etc/init.d
# sudo chmod 755 /etc/init.d/startScript.sh

#run Streamer
./mjpg_streamer -i "./input_uvc.so -f 5 -r 640x320 -n -y -q 20" -o "./output_http.so -w ./www -p 80"&

#download and motion code
wget -O motion.py http://ec2-52-27-178-28.us-west-2.compute.amazonaws.com/pythonFiles/Motionhellohii1.py
python motion.py