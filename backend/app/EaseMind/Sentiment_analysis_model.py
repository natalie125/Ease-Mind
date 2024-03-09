import pandas as pd
from sklearn.model_selection import train_test_split
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential, Model
from tensorflow.keras.layers import Embedding, LSTM, Dense, Conv1D, GlobalMaxPooling1D, MultiHeadAttention, \
    LayerNormalization, Dropout, Input
from tensorflow.keras.metrics import Precision, Recall
from tensorflow.keras.regularizers import l2
from tensorflow.keras.callbacks import EarlyStopping
import pickle
import matplotlib.pyplot as plt
from sklearn.metrics import confusion_matrix

def cnn_model():
    model = Sequential()
    model.add(Embedding(input_dim=10000, output_dim=128, input_length=100))
    model.add(Conv1D(128, 5, activation='relu'))
    model.add(GlobalMaxPooling1D())
    model.add(Dense(10, activation='relu'))
    model.add(Dense(1, activation='sigmoid'))

    model.compile(optimizer='adam',
                  loss='binary_crossentropy',
                  metrics=['accuracy', Precision(), Recall()])

    return model


def lstm_model():
    model = Sequential()
    model.add(Embedding(input_dim=10000, output_dim=128, input_length=100))
    # L2 regularization and Dropout to reduce overfitting
    model.add(LSTM(64, return_sequences=False, kernel_regularizer=l2(0.001)))
    model.add(Dropout(0.5))
    model.add(Dense(1, activation='sigmoid'))

    model.compile(optimizer='adam',
                  loss='binary_crossentropy',
                  metrics=['accuracy', Precision(), Recall()])

    return model


def transformer_encoder_layer(embed_dim, num_heads, ff_dim, rate=0.1):
    inputs = Input(shape=(None, embed_dim))
    attention_output = MultiHeadAttention(num_heads=num_heads, key_dim=embed_dim)(inputs, inputs)
    attention_output = Dropout(rate)(attention_output)
    out1 = LayerNormalization(epsilon=1e-6)(inputs + attention_output)
    ffn_output = Dense(ff_dim, activation='relu')(out1)
    ffn_output = Dense(embed_dim)(ffn_output)
    ffn_output = Dropout(rate)(ffn_output)
    return Model(inputs=inputs, outputs=LayerNormalization(epsilon=1e-6)(out1 + ffn_output))


def transformer_model():
    embed_dim = 128  # size for each token
    num_heads = 4  # Number of attention heads
    ff_dim = 32  # Hidden layer size in feed forward network inside transformer

    inputs = Input(shape=(100,))
    embedding_layer = Embedding(input_dim=10000, output_dim=embed_dim, input_length=100)(inputs)
    transformer_block = transformer_encoder_layer(embed_dim, num_heads, ff_dim)
    x = transformer_block(embedding_layer)
    x = GlobalMaxPooling1D()(x)
    x = Dense(20, activation="relu")(x)
    outputs = Dense(1, activation="sigmoid")(x)

    model = Model(inputs=inputs, outputs=outputs)
    model.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy", Precision(), Recall()])

    return model


def train(create_model):
    data = pd.read_csv('mental_health.csv')

    texts = data['text'].values
    labels = data['label'].values

     # Split dataset into training and testing sets
    texts_train, texts_test, labels_train, labels_test = train_test_split(texts, labels, test_size=0.2, random_state=42)

    # initialise Tokenizer
    tokenizer = Tokenizer(num_words=10000)  # keep the most common 10000 words
    tokenizer.fit_on_texts(texts_train)

    # Assuming 'tokenizer' is the fitted Tokenizer instance
    with open('tokenizer.pickle', 'wb') as handle:
        pickle.dump(tokenizer, handle, protocol=pickle.HIGHEST_PROTOCOL)

    # Convert texts into numeric sequences
    sequences_train = tokenizer.texts_to_sequences(texts_train)
    sequences_test = tokenizer.texts_to_sequences(texts_test)

   # Pad sequences to ensure consistent length
    X_train = pad_sequences(sequences_train, maxlen=100) 
    X_test = pad_sequences(sequences_test, maxlen=100)

    model = create_model()
    model.summary()

     # Stop training when the validation loss is no longer improving.
    early_stopping = EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True)

    history = model.fit(X_train, labels_train, epochs=10, batch_size=32,
                        validation_split=0.2, callbacks=[early_stopping])

    # history = model.fit(X_train, labels_train, epochs=10, batch_size=32, validation_split=0.2)

    loss, accuracy, precision, recall = model.evaluate(X_test, labels_test)

    predictions = model.predict(X_test)
    # Convert predictions to 0 or 1
    predicted_classes = (predictions > 0.5).astype(int).flatten()
    # calulate confusion matrix
    cm = confusion_matrix(labels_test, predicted_classes)
    tn, fp, fn, tp = cm.ravel()

    print("Confusion Matrix:")
    print(cm)

    # print training and valtionation loss graph
    plt.plot(history.history['loss'], label='Training Loss')
    plt.plot(history.history['val_loss'], label='Validation Loss')
    plt.title('Training vs Validation Loss')
    plt.legend()
    plt.show()

    print(f"Test Loss: {loss}")
    print(f"Test Accuracy: {accuracy}")
    print(f"Test Precision: {precision}")
    print(f"Test Recall: {recall}")
    print(f"True Negatives: {tn}")
    print(f"False Positives: {fp}")
    print(f"False Negatives: {fn}")
    print(f"True Positives: {tp}")

    model.save('my_model.h5')


if __name__ == '__main__':
    train(lstm_model)
