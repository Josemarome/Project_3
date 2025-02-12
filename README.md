# Border Crossing Data Visualization Project

## Summary
The project aims to analyze border crossing trends between Mexico, the United States, and Canada, assessing their evolution over time. The main objective is to identify the states and provinces where these crossings are concentrated. Through interactive visualizations, users will gain a clear understanding of these crossing dynamics, which will help in decision-making regarding public policy and management of border operations. This analysis will allow for a comprehensive assessment of border interactions in North America, providing a solid foundation for improving cooperation and security among the three countries.

## Objectives
- Provide clear and understandable visualizations of the dynamics of border crossings between Mexico, the U.S., and Canada.
- Help optimize border operations and improve policy-level decision-making.
- Implement interactive filtering by year to explore different time periods.

## Data Description
The dataset includes:
- **Border_Crossing_Entry_Data.csv**: Contains historical data of border crossings, including port names, states, port codes, crossing methods (e.g., personal vehicles, trucks, buses), and geographic coordinates. The dataset can be accessed from the [U.S. Government's Data Catalog](https://catalog.data.gov/dataset/border-crossing-entry-data-683ae).

## Included Scripts

1. **index.html**:
   - Structures the webpage and defines where the charts and metadata information are displayed.
   - Includes references to the necessary libraries for visualization.

2. **style.css**:
   - Contains CSS styles for formatting HTML pages and interactive visualizations.
   - Ensures a clean and responsive design.

3. **logic.js**:
   - Manages interactive charts and user interactions.
   - Loads data from a JSON file.
   - Creates pie charts, line charts, and heatmap.
   - Allows users to filter data by year using drop-down menus.
   - Integrates various external libraries for visualization and interactivity.

4. **app.py**:
   - Reads data from `Border_Crossing_Entry_Data.csv`.
   - Cleans and converts the data to JSON.
   - Stores data in an SQLite database.
   - Powers visualizations and is set up for potential web integration.

## Requirements
- Python 3.x
- Pandas
- SQLite

## Instructions

### Getting Started
1. Ensure you have Python 3.x installed. Install necessary dependencies with:
   ```sh
   pip install pandas sqlite3
   ```

2. Navigate to the project directory and execute:
   ```sh
   python app.py
   ```

---

## Features
- **Dropdown Menus**: Filter data by year.
- **Line Chart**: Displays the evolution of border crossings over time.
- **Pie Chart**: Represents the proportion of border crossings involving the United States, Canada, and Mexico.
- **Heatmap**: Displays the density of border crossings based on geographic distribution.

## Deployment
The application is deployed on GitHub Pages. You can access it [here](https://josemarome.github.io/Project_3/).

## Ethical Considerations
- The project uses publicly available data on border crossings.
- All data used is anonymous and does not contain personally identifiable information.
- The visualizations aim to be accessible and understandable for a wide audience, promoting fair and ethical data analysis.

## Data Sources
The border crossing data comes from historical records provided by official US government agencies. The dataset can be accessed from the [U.S. Government's Data Catalog](https://catalog.data.gov/dataset/border-crossing-entry-data-683ae).

## Code References
- **Plotly**: For creating interactive charts in JavaScript.
- **D3.js**: For data manipulation and visualization.
- **MapLibre**: For interactive mapping and geospatial visualization.
- **Deck.gl**: For high-performance web-based geospatial visualization.

## External Libraries Used
The following libraries are included via CDN for enhanced functionality:
- [MapLibre GL CSS](https://unpkg.com/maplibre-gl@1.15.2/dist/maplibre-gl.css)
- [MapLibre GL Geocoder CSS](https://unpkg.com/@maplibre/maplibre-gl-geocoder@1.1.0/dist/maplibre-gl-geocoder.css)
- [MapLibre GL JS](https://unpkg.com/maplibre-gl@1.15.2/dist/maplibre-gl.js)
- [MapLibre GL Geocoder JS](https://unpkg.com/@maplibre/maplibre-gl-geocoder@1.1.0/dist/maplibre-gl-geocoder.min.js)
- [Deck.gl](https://unpkg.com/deck.gl@8.6.0/dist.min.js)
- [Plotly](https://cdn.plot.ly/plotly-latest.min.js)
- [D3.js](https://d3js.org/d3.v7.min.js)

## Contributions

We welcome and appreciate contributions from the community. If you have suggestions or improvements, please open an issue or submit a pull request.

**Special Thanks To:**
- [Monse](https://github.com/Monse2604): For their valuable insights on data visualization.
- [Jose](https://github.com/Josemarome): For their assistance with data cleaning and preprocessing.
- [Fco](https://github.com/fjdpr): For their contributions to the backend development.