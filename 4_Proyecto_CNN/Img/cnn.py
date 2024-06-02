from PIL import Image
import os

def resize_images_in_folder(folder_path, target_size=(28, 28)):
    # Verifica si la carpeta existe
    if not os.path.exists(folder_path):
        print(f"La carpeta '{folder_path}' no existe.")
        return

    # Lista los archivos en el directorio
    files = os.listdir(folder_path)

    for file in files:
        file_path = os.path.join(folder_path, file)

        try:
            # Verifica si el archivo es una imagen
            if not file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
                print(f"El archivo '{file}' no es una imagen y será ignorado.")
                continue

            # Abre la imagen y la redimensiona
            with Image.open(file_path) as img:
                img = img.resize(target_size, Image.LANCZOS)
                # Convierte la imagen a RGB si no lo es
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                # Guarda la imagen redimensionada en el mismo directorio
                img.save(file_path)
                print(f"Imagen redimensionada: {file}")
        except Exception as e:
            print(f"Error al procesar la imagen {file}: {e}")

# Ruta del directorio de imágenes
folder_path = "C:/Projects/ITM/INTELIGENCIA ARTIFICIAL/4_Proyecto_CNN/Img/Armas"

# Redimensiona las imágenes en el directorio de origen
resize_images_in_folder(folder_path)
