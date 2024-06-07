# Proyecto de Detección de Wally usando Cascade Training

Este proyecto utiliza el método de entrenamiento en cascada (Cascade Training) para crear un dataset de imágenes positivas y negativas con el objetivo de detectar la figura de Wally en una imagen. A continuación, se detalla el código utilizado para cargar el modelo entrenado y realizar la detección.

## Código para la Detección de Wally

El siguiente código carga un clasificador previamente entrenado para detectar la figura de Wally en una imagen dada.

```python
import cv2 as cv

# Cargar el clasificador entrenado
rostro = cv.CascadeClassifier('C:/Projects/ITM/INTELIGENCIA ARTIFICIAL/2_Proyecto_Wally/Img/Wally2/classifier/cascade.xml')

# Cargar la imagen de Wally
img = cv.imread('C:/Projects/ITM/INTELIGENCIA ARTIFICIAL/2_Proyecto_Wally/View/img6.jpg')

# Convertir la imagen a escala de grises
gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)

# Detectar rostros en la imagen
rostros = rostro.detectMultiScale(
    gray,
    scaleFactor=1.1,           # Escala la imagen en un 10% en cada paso de la pirámide de escala
    minNeighbors=10,           # Mayor número de vecinos, para eliminar detecciones falsas
    flags=cv.CASCADE_SCALE_IMAGE, # Parámetro de flags que indica que se considera el tamaño de la imagen
    minSize=(20, 20),          # Tamaño mínimo de los rectángulos de detección
    maxSize=(50, 50),          # Tamaño máximo de los rectángulos de detección
)

# Procesar cada rostro detectado
for (x, y, w, h) in rostros:
    # Dibujar un rectángulo verde alrededor del rostro detectado
    img = cv.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)

# Mostrar la imagen con los rostros detectados y los rectángulos
cv.imshow('rostros', img)
cv.waitKey(0)
cv.destroyAllWindows()
