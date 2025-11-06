import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score
import pickle

base_path = os.path.dirname(__file__)
csv_path = os.path.join(base_path, "emails.csv")

data = pd.read_csv(csv_path)
data = data.dropna(subset=["body", "label"])

X_train, X_test, y_train, y_test = train_test_split(
    data["body"], data["label"], test_size=0.2, random_state=42
)

vectorizer = TfidfVectorizer(
    stop_words="english",
    max_features=5000,
    ngram_range=(1, 2)
)
X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)

model = LogisticRegression(max_iter=200)
model.fit(X_train_tfidf, y_train)

y_pred = model.predict(X_test_tfidf)
print("Accuracy:", accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))

with open(os.path.join(base_path, "phishing_model.pkl"), "wb") as f:
    pickle.dump(model, f)

with open(os.path.join(base_path, "vectorizer.pkl"), "wb") as f:
    pickle.dump(vectorizer, f)

print("Model and vectorizer saved successfully in backend/model/")
