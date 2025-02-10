# Project_ 3 Border Crossing Data Visualization Project
Project Overview:
This project aims to analyze border crossing trends between Mexico and the United States, evaluating their evolution over time. The goal is to identify the states where these crossings are concentrated and the most common transportation methods used to travel to the U.S. Through interactive visualizations, users will gain a clear understanding of these crossing dynamics, aiding decision-making in public policy and border operations management.

Project Files and Structure:
app.py: This file contains the backend code using Flask to manage the data. It reads the data from a CSV file (Border_Crossing_Entry_Data.csv), cleans it, converts it to JSON, and stores it in an SQLite database. The database and JSON file are used to power the visualizations. The backend is also set up for potential web integration.

style.css: This file contains CSS styles for formatting the HTML pages and interactive visualizations. It includes layout rules for filters, charts, and containers to ensure a clean and responsive design.

leaflet-heat.js: A script using the Leaflet library and simpleheat plugin to create an interactive heatmap. This map visualizes border crossings based on geographic density, using latitude and longitude coordinates.

logic.js: Contains the logic to build interactive charts and handle user interaction. It:

Loads data from a JSON file.
Creates bar, line, and pie charts.
Allows users to filter the data by year and month through dropdown menus.
Border_Crossing_Entry_Data.csv: This CSV file contains historical data of border crossings, including port names, states, port codes, crossing methods (e.g., personal vehicles, trucks, buses), and geographic coordinates. It is used to analyze crossing volumes and their temporal and geographic distribution.

data.sqlite: An SQLite database containing the cleaned version of the CSV data. This database powers the web application and allows dynamic queries based on user filters.

Visualizations:
The project includes three main visualizations:

Line Chart (Total Crossings by Year and Month): Displays the evolution of border crossings over time, allowing users to see trends and patterns.

Bar Chart (Crossings by Transport Type): Shows the distribution of border crossings by transportation method, identifying the most common types of transport.

Heatmap (Geographic Distribution of Border Crossings): Uses the Leaflet plugin to create an interactive map showing the density of border crossings through a heatmap.

Objectives and Methodology:
Objective: The main purpose of this project is to provide clear, understandable visualizations of border crossing dynamics between Mexico and the U.S., helping optimize border operations and improve decision-making at the policy level.

Methodology:

Analyzing historical data through various data visualization techniques such as line charts, heatmaps, and bar charts.
Interactive filtering by year and month to explore different time periods.
Using technologies like Python (Flask, Pandas, SQLite) and JavaScript (Leaflet, Plotly) for visualization and backend services.
Ethical Considerations:
This project uses publicly available data on border crossings. All data used is anonymous and does not contain personally identifiable information. The visualizations are designed to be accessible and understandable for a wide audience, promoting fair and ethical data analysis.

How to Use:
Prerequisites:

Ensure you have Python 3.x installed.
Install necessary dependencies with:
nginx
Copiar
Editar
pip install flask pandas sqlite3
Run the Server:

Navigate to the project directory and run the app.py file:
nginx
Copiar
Editar
python app.py
Access the Application:

Open your browser and go to http://localhost:5000 to view the interactive visualizations.
Interact:

Use the dropdown menus to filter the data by year and month.
Click on the charts to see more details about the border crossings.
Data Sources:
The border crossing data is sourced from historical records provided by official U.S. and Mexican agencies.
Code References:
Leaflet: Used to create the interactive heatmap (https://leafletjs.com).
Plotly: For creating interactive charts in JavaScript (https://plotly.com).
Flask: A web framework used for the backend of the application (https://flask.palletsprojects.com).
