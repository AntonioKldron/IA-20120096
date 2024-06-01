
import os

# Ruta de la carpeta que contiene las imágenes
carpeta_imagenes = 'C:/Projects/ITM/INTELIGENCIA ARTIFICIAL/2_Proyecto_Wally/Img/Wally/n'

# Obtener la lista de nombres de archivo de las imágenes en la carpeta
archivos_imagenes = os.listdir(carpeta_imagenes)

# Ordenar los archivos para que se renombren en un orden predecible
archivos_imagenes.sort()

# Iterar sobre cada imagen y renombrarla
for i, nombre_archivo in enumerate(archivos_imagenes, start=1):
    # Construir la ruta completa de la imagen
    ruta_imagen_antigua = os.path.join(carpeta_imagenes, nombre_archivo)
    
    # Obtener la extensión del archivo
    extension = os.path.splitext(nombre_archivo)[1]
    
    # Crear un nuevo nombre de archivo secuencial
    nombre_archivo_nuevo = f"{i}{extension}"
    ruta_imagen_nueva = os.path.join(carpeta_imagenes, nombre_archivo_nuevo)
    
    # Renombrar el archivo
    os.rename(ruta_imagen_antigua, ruta_imagen_nueva)

print("Todos los archivos han sido renombrados secuencialmente.")
