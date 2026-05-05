# DSBDA Project Directory

This directory contains data science Jupyter Notebooks, datasets, and a custom backend system designed to securely serve notebooks and provide AI-generated answers.

## File Breakdown

### 📊 Data Science Notebooks & Visualizations
* **`Pract 01B.ipynb`** - Practical assignment notebook.
* **`air.ipynb`** - Notebook containing analysis on Air Quality datasets.
* **`facebook.ipynb`** - Notebook containing analysis on Facebook metrics datasets.
* **`heart.ipynb`** - Notebook containing analysis on Heart Disease datasets.
* **`scrap.ipynb`** - Web scraping scripts and data collection.
* **`vis.ipynb`** - Data visualization implementations.
* **`Tableau.twbx`** - Tableau packaged workbook for advanced data visualizations and dashboards.

### ⚙️ Server & Automation
* **`server.js`** - A Node.js backend. It securely serves the Jupyter Notebooks via direct download and hosts an AI question-answering endpoint (`/q`) powered by the official Google Gemini API.
* **`me.py`** - A Python client script that fetches notebook cell data programmatically from the server and interacts with the Gemini AI endpoint.

### 📦 Dependencies & Config
* **`package.json` & `package-lock.json`** - Node.js project metadata and dependencies (includes the `@google/generative-ai` SDK).
* **`vercel.json`** - Deployment configuration for hosting the `server.js` backend on Vercel.
