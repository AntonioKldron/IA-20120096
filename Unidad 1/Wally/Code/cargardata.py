import cv2 as cv 
import numpy as np 
import os

dataSet = 'C:/Projects/ITM/INTELIGENCIA ARTIFICIAL/Unidad 1/Wally/Img'
faces  = os.listdir(dataSet)
print(faces)

labels = []
facesData = []
label = 0 
for face in faces:
    facePath = dataSet+'/'+face
    for faceName in os.listdir(facePath):
        labels.append(label)
        facesData.append(cv.imread(facePath+'/'+faceName,0))
    label = label + 1
print(np.count_nonzero(np.array(labels)==0)) 

faceRecognizer = cv.face.EigenFaceRecognizer_create()
faceRecognizer.train(facesData, np.array(labels))
faceRecognizer.write('C:/Projects/ITM/INTELIGENCIA ARTIFICIAL/Unidad 1/Unidad 1/Wally/tools/wallyface.xml')