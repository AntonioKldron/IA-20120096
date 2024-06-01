import os

def cambiar_extensiones_a_png(directorio):
    # Verificar si el directorio existe
    if not os.path.exists(directorio):
        print(f"El directorio {directorio} no existe.")
        return
    
    # Recorrer todos los archivos en el directorio
    for filename in os.listdir(directorio):
        # Construir la ruta completa del archivo
        file_path = os.path.join(directorio, filename)
        
        # Verificar si es un archivo (no un directorio)
        if os.path.isfile(file_path):
            # Obtener el nombre del archivo sin la extensión
            base, ext = os.path.splitext(filename)
            nuevo_nombre = base + '.png'
            nuevo_path = os.path.join(directorio, nuevo_nombre)
            
            # Si el nuevo archivo ya existe, añadir un sufijo único
            count = 1
            while os.path.exists(nuevo_path):
                nuevo_nombre = f"{base}_{count}.jpg"
                nuevo_path = os.path.join(directorio, nuevo_nombre)
                count += 1
            
            os.rename(file_path, nuevo_path)
            print(f"Renombrado: {filename} a {nuevo_nombre}")

# Especificar la ruta del directorio
directorio = 'C:/Projects/ITM/INTELIGENCIA ARTIFICIAL/2_Proyecto_Wally/Img/Wally/p'

# Llamar a la función para cambiar las extensiones
cambiar_extensiones_a_png(directorio)
