import pickle
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model

# Load the saved tokenizer
with open('tokenizer.pickle', 'rb') as handle:
    tokenizer = pickle.load(handle)

# Load the saved model
model = load_model('my_model.h5')

while True:
    # Receive text from the console
    new_text = input("Enter text to analyze, or 'quit' to exit: ")
    if new_text == 'quit':
        break

    # Convert new text into a sequence of numbers
    new_sequences = tokenizer.texts_to_sequences([new_text])

    # Pad the new sequences
    new_texts_padded = pad_sequences(new_sequences, maxlen=100)

    # Use model to make prediction
    prediction = model.predict(new_texts_padded)

    # Set a threshold and print the prediction result
    threshold = 0.5
    predicted_class = 1 if prediction[0][0] > threshold else 0 
    if predicted_class == 1:
        print("Predicted class: Positive")
    else:
        print("Predicted class: Negative")
    