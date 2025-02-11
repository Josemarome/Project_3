## Border Crossing Data Visualization Project

## Project Overview

This project aims to analyze border crossing trends between Mexico and the United States, evaluating their evolution over time. The goal is to identify the states where these crossings are concentrated and the most common transportation methods used to travel to the U.S. Through interactive visualizations, users will gain a clear understanding of these crossing dynamics, aiding decision-making in public policy and border operations management.

---
## Objectives and Methodology

### Objective

To provide clear, understandable visualizations of border crossing dynamics between Mexico and the U.S., helping optimize border operations and improve decision-making at the policy level.

### Methodology

- Analyzing historical data through visualization techniques such as line charts, heatmaps, and pie charts.
- Implementing interactive filtering by year and month to explore different time periods.
- Using technologies like:
  - **Python** (Flask, Pandas, SQLite) for backend services.
  - **JavaScript** (Plotly, D3.js, MapLibre, Deck.gl) for data visualization and interactive maps.

---

## Project Files and Structure

### Backend

- **`app.py`**: Contains the backend code using Flask to manage the data. It:
  - Reads data from a CSV file (`Border_Crossing_Entry_Data.csv`).
  - Cleans and converts the data to JSON.
  - Stores data in an SQLite database.
  - Powers visualizations and is set up for potential web integration.

### Frontend

- **`style.css`**: Contains CSS styles for formatting HTML pages and interactive visualizations. It ensures a clean and responsive design.
- **`logic.js`**: Manages interactive charts and user interactions. It:
  - Loads data from a JSON file.
  - Creates pie, line, and other interactive charts.
  - Allows users to filter data by year and month using dropdown menus.
  - Integrates various external libraries for visualization and interactivity.

### Data

- **`Border_Crossing_Entry_Data.csv`**: Contains historical data of border crossings, including:
  - Port names, states, and port codes.
  - Crossing methods (e.g., personal vehicles, trucks, buses).
  - Geographic coordinates.
- **`data.sqlite`**: An SQLite database containing the cleaned version of the CSV data. It enables dynamic queries for user filters.

---

## Visualizations

The project includes three main visualizations:

1. **Line Chart (Total Crossings by Year and Month)**
   - Displays the evolution of border crossings over time, revealing trends and patterns.
2. **Pie Chart (Proportion of Crossings by Country)**
   - Represents the proportion of border crossings involving the United States, Canada, and Mexico.
3. **Heatmap (Geographic Distribution of Border Crossings)**
   - Displays the density of border crossings based on geographic distribution.

---


## Ethical Considerations

- The project uses publicly available data on border crossings.
- All data used is anonymous and does not contain personally identifiable information.
- The visualizations aim to be accessible and understandable for a wide audience, promoting fair and ethical data analysis.

---

## How to Use

### Prerequisites

Ensure you have Python 3.x installed. Install necessary dependencies with:

```sh
pip install flask pandas sqlite3
```

### Run the Server

Navigate to the project directory and execute:

```sh
python app.py
```

### Access the Application

Open your browser and go to:

```
https://josemarome.github.io/Project_3/
```

### Interact with the Application

- Use the dropdown menus to filter data by year and month.
- Click on the charts to see more details about border crossings.

---

## Data Sources

The border crossing data is sourced from historical records provided by official U.S. and Mexican agencies.

---

## Code References

- **Plotly**: For creating interactive charts in JavaScript.
- **Flask**: A web framework used for the backend of the application.
- **D3.js**: For data manipulation and visualization.
- **MapLibre**: For interactive mapping and geospatial visualization.
- **Deck.gl**: For high-performance web-based geospatial visualization.

### External Libraries Used

The following libraries are included via CDN for enhanced functionality:

- **MapLibre GL CSS**: [MapLibre GL Styles](https://unpkg.com/maplibre-gl@1.15.2/dist/maplibre-gl.css)
- **MapLibre GL Geocoder CSS**: [MapLibre Geocoder Styles](https://unpkg.com/@maplibre/maplibre-gl-geocoder@1.1.0/dist/maplibre-gl-geocoder.css)
- **MapLibre GL JS**: [MapLibre Library](https://unpkg.com/maplibre-gl@1.15.2/dist/maplibre-gl.js)
- **MapLibre GL Geocoder JS**: [MapLibre Geocoder Library](https://unpkg.com/@maplibre/maplibre-gl-geocoder@1.1.0/dist/maplibre-gl-geocoder.min.js)
- **Deck.gl**: [Deck.gl Library](https://unpkg.com/deck.gl@8.6.0/dist.min.js)
- **Plotly**: [Plotly Library](https://cdn.plot.ly/plotly-latest.min.js)
- **D3.js**: [D3.js Library](https://d3js.org/d3.v7.min.js)

