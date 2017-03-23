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

