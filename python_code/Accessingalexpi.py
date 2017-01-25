import cv2
import numpy as np
import urllib
import imutils
import subprocess
import time
from threading import Thread

def facedection(gray,frame):
    face = False
    faces = facialCascade.detectMultiScale(gray,1.3,5)
    for(x,y,w,h) in faces:
            face = True
            cv2.rectangle(frame,(x,y),(x+w,y+h),(255,0,0),2)
    cv2.imshow('face',frame)
    


def motiondection(gray,frame,firstFrame):

    gray = cv2.GaussianBlur(gray, (21, 21), 0)          
    frameDelta = cv2.absdiff(firstFrame, gray)
    thresh = cv2.threshold(frameDelta, 25, 255, cv2.THRESH_BINARY)[1]
    thresh = cv2.dilate(thresh, None, iterations=2)
    (you,cnts, _) = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE)

    for c in cnts:
            if cv2.contourArea(c) < 200:
                    continue

            (x, y, w, h) = cv2.boundingRect(c)
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
        
    cv2.imshow("Security Feed", frame)

if __name__ == "__main__":
    facialCascade = cv2.CascadeClassifier("haarcascades/haarcascade_frontalface_default.xml")           
    stream = urllib.urlopen("https://7a786f7d71.dataplicity.io/?action=stream")
    bytes =''
    firstFrame = None
    while True:
        bytes+=stream.read(1024)
        a = bytes.find('\xff\xd8')
        b = bytes.find('\xff\xd9')
        if a!=-1 and b!=-1:
            jpg = bytes[a:b+2]
            bytes= bytes[b+2:]
            frame = cv2.imdecode(np.fromstring(jpg, dtype=np.uint8),cv2.IMREAD_COLOR)
            frame1 = frame;
            frame = imutils.resize(frame, width=500)
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            if firstFrame is None:
                firstFrame = cv2.GaussianBlur(gray, (21, 21), 0)
            thread = Thread(target = motiondection(gray,frame,firstFrame))
            thread1 = Thread(target = facedection(gray,frame1))
            thread.start()
            thread1.start()
            thread.join()
            thread1.join()
        key = cv2.waitKey(1) & 0xFF
        if key == ord("q"):
            break
            
