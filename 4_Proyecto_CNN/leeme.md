# Proyecto CNN: Clasificación de Situaciones de Riesgo

Este proyecto utiliza una Red Neuronal Convolucional (CNN) para clasificar imágenes de situaciones de riesgo específicas: asaltos, robos a casa habitación, inundaciones, incendios y tornados. A continuación se presenta el código y una descripción detallada de su funcionamiento.

## Código del Proyecto

```python
import cv2 

# Cargar imagen de ejemplo
img = cv2.imread('C:/Projects/ITM/INTELIGENCIA ARTIFICIAL/4_Proyecto_CNN/Img/Inundaciones/frame_2.jpg')
print(img.shape[0], img.shape[1], img.shape[2], len(img.shape))

import numpy as np
import os
import re
import matplotlib.pyplot as plt
%matplotlib inline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import keras
import tensorflow as tf
from tensorflow.keras.utils import to_categorical
from keras.models import Sequential, Model
from tensorflow.keras.layers import Input, BatchNormalization, SeparableConv2D, MaxPooling2D, Activation, Flatten, Dropout, Dense, Conv2D
from keras.layers import LeakyReLU

# Definir el directorio de imágenes
dirname = os.path.join(os.getcwd(),'C:/Projects/ITM/INTELIGENCIA ARTIFICIAL/4_Proyecto_CNN/Img')
imgpath = dirname + os.sep 

# Inicializar listas para almacenar imágenes y etiquetas
images = []
directories = []
dircount = []
prevRoot = ''
cant = 0

print("Leyendo imágenes de", imgpath)

# Leer imágenes de los directorios
for root, dirnames, filenames in os.walk(imgpath):
    for filename in filenames:
        if re.search("\.(jpg|jpeg|png|bmp|tiff)$", filename):
            cant += 1
            filepath = os.path.join(root, filename)
            image = plt.imread(filepath)
            if len(image.shape) == 3:
                images.append(image)
            print(f"Leyendo... {cant}", end="\r")
            if prevRoot != root:
                print(root, cant)
                prevRoot = root
                directories.append(root)
                dircount.append(cant)
                cant = 0
dircount.append(cant)

# Ajustar contador de imágenes
dircount = dircount[1:]
dircount[0] = dircount[0] + 1
print('Directorios leídos:', len(directories))
print("Imágenes en cada directorio", dircount)
print('Suma total de imágenes en subdirs:', sum(dircount))

# Crear etiquetas para las imágenes
labels = []
indice = 0
for cantidad in dircount:
    for i in range(cantidad):
        labels.append(indice)
    indice += 1
print("Cantidad etiquetas creadas:", len(labels))

# Obtener nombres de los directorios (clases)
deportes = []
indice = 0
for directorio in directories:
    name = directorio.split(os.sep)
    print(indice, name[-1])
    deportes.append(name[-1])
    indice += 1

# Convertir listas a numpy arrays
y = np.array(labels)
X = np.array(images, dtype=np.uint8)

# Número de clases
classes = np.unique(y)
nClasses = len(classes)
print('Total de clases:', nClasses)
print('Clases:', classes)

# Dividir los datos en conjuntos de entrenamiento y prueba
train_X, test_X, train_Y, test_Y = train_test_split(X, y, test_size=0.2)
print('Forma de los datos de entrenamiento:', train_X.shape, train_Y.shape)
print('Forma de los datos de prueba:', test_X.shape, test_Y.shape)

# Visualizar algunas imágenes del conjunto de entrenamiento y prueba
plt.figure(figsize=[5,5])

plt.subplot(121)
plt.imshow(train_X[0,:,:], cmap='gray')
plt.title(f"Ground Truth: {train_Y[0]}")

plt.subplot(122)
plt.imshow(test_X[0,:,:], cmap='gray')
plt.title(f"Ground Truth: {test_Y[0]}")

# Normalizar los datos
train_X = train_X.astype('float32')
test_X = test_X.astype('float32')
train_X = train_X / 255.
test_X = test_X / 255.

# Convertir etiquetas a one-hot encoding
train_Y_one_hot = to_categorical(train_Y)
test_Y_one_hot = to_categorical(test_Y)

print('Etiqueta original:', train_Y[0])
print('Después de one-hot encoding:', train_Y_one_hot[0])

# Dividir el conjunto de entrenamiento en entrenamiento y validación
train_X, valid_X, train_label, valid_label = train_test_split(train_X, train_Y_one_hot, test_size=0.2, random_state=13)

print(train_X.shape, valid_X.shape, train_label.shape, valid_label.shape)

# Parámetros del modelo
target_height = 40
target_width = 40
INIT_LR = 1e-3
epochs = 20
batch_size = 64

# Construcción del modelo
sport_model = Sequential()
sport_model.add(Conv2D(32, kernel_size=(3, 3), activation='linear', padding='same', input_shape=(target_height, target_width, 3)))
sport_model.add(LeakyReLU(alpha=0.1))
sport_model.add(MaxPooling2D((2, 2), padding='same'))
sport_model.add(Dropout(0.5))
sport_model.add(Flatten())
sport_model.add(Dense(32, activation='linear'))
sport_model.add(LeakyReLU(alpha=0.1))
sport_model.add(Dropout(0.5))
sport_model.add(Dense(nClasses, activation='softmax'))

sport_model.summary()

# Compilación del modelo
optimizer = tf.keras.optimizers.SGD(learning_rate=INIT_LR, decay=INIT_LR / 100)
sport_model.compile(loss=keras.losses.categorical_crossentropy, optimizer=optimizer, metrics=['accuracy'])

# Entrenamiento del modelo
sport_train = sport_model.fit(train_X, train_label, batch_size=batch_size, epochs=epochs, verbose=1, validation_data=(valid_X, valid_label))

# Guardar el modelo entrenado
sport_model.save("/home/likcos/setDocto/sport.h5")

# Evaluación del modelo
test_eval = sport_model.evaluate(test_X, test_Y_one_hot, verbose=1)
print('Test loss:', test_eval[0])
print('Test accuracy:', test_eval[1])

# Graficar precisión y pérdida
accuracy = sport_train.history['accuracy']
val_accuracy = sport_train.history['val_accuracy']
loss = sport_train.history['loss']
val_loss = sport_train.history['val_loss']
epochs_range = range(len(accuracy))

plt.plot(epochs_range, accuracy, 'bo', label='Training accuracy')
plt.plot(epochs_range, val_accuracy, 'b', label='Validation accuracy')
plt.title('Training and validation accuracy')
plt.legend()
plt.figure()
plt.plot(epochs_range, loss, 'bo', label='Training loss')
plt.plot(epochs_range, val_loss, 'b', label='Validation loss')
plt.title('Training and validation loss')
plt.legend()
plt.show()

# Predicciones en el conjunto de prueba
predicted_classes2 = sport_model.predict(test_X)
predicted_classes = [predicted_sport.tolist().index(max(predicted_sport)) for predicted_sport in predicted_classes2]
predicted_classes = np.array(predicted_classes)

correct = np.where(predicted_classes == test_Y)[0]
print(f"Found {len(correct)} correct labels")
for i, correct in enumerate(correct[:9]):
    plt.subplot(3, 3, i + 1)
    plt.imshow(test_X[correct].reshape(40, 40, 3), cmap='gray', interpolation='none')
    plt.title(f"{deportes[predicted_classes[correct]]}, {deportes[test_Y[correct]]}")
    plt.tight_layout()

incorrect = np.where(predicted_classes != test_Y)[0]
print(f"Found {len(incorrect)} incorrect labels")
for i, incorrect in enumerate(incorrect[:9]):
    plt.subplot(3, 3, i + 1)
    plt.imshow(test_X[incorrect].reshape(40, 40, 3), cmap='gray', interpolation='none')
    plt.title(f"{deportes[predicted_classes[incorrect]]}, {deportes[test_Y[incorrect]]}")
    plt.tight_layout()

target_names = [f"Class {i}" for i in range(nClasses)]
print(classification_report(test_Y, predicted_classes, target_names=target_names))

# Predicción en nuevas imágenes
from skimage.transform import resize

images = []
filenames = ['C:/Projects/ITM/INTELIGENCIA ARTIFICIAL/4_Proyecto_CNN/View/f8.jpg']

for filepath in filenames:
    image = plt.imread(filepath, 0)
    image_resized = resize(image, (40, 40), anti_aliasing=True, clip=False, preserve_range=True)
    images.append(image_resized)

X = np.array(images, dtype=np.uint8)
test_X = X.astype('float32') / 255.

predicted_classes = sport_model.predict(test_X)

for i, img_tagged in enumerate(predicted_classes):
    print(filenames[i], deportes[img_tagged.tolist().index(max(img_tagged))])
