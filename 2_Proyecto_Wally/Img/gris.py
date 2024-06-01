import cv2
import os

# Ruta de la carpeta que contiene las imágenes
carpeta_imagenes = 'C:/Projects/ITM/INTELIGENCIA ARTIFICIAL/2_Proyecto_Wally/Img/Wally3/n'

# Obtener la lista de nombres de archivo de las imágenes en la carpeta
archivos_imagenes = os.listdir(carpeta_imagenes)

# Iterar sobre cada imagen y convertirla a escala de grises
for nombre_archivo in archivos_imagenes:
    # Construir la ruta completa de la imagen
    ruta_imagen = os.path.join(carpeta_imagenes, nombre_archivo)
    
    # Leer la imagen
    imagen = cv2.imread(ruta_imagen)
    
    # Convertir la imagen a escala de grises
    imagen_gris = cv2.cvtColor(imagen, cv2.COLOR_BGR2GRAY)
    
    # Crear un nuevo nombre de archivo para la imagen en escala de grises
    nombre_archivo_gris = f"{os.path.splitext(nombre_archivo)[0]}_gris{os.path.splitext(nombre_archivo)[1]}"
    ruta_imagen_gris = os.path.join(carpeta_imagenes, nombre_archivo_gris)
    
    # Guardar la imagen en escala de grises
    cv2.imwrite(ruta_imagen_gris, imagen_gris)

print("Todas las imágenes han sido convertidas a escala de grises.")
