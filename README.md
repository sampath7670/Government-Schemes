# AI-Powered Government & Public Service Assistant
## Class 10 Student Government Schemes Module

An AI-powered, scalable web application designed to help students discover government scholarships, educational assistance, fee support, examination assistance, hostel/residential support, and other welfare schemes across **all 28 States and 8 Union Territories of India**, along with **Central Government schemes**.

---

## 🏛️ Key Features

- **36 Jurisdiction + Central Matching**: Full support for all 28 States, 8 Union Territories, and Central Government schemes.
- **Class 10 Primary Focus**: Tailored filtering for currently studying Class 10 and secondary education students.
- **Strict Verification Protocol**: Visual badges for `Verified` (from official current sources) vs `Needs Verification`.
- **Profile-Based Eligibility Engine**: Evaluates state, education level, category, annual income, gender, disability status (PwD), and school type.
- **3-Tier Match Classification**:
  1. **Potentially Relevant**
  2. **More Information Required**
  3. **Not Matching**
- **Strict Non-Eligibility Legal Disclaimer**:
  > *"Based on the information you provided, you may meet the listed criteria. Final eligibility is determined by the relevant authority."*
- **Official Source Citations**: Direct links to official `.gov.in` portals and guidelines documents.
- **Admin Verification Control Desk**: Monitoring and auditing tool for scheme status, academic year, and last verified dates.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, React Router v6, Axios
- **Backend**: Python 3.13, FastAPI, Pydantic v2, Uvicorn
- **Database**: MongoDB (Motor / PyMongo) with automated fallback manager & JSON indexing
- **Vector DB / RAG (Extensible)**: ChromaDB / FAISS architecture ready

---

## 📂 Project Structure

```text
government-schemes/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── schemes.py
│   │   ├── database/
│   │   │   └── connection.py
│   │   ├── eligibility/
│   │   │   └── engine.py
│   │   ├── models/
│   │   │   └── scheme.py
│   │   ├── services/
│   │   │   └── scheme_service.py
│   │   └── main.py
│   ├── scripts/
│   │   └── validate_schemes.py
│   ├── test_api.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AIChatModal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProfileModal.jsx
│   │   │   ├── SchemeCard.jsx
│   │   │   └── SchemeFilters.jsx
│   │   ├── pages/
│   │   │   ├── AdminPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── EligibilityCheckPage.jsx
│   │   │   ├── SchemeDetailPage.jsx
│   │   │   ├── SchemeExplorerPage.jsx
│   │   │   └── SourcesPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── data/
│   ├── seed_schemes.json
│   └── states.json
│
├── .env.example
├── .env
└── README.md
```

---

## 🚀 Quick Start & Local Execution

### 1. Backend Setup

```bash
# Navigate to workspace
cd backend

# Install Python dependencies
py -3 -m pip install -r requirements.txt

# Run Validation Test Script
py -3 scripts/validate_schemes.py data/seed_schemes.json

# Run Backend Unit Tests
py -3 test_api.py

# Launch FastAPI Server
py -3 -m uvicorn app.main:app --port 8000 --reload
```

FastAPI server runs at: `http://localhost:8000`  
Swagger API Documentation: `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install Node modules
npm install

# Run Vite dev server
npm run dev
```

React App runs at: `http://localhost:5173`

---

## 📡 API Endpoints

- `GET /api/states`: List all 36 States/UTs + Central Government.
- `GET /api/schemes`: Query schemes with state, level, category, gender, income, and verification filters.
- `GET /api/schemes/state/{state}`: State-specific schemes + Central schemes applicable to the student's state.
- `GET /api/schemes/{scheme_id}`: Scheme detail by ID.
- `POST /api/schemes/search`: Advanced search & filter body.
- `POST /api/eligibility/check`: Student profile matching engine.
- `GET /api/sources`: Official sources register and verification metadata.

---

## 🔒 Data Quality & Verification Rules

1. **Accuracy > Completeness**: No invented or fake schemes.
2. **Official > Unofficial**: Only official `.gov.in` websites and guidelines PDFs are cited.
3. **Verified Badges**: Clear indication of `Verified` vs `Needs Verification`.
4. **Structured Schema**: Full Pydantic & MongoDB schema enforcement.
