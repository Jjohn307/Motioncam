<?php 
	
	if(isset($_GET["user"]))
		$user = $_GET["user"];
	else
		echo "User not set";

	if(isset($_GET["cameraName"])){
        $cameraName = $_GET["cameraName"];
    }
    else{
        $cameraName = "CameraName";
    }
    $file = "pythonFiles/Motion" . $user . $cameraName.".py";
    $file2 = "pythonFiles/script" . $user . $cameraName.".sh";

	//TODO code that user will download (Could be static for now)
	$pythonCode =
        "import numpy as np
import imutils
import datetime 
import cv2
import subprocess
import time
from threading import Thread
from multiprocessing.pool import ThreadPool
import boto
import subprocess
from boto.s3.key import Key
import requests
import json
import Queue
import urllib
from imutils.video import WebcamVideoStream
from imutils.video import FPS

#globals
recording = False
lengthofrecordingVideo = None
recordingtime = 15
writer = None
videoQueue = Queue.Queue()
runningconversionthread = False
AWS_ACCESS_KEY_ID = ''
AWS_SECRET_ACCESS_KEY = ''
username = '".$user."'
cameraname = '".$cameraName."'



def sendnotificationTos3():
        
        now   = datetime.datetime.now();
        sendtime=now.strftime('%m%d%Y%H%M%S')
        s3bucket_name = AWS_ACCESS_KEY_ID.lower() +'-uploads'
        connection = boto.connect_s3(AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY)
        s3bucket =  connection.get_bucket('sketchflow')
        k = Key(s3bucket)
        k.key = username+'/'+'notification'+sendtime+'.txt'
        k.set_contents_from_filename(\"notify.txt\")
        print \"user notified of suspicious activity\"
        

#sending recorded video to amazon server
def sendTos3(Filename):
        now   = datetime.datetime.now()
        sendtime=now.strftime('%m%d%Y%H%M%S')
        FilenameMp4 = Filename+\".mp4\"
        thumbnail = Filename+\".jpg\"
        FilenameAvi = Filename + \".avi\"
        #need access key Id and secret Access Key 
        s3bucket_name = AWS_ACCESS_KEY_ID.lower() +'-uploads'
        connection = boto.connect_s3(AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY)
        s3bucket =  connection.get_bucket('sketchflow')
        k = Key(s3bucket)
        k.key = username+'/'+cameraname+'/'+sendtime+'.jpg'
        k.set_contents_from_filename(thumbnail)
        k.key = username+'/'+cameraname+'/'+sendtime+'.mp4'
        k.set_contents_from_filename(FilenameMp4)
        print (\"sent\")
        subprocess.call([\"rm\",FilenameMp4])
        subprocess.call([\"rm\",FilenameAvi])
        subprocess.call([\"rm\",thumbnail])
        

#convert video from avi to mp4. Conversion is used since HTML5 is not avi friendly.
#However avi is the fastest way to compact a video using opencv
def convertTomp4():
       while not videoQueue.empty():
                video  = videoQueue.get();
                print\"now conveting video\"
                subprocess.call([\"avconv\",\"-i\",video+\".avi\",'-c:v','libx264',video+\".mp4\"])
                time.sleep(20)
                print\"video converted\"
                sendTos3(video)
       runningconversionthread = False
                

def Recording(vs):
    now = datetime.datetime.now();
    createdTime=now.strftime('%m%d%Y%H%M%S')
    filename =  createdTime+\".avi\"
    #filename2 = \"Hello_test3.mp4\"
    thumbnailfile = createdTime+'.jpg'
    #depending on opencv version use recommended way to obtain four_cc
    #fourcc = cv2.VideoWriter_fourcc(*'MP4V')
    thumbnail = True
    fourcc = cv2.cv.CV_FOURCC(*'XVID')
    writer = cv2.VideoWriter(filename,fourcc,15.00,(640,480))
    time_end = time.time() +10
    while (time_end > time.time()):
        
        frame = vs.read()
        if thumbnail:
                cv2.imwrite(thumbnailfile,frame)
                thumbnail = False
        print (\"Recording\")
        writer.write(frame)
        
    
    writer.release()
    return createdTime
    #convertTomp4(filename,filename2)
    #time.sleep(20)
    #sendTos3(filename2,thumbnailfile)
    
        
# function detect faces. If no face is detected return false        
def facedetection(gray,frame):
    face = False
    # use opencv face classfier to detect face in frame
    faces = facialCascade.detectMultiScale(gray,1.3,5)
    for(x,y,w,h) in faces:
            face = True
            cv2.rectangle(frame,(x,y),(x+w,y+h),(255,0,0),2)
    #cv2.imshow('face',frame)
    #key = cv2.waitKey(1)
    return face

# Function detects motion by comparing recent frame with previous frame.
# Motion is detected by subtracting each pixel from the prev frame to the recent frame.
# If there is a significant change in the pixels, this will be considered as motion.

def motiondetection(gray,frame,prev):
    motion = False
    frameDelta = cv2.absdiff(prev, gray)
    thresh = cv2.threshold(frameDelta, 25, 255, cv2.THRESH_BINARY)[1]
    thresh = cv2.erode(thresh,None,iterations=2)
    thresh = cv2.dilate(thresh, None, iterations=2)
    (cnts, _) = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE)

    for c in cnts:
        if cv2.contourArea(c) < 500:
            continue
        (x, y, w, h) = cv2.boundingRect(c)
        motion = True
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
    cv2.imshow(\"Security Feed\", frame)
    key = cv2.waitKey(1)
    return motion

           
   

if __name__ == \"__main__\":
    
        facialCascade = cv2.CascadeClassifier(\"haarcascades/haarcascade_frontalface_default.xml\")
        prev = None
        createdtime = None
        cnt = 0
        time_end = None
        vs = WebcamVideoStream(src = \"http://localhost/?action=stream/frame.mjpg\").start()
        fps =  FPS().start()
        while True:

            #if not recording:
            #r = requests.get('http://ec2-54-242-89-175.compute-1.amazonaws.com:8000/api/schedule/signal/hello/')              
            #data = json.loads(r.text)
            frame = vs.read()
            grabbed =True
            # and data['signal']
            if grabbed :

                frame1 = frame;
                frame = imutils.resize(frame, width=500)
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                if prev is None:

                    prev = cv2.GaussianBlur(gray, (21, 21), 0)
                #result1 = pool.apply_async(motiondetection,(gray,frame,prev))
                #result2 = pool.apply_async(facedetection,(gray,frame1))
                #motion = result1.get()
                motion = motiondetection(gray,frame,prev)
                face = facedetection(gray,frame1)
                if face:

                    print \"face detected\"
                    Recording(camera)
                    
                elif motion:
                        
                        if time_end is None:
                                time_end = time.time() + 2
                        cnt = cnt+1
                        print \"cnt\",cnt
                        
                if((time_end <= time.time() or cnt >= 5) and time_end != None and not recording ):

                        if(cnt >= 5):
                                sendnotificationTos3()
                                recording = True
                                lengthofrecordingVideo =  time.time()+recordingtime
                                now = datetime.datetime.now();
                                createdTime=now.strftime('%m%d%Y%H%M%S')
                                filename =  createdTime+\".avi\"
                                thumbnailfile = createdTime+'.jpg'
                                fourcc = cv2.cv.CV_FOURCC(*'XVID')
                                writer = cv2.VideoWriter(filename,fourcc,15.00,(640,480))
                                cv2.imwrite(thumbnailfile,frame)
                                print \"There is suffient amount of evidence\"
                        else:
                                print \"There is not suffient amount of evidence proving that motion detected was suspicous\"
                        cnt = 0
                        time_end = None
                        
                prev = gray

                if recording:
                        if lengthofrecordingVideo >= time.time():
                                writer.write(frame)
                                print \" recordinng video\"
                        else:
                                writer.release()
                                recording = False
                                lengthofrecordedvideo = None
                                videoQueue.put(createdTime)
                                createdTime = None
                                
                

                if not videoQueue.empty() and not runningconversionthread:
                        
                        conversionanduploadThread=Thread(target=convertTomp4)
                        runningconversionthread = True
                        conversionanduploadThread.start()
                        
            else:
                print \"error when reading from camera\"
                break
            key = cv2.waitKey(1) & 0xFF
            if key == ord(\"q\"):
                break";

	$shellCode =
        "#! /bin/bash

#load the module
sudo modprobe bcm2835-v4l2

cd /etc

#intalling
#if module exist then do nothing, otherwise insert module
if [ $(grep -i bcm2835-v4l2 modules) ];
then
	echo \"module exist\"
else
	echo bcm2835-v4l2 >> modules
	echo \"not exist, please insert\"
fi

#python dependencies
pip install boto numpy imutils
sudo apt-get -y install python-opencv

#mjpeg streamer dependencies
#install mjpeg
sudo apt-get -y install libjpeg8-dev imagemagick libv4l-dev
cd ~/
wget http://ec2-35-162-159-206.us-west-2.compute.amazonaws.com/downloads/mjpg-streamer.tar.gz
tar -xvzf mjpg-streamer.tar.gz

#will work after libv4l-dev is installed
sudo ln -s /usr/include/libv4l1-videodev.h /usr/include/linux/videodev.h
cd mjpg-streamer/
make

#assume that mjpg-strema is installed in home directory
#cd ~/mjpg-streamer

#run Streamer
sudo ./mjpg_streamer -i \"./input_uvc.so -f 5 -r 640x320 -n -y -q 20\" -o \"./output_http.so -w ./www -p 80\"

#put name in curl download
#download python
curl http://ec2-52-27-178-28.us-west-2.compute.amazonaws.com/pythonFiles/Motion".$user.$cameraName.".py";

	// open file to write
	$handle = fopen($file, "w") or die("Cannot open file python file" . $file);

	fwrite($handle, $pythonCode);
	fclose($handle);

	$handle = fopen($file2, "w") or die ("Cannot opne shell file" . $file2);
    fwrite($handle, $shellCode);
    fclose($handle);
	// echo "Type the following in the terminal <h2> curl http://localhost/".$file." | sudo python</h2>";
 ?>