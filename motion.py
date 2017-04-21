import numpy as np
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
recordingtime = 30
writer = None
waittime = None
videoQueue = Queue.Queue()
runningconversionthread = False
AWS_ACCESS_KEY_ID = ''
AWS_SECRET_ACCESS_KEY = ''
username = 'AlexAndres'
cameraname = 'Camera1'
pausepi = False

def sendnotificationTos3():
        
        now   = datetime.datetime.now();
        sendtime=now.strftime('%m%d%Y%H%M%S')
        s3bucket_name = AWS_ACCESS_KEY_ID.lower() +'-uploads'
        connection = boto.connect_s3(AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY)
        s3bucket =  connection.get_bucket('sketchflow')
        k = Key(s3bucket)
        k.key = username+'/'+cameraname+'_'+sendtime+'.txt'
        k.set_contents_from_filename("notify.txt")
        print "user notified of suspicious activity"
        

#sending recorded video to amazon server
def sendTos3(Filename):
        now   = datetime.datetime.now()
        sendtime=now.strftime('%m%d%Y%H%M%S')
        FilenameMp4 = Filename+".mp4"
        thumbnail = Filename+".jpg"
        FilenameAvi = Filename + ".avi"
        #need access key Id and secret Access Key 
        s3bucket_name = AWS_ACCESS_KEY_ID.lower() +'-uploads'
        connection = boto.connect_s3(AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY)
        s3bucket =  connection.get_bucket('sketchflow')
        k = Key(s3bucket)
        k.key = username+'/'+cameraname+'_'+sendtime+'.jpg'
        k.set_contents_from_filename(thumbnail)
        k.key = username+'/'+cameraname+'_'+sendtime+'.mp4'
        k.set_contents_from_filename(FilenameMp4)
        print ("sent")
        subprocess.call(["rm",FilenameMp4])
        subprocess.call(["rm",FilenameAvi])
        subprocess.call(["rm",thumbnail])
        

#convert video from avi to mp4. Conversion is used since HTML5 is not avi friendly.
#However avi is the fastest way to compact a video using opencv
def convertTomp4():
       while not videoQueue.empty():
                video  = videoQueue.get();
                print"now conveting video"
                subprocess.call(["avconv","-i",video+".avi",'-c:v','libx264',video+".mp4"])
                time.sleep(20)
                print"video converted"
                sendTos3(video)
       runningconversionthread = False
                

def Recording(vs):
    now = datetime.datetime.now();
    createdTime=now.strftime('%m%d%Y%H%M%S')
    filename =  createdTime+".avi"
    thumbnailfile = createdTime+'.jpg'
    thumbnail = True
    fourcc = cv2.cv.CV_FOURCC(*'XVID')
    writer = cv2.VideoWriter(filename,fourcc,30.00,(640,480))
    time_end = time.time() + recordingtime
    print "start recording"
    while (time_end > time.time()):
        
        frame = vs.read()
        if thumbnail:
                cv2.imwrite(thumbnailfile,frame)
                thumbnail = False
        writer.write(frame)
    print "end recording"
    writer.release()
    return createdTime
    
    
        
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
    #cv2.imshow("Security Feed", frame)
    key = cv2.waitKey(1)
    return motion

           
   

if __name__ == "__main__":
    
        prev = None
        createdtime = None
        cnt = 0
        time_end = None
        vs = WebcamVideoStream(src = "http://localhost/?action=stream/frame.mjpg").start()
        fps =  FPS().start()
        while True:

            r = requests.get('http://ec2-54-242-89-175.compute-1.amazonaws.com:8000/api/schedule/signal/'+username+'/')              
            data = json.loads(r.text)
            frame = vs.read()
            grabbed =True
            if data['signal'] and not pausepi:

                frame1 = frame
                frame = imutils.resize(frame, width=500)
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                if prev is None:

                    prev = cv2.GaussianBlur(gray, (21, 21), 0)

                motion = motiondetection(gray,frame,prev)
                if motion:
                        
                        if time_end is None:
                                time_end = time.time() + 2
                        cnt = cnt+1
                      
                        
                if((time_end <= time.time() or cnt >= 4) and time_end != None  ):

                        if(cnt >= 4):
                                sendnotificationTos3()
                                createdTime = Recording(vs)
				videoQueue.put(createdTime)
                                print "There is suffient amount of evidence"
                                pausepi  = True
				waittime = time.time() + 60
                        else:
                                print "There is not suffient amount of evidence proving that motion detected was suspicous"
                        cnt = 0
                        time_end = None
                        
                prev = gray

                if not videoQueue.empty() and not runningconversionthread:
                        
                        conversionanduploadThread=Thread(target=convertTomp4)
                        runningconversionthread = True
                        conversionanduploadThread.start()
            elif pausepi:
		if time.time() >= waittime:
			pausepi = False            
            else:
                time.sleep(1)
            key = cv2.waitKey(1) & 0xFF
            if key == ord("q"):
                break
