import os
from PIL import Image

# Especifica el directorio donde se encuentran las imágenes
directorio = 'C:/Projects/ITM/INTELIGENCIA ARTIFICIAL/2_Proyecto_Wally/Img/Wally/n'

# Recorre todos los archivos en el directorio
for archivo in os.listdir(directorio):
    if archivo.endswith('.png'):
        ruta_archivo = os.path.join(directorio, archivo)
        
        try:
            # Abre la imagen
            with Image.open(ruta_archivo) as img:
                # Verifica si la imagen está en modo 'L' (escala de grises)
                if img.mode == 'L':
                    # Si está en escala de grises, elimina el archivo
                    os.remove(ruta_archivo)
                    print(f"Imagen {archivo} eliminada.")
                else:
                    print(f"Imagen {archivo} no está en escala de grises.")
        except Exception as e:
            print(f"No se pudo procesar la imagen {archivo}. Error: {e}")
