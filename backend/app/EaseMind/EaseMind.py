import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Embedding, LSTM
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

# Suppose `phrases` is your list of phrases and `labels` is the list of labels indicating whether a phrase is sensitive or not.
phrases = [...]
labels = [...]

from sklearn.model_selection import train_test_split

phrases_train, phrases_test, labels_train, labels_test = train_test_split(phrases, labels, test_size=0.2, random_state=42)

tokenizer = Tokenizer(num_words=10000, oov_token="<OOV>")
tokenizer.fit_on_texts(phrases_train)

word_index = tokenizer.word_index

sequences_train = tokenizer.texts_to_sequences(phrases_train)
sequences_test = tokenizer.texts_to_sequences(phrases_test)

padded_train = pad_sequences(sequences_train, maxlen=100, padding='post', truncating='post')
padded_test = pad_sequences(sequences_test, maxlen=100, padding='post', truncating='post')

model = Sequential([
    Embedding(10000, 64, input_length=100),
    LSTM(64),
    Dense(64, activation='relu'),
    Dense(1, activation='sigmoid')  # Use 'sigmoid' for binary classification
])

model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
history = model.fit(
    padded_train, 
    labels_train, 
    epochs=10, 
    validation_data=(padded_test, labels_test)
)
loss, accuracy = model.evaluate(padded_test, labels_test)
print(f'Loss: {loss}')
print(f'Accuracy: {accuracy}')
model.save("sensitive_phrase_model.h5")

#https://chat.openai.com/c/871482be-b428-42a1-a107-683cb599275f
