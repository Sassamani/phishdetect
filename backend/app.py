from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle, os, re

app = Flask(__name__)
CORS(app) 

base_path = os.path.dirname(__file__)
model_path = os.path.join(base_path, "model", "phishing_model.pkl")
vectorizer_path = os.path.join(base_path, "model", "vectorizer.pkl")

with open(model_path, "rb") as f:
    model = pickle.load(f)
with open(vectorizer_path, "rb") as f:
    vectorizer = pickle.load(f)

def clean_text(text):
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"[^A-Za-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.lower().strip()

@app.route("/api/detect", methods=["POST"])
def detect():
    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"error": "Missing 'text' field"}), 400
    text = clean_text(data["text"])
    vectorized = vectorizer.transform([text])
    prediction = int(model.predict(vectorized)[0])
    prob = float(model.predict_proba(vectorized)[0][prediction])
    label = "Phishing" if prediction == 1 else "Legitimate"
    return jsonify({"label": label, "confidence": round(prob, 3)})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
