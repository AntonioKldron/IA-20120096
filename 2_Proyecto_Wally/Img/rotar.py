import cv2
import os

# Ruta de la carpeta que contiene las imágenes
carpeta_imagenes = 'C:/Projects/ITM/INTELIGENCIA ARTIFICIAL/2_Proyecto_Wally/Img/Wally3/p2'

# Tamaño al que se redimensionarán las imágenes
nuevo_ancho = 60
nuevo_alto = 90

# Obtener la lista de nombres de archivo de las imágenes en la carpeta
archivos_imagenes = os.listdir(carpeta_imagenes)

# Función para rotar la imagen
def rotar_imagen(imagen, angulo):
    if angulo == 90:
        return cv2.rotate(imagen, cv2.ROTATE_90_CLOCKWISE)
    elif angulo == 180:
        return cv2.rotate(imagen, cv2.ROTATE_180)
    elif angulo == 270:
        return cv2.rotate(imagen, cv2.ROTATE_90_COUNTERCLOCKWISE)
    else:
        return imagen

# Iterar sobre cada imagen y procesarla
for nombre_archivo in archivos_imagenes:
    # Construir la ruta completa de la imagen
    ruta_imagen = os.path.join(carpeta_imagenes, nombre_archivo)
    
    # Leer la imagen
    imagen = cv2.imread(ruta_imagen)
    
    # Redimensionar la imagen al nuevo tamaño
    imagen_redimensionada = cv2.resize(imagen, (nuevo_ancho, nuevo_alto))
    
    # Rotar la imagen y guardar cada rotación
    for angulo in [0, 90, 180, 270]:
        imagen_rotada = rotar_imagen(imagen_redimensionada, angulo)
        
        # Crear un nuevo nombre de archivo para la imagen rotada
        nombre_archivo_rotado = f"{os.path.splitext(nombre_archivo)[0]}_rotada_{angulo}{os.path.splitext(nombre_archivo)[1]}"
        ruta_imagen_rotada = os.path.join(carpeta_imagenes, nombre_archivo_rotado)
        
        # Guardar la imagen rotada
        cv2.imwrite(ruta_imagen_rotada, imagen_rotada)

print("Todas las imágenes han sido redimensionadas y rotadas en las cuatro direcciones.")
