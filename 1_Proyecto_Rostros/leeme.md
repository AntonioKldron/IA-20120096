# Proyecto de Identificación de Emociones usando LBPH

Este proyecto utiliza el método Local Binary Patterns Histograms (LBPH) para crear un dataset que contiene imágenes de rostros con el objetivo de identificar emociones. A continuación, se detallan los pasos y el código utilizado en este proyecto.

## Captura de Rostros desde Video

Primero, capturamos rostros desde un archivo de video y guardamos las imágenes de los rostros detectados en una carpeta específica.

```python
import numpy as np
import cv2 as cv

# Cargar el clasificador de rostros
rostro = cv.CascadeClassifier('C:/Projects/ITM/INTELIGENCIA ARTIFICIAL/Unidad 1/tools/haarcascade_frontalface_alt.xml')

# Capturar video desde archivo
cap = cv.VideoCapture("C:/Projects/ITM/INTELIGENCIA ARTIFICIAL/1_Proyecto_Rostros/Video/v6.mp4")
i = 90
while cap.isOpened():  # Mientras el video esté abierto
    ret, frame = cap.read()
    
    if not ret:  # Si no se puede leer más del video, termina el bucle
        break
    
    # Convertir a escala de grises
    gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
    rostros = rostro.detectMultiScale(gray, 1.3, 5)
    
    for (x, y, w, h) in rostros:
        # Extraer y redimensionar el rostro detectado
        frame2 = frame[y:y+h, x:x+w]
        frame2 = cv.resize(frame2, (100, 100), interpolation=cv.INTER_AREA)
        # Guardar el rostro redimensionado
        cv.imwrite('C:/Projects/ITM/INTELIGENCIA ARTIFICIAL/1_Proyecto_Rostros/Img/Sorprendido/Sorprendido{}.png'.format(i), frame2)
        i += 1
    
    cv.imshow('rostros', frame)
    k = cv.waitKey(1) & 0xFF
    
    # Presiona esc para salir
    if k == 27:
        break

cap.release()
cv.destroyAllWindows()
