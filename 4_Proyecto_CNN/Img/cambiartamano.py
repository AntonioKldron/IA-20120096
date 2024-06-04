import cv2
import os

# Ruta de la carpeta que contiene las imágenes
carpeta_imagenes = 'C:/Projects/ITM/INTELIGENCIA ARTIFICIAL/4_Proyecto_CNN/Img/robo'

# Tamaño al que se redimensionarán las imágenes
nuevo_ancho = 17
nuevo_alto = 17

# Obtener la lista de nombres de archivo de las imágenes en la carpeta
archivos_imagenes = os.listdir(carpeta_imagenes)

# Iterar sobre cada imagen y redimensionarla
for nombre_archivo in archivos_imagenes:
    # Construir la ruta completa de la imagen
    ruta_imagen = os.path.join(carpeta_imagenes, nombre_archivo)
    
    # Leer la imagen
    imagen = cv2.imread(ruta_imagen)
    
    # Redimensionar la imagen al nuevo tamaño
    imagen_redimensionada = cv2.resize(imagen, (nuevo_ancho, nuevo_alto))
    
    # Guardar la imagen redimensionada en la misma ubicación
    cv2.imwrite(ruta_imagen, imagen_redimensionada)

print("Todas las imágenes han sido redimensionadas al tamaño especificado.")
