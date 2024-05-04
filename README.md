# Subway Discovery Project

## <ins>Introduction</ins>
This project aims to visualize Subway outlets in Kuala Lumpur. Through web scraping, geocoding retrieval, API development, and front-end development, this project provides an interactive map interface for exploring Subway locations in the city. LLM (Large Language Model) will be implemented to assist users in answering specific questions, such as finding the nearest Subway location.

## <ins>Implementation/ Technology</ins>
Technologies Used:

- Database: SQLite
- Web Scraping: Selenium, BeautifulSoup4
- Backend Development: Flask
- Frontend Development: React.js (Velzon Template)
- LLM: LLAMA

## <ins>Instruction</ins>
Follow these steps to run the project.

<ins>Step 1: Setup Environment</ins>
<br>
Set up your Conda environment and install the necessary libraries, execute the following command in your command prompt:
<br>
`conda create --name yourenv python=3.10`
<br>
`conda activate yourenv`
<br>
`pip install -r requirements.txt`

<ins>Step 2: Database Creation</ins>
<br>
Refer to either `creating_database.ipynb` or `creating_database.py` for the database setup process. Please note that running this code will remove any existing database and create a new one.