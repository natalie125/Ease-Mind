#text_analysis.py

import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.sentiment import SentimentIntensityAnalyzer
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch 

# Initialization of NLTK resources
nltk.download('stopwords')  # Ensure the stopwords are downloaded
nltk.download('wordnet')  # Ensure the WordNet resource is downloaded for the lemmatizer
nltk.download('punkt')  # Ensure the punkt tokenizer models are downloaded for nltk.word_tokenize

lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))  # Load stopwords once, to improve performance
sia = SentimentIntensityAnalyzer()

model = AutoModelForSequenceClassification.from_pretrained('/models/depression_model')
tokenizer = AutoTokenizer.from_pretrained('/models/depression_model')

def classify_text(text):
    """
    Classify the sentiment of the text using a pre-trained model.
    Args:
        text (str): Input text to classify.
    Returns:
        tuple: Classification label and confidence score.
    """
    processed_text, sentiment_score = preprocess_text(text)

    # The tokenizer's `__call__` method performs the necessary preprocessing for model input
    inputs = tokenizer(processed_text, return_tensors="pt", truncation=True, max_length=512, padding=True)
    # Send inputs to the same device as the model
    inputs = {k: v.to(model.device) for k, v in inputs.items()}
    outputs = model(**inputs)

    # Apply softmax to the logits to get probabilities
    probs = torch.softmax(outputs.logits, dim=-1)
    predicted_class_id = probs.argmax(dim=-1).item()
    confidence_score = probs.max().item()

    classification = convert_prediction_to_classification(predicted_class_id)
    return classification, confidence_score

def preprocess_text(text):
    """
    Preprocess text by removing stopwords and lemmatizing.
    Args:
        text (str): Text to preprocess.
    Returns:
        tuple: Preprocessed text and sentiment score.
    """
    tokens = [lemmatizer.lemmatize(word) for word in nltk.word_tokenize(text.lower()) if word.isalpha() and word not in stop_words]
    processed_text = ' '.join(tokens)
    sentiment_score = sia.polarity_scores(processed_text)['compound']
    return processed_text, sentiment_score

def convert_prediction_to_classification(predicted_class_id):
    """
    Convert a predicted class ID to a label.
    Args:
        predicted_class_id (int): The predicted class ID from the model.
    Returns:
        str: Classification label.
    """
    label_map = {0: "Non-Depression", 1: "Depression"}
    return label_map.get(predicted_class_id, "Unknown")  # Return "Unknown" if class ID is not in the label_map

