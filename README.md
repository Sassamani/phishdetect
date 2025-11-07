# PhishDetect

PhishDetect is a web application that uses AI to detect phishing attempts in email content.  
It combines a Flask backend for text classification and a React (Vite) frontend for user interaction.

---

## Overview

PhishDetect allows users to paste email content into the interface and receive an instant classification:
- **Phishing**
- **Legitimate**

The model uses a TF-IDF vectorizer and a Logistic Regression classifier trained on real email datasets.  
The system achieves over 99% accuracy on test data.

---

## Tech Stack

### Backend (API)
- Python 3.13
- Flask
- Flask-Cors
- scikit-learn
- pandas, numpy
- Gunicorn (for deployment)
- Hosted on [Render]( https://phishdetect-chje.onrender.com)

### Frontend (Web)
- React + Vite
- Axios
- Tailwind CSS
- Hosted on [Vercel](https://phishdetect-zaqw04492-sassamanis-projects.vercel.app/)

---

## Features

- Real-time phishing detection
- Simple and responsive user interface
- Model served via REST API
- Secure cross-origin communication (CORS)
- Deployed using Render (backend) and Vercel (frontend)

---

## Folder Structure

