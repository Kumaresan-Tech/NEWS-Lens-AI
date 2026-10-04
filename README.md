# NEWS Lens AI

NEWS Lens AI is a web app for classifying news text. Enter a headline, paragraph, or article to see its predicted category, confidence, related keywords, and an explanation.

## Features

- News classification using a TF-IDF vectorizer and a scikit-learn logistic regression model
- Prediction results with confidence scores and up to five likely categories
- Keyword and entity extraction
- Category information and model metrics
- Browser-based analysis history
- FastAPI backend and React + TypeScript frontend
- 40 categories of news analyze

## Tech stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Python, FastAPI, scikit-learn, joblib

## Run locally

You will need Python 3.10 or newer and Node.js with npm.

### 1. Start the backend

From the repository root, create and activate a virtual environment, then install the backend dependencies:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install fastapi "uvicorn[standard]" numpy scikit-learn joblib
```

Start the API from the repository root:

```powershell
python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8001
```

The API will be available at `http://127.0.0.1:8001`. Interactive API documentation is at `http://127.0.0.1:8001/docs`.

On first startup, the backend loads `backend/model/saved_model.joblib` if available; otherwise, it trains the classifier from the bundled dataset and saves the model.

### 2. Start the frontend

In a separate terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). Vite proxies `/api` requests to the backend on port `8001`.

To create a production frontend build, run `npm run build` from the `frontend` directory.

## API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/predict` | Classify news text. Send JSON such as `{"text":"The central bank raised interest rates."}`. |
| `GET` | `/api/categories` | Return available categories and their metadata. |
| `GET` | `/api/metrics` | Return model evaluation metrics. |
| `GET` | `/api/health` | Check backend health and model status. |

Prediction text must contain at least 3 characters and no more than 50,000 characters.

## Project structure

```text
backend/
  main.py                 FastAPI application
  model/                  Classifier, training data, and saved model
  preprocessing/          Text cleaning and feature extraction
  routes/                 Prediction, category, and metrics endpoints
frontend/
  src/                    React application, pages, and components
generate_dataset.py       Dataset generation utility
test_*.py                 Python test scripts
```
