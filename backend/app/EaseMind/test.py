import pandas as pd
import numpy as np
import pickle
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model
from sklearn.metrics import confusion_matrix, accuracy_score, precision_score, recall_score

# test data
test_data = pd.read_csv('Suicide_Detection.csv')
texts = test_data['text'].values
labels = test_data['class'].values

# Load the saved tokenizer
with open('tokenizer.pickle', 'rb') as handle:
    tokenizer = pickle.load(handle)

# Convert texts to sequences
sequences = tokenizer.texts_to_sequences(texts)

# Pad sequences to ensure consistent length
max_length = 100  #match the max length used during model training
padded_sequences = pad_sequences(sequences, maxlen=max_length)

# model
model = load_model('my_model.h5')

# making predications
predictions = model.predict(padded_sequences)
predicted_classes = [1 if pred > 0.5 else 0 for pred in predictions.flatten()]

# Calculate loss and accuracy
loss, accuracy, precision, recall = model.evaluate(padded_sequences, np.array(labels), verbose=0)

# Calculate confusion matrix
tn, fp, fn, tp = confusion_matrix(labels, predicted_classes).ravel()

print(f"True Positives: {tp}")
print(f"True Negatives: {tn}")
print(f"False Positives: {fp}")
print(f"False Negatives: {fn}")
print(f"Loss: {loss:.4f}")
print(f"Accuracy: {accuracy:.4f}")
print(f"Precision: {precision:.4f}")
print(f"Recall: {recall:.4f}")
