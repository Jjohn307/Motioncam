<?php 
	
	if(isset($_GET["user"]))
		$user = $_GET["user"];
	else
		echo "User not set";

	$file = "pythonFiles/Motion" . $user . ".py";

	//TODO code that user will download (Could be static for now)
	$pythonCode = "
		import numpy as np
		import imutils
		import cv2
		import subprocess
		import time
		from threading import Thread
		from multiprocessing.pool import ThreadPool
		import boto
		import subprocess
		from boto.s3.key import Key
		
		#convert video from avi to mp4. Conversion is used since HTML5 is not avi friendly.
		#However avi is the fastest way to compact a video using opencv
		def convertTomp4(fromFile,toFile):
		        subprocess.call(["avconv","-i",fromFile,toFile])
		        
		#sending recorded video to amazon server
		def sendTos3(Filename):
		        #need access key Id and secret Access Key 
		        AWS_ACCESS_KEY_ID = 'AKIAJGNWI5Y6QJ7L6CEA'
		        AWS_SECRET_ACCESS_KEY = '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'
		        s3bucket_name = AWS_ACCESS_KEY_ID.lower() +'-uploads'
		        connection = boto.connect_s3(AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY)
		        s3bucket =  connection.get_bucket('sketchflow')
		        k = Key(s3bucket)
		        k.key = 'Hello/Hello_test3.mp4'
		        k.set_contents_from_filename(Filename)
		        print ("sent")
		
		def Recording(camera):
		    filename =  "Hello_test3.avi"
		    filename2 = "Hello_test3.mp4"
		    #depending on opencv version use recommended way to obtain four_cc
		    #fourcc = cv2.VideoWriter_fourcc(*'MP4V')
		    fourcc = cv2.cv.CV_FOURCC(*'XVID')
		    writer = cv2.VideoWriter(filename,fourcc,15.00,(640,480))
		    time_end = time.time() +10
		    while (time_end > time.time()):
		        cap,frame = camera.read()
		        if cap:
		            print "Recording"
		            writer.write(frame)
		        else:
		            break
		    writer.release()
		    convertTomp4(filename,filename2)
		    sendTos3(filename2)
		    
		        
		# function detect faces. If no face is detected return false        
		def facedetection(gray,frame):
		    face = False
		    # use opencv face classfier to detect face in frame
		    faces = facialCascade.detectMultiScale(gray,1.3,5)
		    for(x,y,w,h) in faces:
		            face = True
		            cv2.rectangle(frame,(x,y),(x+w,y+h),(255,0,0),2)
		    cv2.imshow('face',frame)
		    key = cv2.waitKey(1)
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
		    cv2.imshow("Security Feed", frame)
		    key = cv2.waitKey(1)
		    return motion
		           
		   
		
		if __name__ == "__main__":
		    
		        facialCascade = cv2.CascadeClassifier("haarcascades/haarcascade_frontalface_default.xml")
		        camera = cv2.VideoCapture(0)
		        prev = None
		        pool = ThreadPool(processes = 2)
		        cnt = 0
		        time_end = None
		        while True:
		            (grabbed,frame) = camera.read()
		            
		            if grabbed:
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
		                    print "face detected"
		                    Recording(camera)
		                elif motion:
		                        if time_end is None:
		                                time_end = time.time() + 5
		                        cnt = cnt+1
		                        print "cnt",cnt
		                if((time_end <= time.time()or cnt >= 7) and time_end != None):
		                        if(cnt >= 7):
		                                Recording(camera)
		                                print "There is suffient amount of evidence"
		                        else:
		                                print "There is not suffient amount of evidence proving that motion detected was suspicous"
		                        cnt = 0
		                        time_end = None                    
		                prev = gray
		            else:
		                print "error when reading from camera"
		                break
		            key = cv2.waitKey(1) & 0xFF
		            if key == ord("q"):
		                break

	";

	// open file to write
	$handle = fopen($file, "w") or die("Cannot open file" . $file);

	fwrite($handle, $pythonCode);
	fclose($handle);

	// echo "Type the following in the terminal <h2> curl http://localhost/".$file." | sudo python</h2>";
 ?>