// Global variables for the map and heatmap layer
let map;
let heatmapLayer;
let dataSamples;

// Define an array of month names to be used globally
const monthNames = [
    "January", "February", "March", "April", "May",
    "June", "July", "August", "September", "October",
    "November", "December"
];

// Function to update chart titles based on the selected year
function updateChartTitles(year) {
    document.getElementById('title0').innerText = `% Border Crossings by Country (${year})`;
    document.getElementById('title1').innerText = `Monthly Border Crossings in ${year}`;
}

// Function to initialize the map
function initializeMap() {
    if (!map) {
        map = new maplibregl.Map({
            container: 'box3',
            style: {
                version: 8,
                sources: {
                    "osm-tiles": {
                        type: "raster",
                        tiles: [
                            "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
                            "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
                            "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        ],
                        tileSize: 256
                    }
                },
                layers: [
                    {
                        id: "osm-tiles",
                        type: "raster",
                        source: "osm-tiles"
                    }
                ]
            },
            center: [-95.7129, 39.8283], // Initial coordinates
            zoom: 3 // Initial zoom level
        });

        map.on('load', () => {
            heatmapLayer = new deck.MapboxLayer({
                id: 'heatmap',
                type: deck.HeatmapLayer,
                data: [], // Initialize with empty data
                getPosition: d => d.position,
                getWeight: d => d.weight,
                radiusPixels: 100
            });
            map.addLayer(heatmapLayer);
        });
    }
}

// Function to update the heatmap data
function buildHeatMap(samples) {
    let heatmapData = samples.map(sample => ({
        position: [parseFloat(sample['Longitude']), parseFloat(sample['Latitude'])],
        weight: parseInt(sample['Value'])
    }));

    if (heatmapLayer) {
        heatmapLayer.setProps({ data: heatmapData });
    }
}

// Populate dropdowns with years from the data
function populateDropdowns(samples) {
    // Extract years from the data
    let years = new Set(samples.map(sample => sample['Year']));
    
    // Select dropdown element
    let yearDropdown = d3.select("#yearDropdown");

    // Add "All" option at the beginning of dropdown
    yearDropdown.append("option").text("All").property("value", "");

    // Add year options to the dropdown
    years.forEach(year => {
        yearDropdown.append("option").text(year).property("value", year);
    });

    // Add event listener for dropdown change
    yearDropdown.on("change", updateCharts);
}

// Function to update the charts and heatmap when the dropdown changes
function updateCharts() {
    let selectedYear = d3.select("#yearDropdown").property("value");
    updateChartTitles(selectedYear); // Add this line
    buildPieChart(dataSamples, selectedYear);
    loadDataAndBuildSecondChart(dataSamples, selectedYear);
    buildHeatMap(dataSamples); // Update heatmap data
}

// Wait for the DOM content to be loaded before executing the following code
document.addEventListener('DOMContentLoaded', function() {
    initializeMap(); // Initialize the map

    // Fetch data from JSON file
    fetch('static/json/data.json')
        .then(response => response.json())
        .then(data => {
            dataSamples = data; // Assign data to global variable
            // Initialize dropdowns and charts with the fetched data
            populateDropdowns(dataSamples);
            buildPieChart(dataSamples, "");
            loadDataAndBuildSecondChart(dataSamples, "");
            buildHeatMap(dataSamples);
            updateChartTitles(""); // Add this line
        })
        .catch(error => console.error('Error fetching JSON data:', error));
});

// Function to build a pie chart (box0)
function buildPieChart(samples, selectedYear = "") {
    // Filter the data based on the selected year
    let filteredData = samples.filter(sample => {
        let year = sample['Year'];
        return (selectedYear ? year === selectedYear : true);
    });

    // Process data for the pie chart
    let borderData = {};
    filteredData.forEach(sample => {
        let border = sample['Border'].replace("US-", "").replace(" Border", "");
        let value = parseInt(sample['Value']);
        if (border && !isNaN(value)) {
            if (borderData[border]) {
                borderData[border] += value;
            } else {
                borderData[border] = value;
            }
        }
    });

    // Order borders: Mexico first, then Canada, then others
    let borderNames = ["Mexico", "Canada"].concat(Object.keys(borderData).filter(border => border !== "Mexico" && border !== "Canada"));
    let borderValues = borderNames.map(border => borderData[border]);

    // Calculate percentages
    let totalValue = borderValues.reduce((sum, value) => sum + value, 0);
    let borderPercentages = borderValues.map(value => (value / totalValue) * 100);

    // Define colors for the pie chart
    let borderColors = borderNames.map(border => {
        if (border === 'Mexico') {
            return '#006341';
        } else if (border === 'Canada') {
            return '#D80621';
        } else {
            return '#cccccc';
        }
    });

    // Prepare data and layout for the pie chart
    let pieData = [{
        values: borderPercentages,
        labels: borderNames,
        type: 'pie',
        marker: {
            colors: borderColors,
            line: {
                color: '#000000',
                width: 1
            }
        },
        textinfo: 'none', // No mostrar etiquetas dentro de la gráfica
        hoverinfo: 'label+percent'
    }];

    let pieLayout = {
        showlegend: false,
        autosize: true,
        margin: { l: 40, r: 40, b: 80, t: 40 },
        height: document.getElementById('box0').clientHeight - 40,
        width: document.getElementById('box0').clientWidth - 40,
        annotations: borderNames.map((name, index) => ({
            x: 0.5,
            y: -0.2 - index * 0.1,
            xref: 'paper',
            yref: 'paper',
            text: `${name}: ${borderPercentages[index].toFixed(2)}%`,
            showarrow: false
        }))
    };

    // Render the pie chart
    Plotly.newPlot("box0", pieData, pieLayout, {responsive: true});
}

// Function to build a line chart (box1)
function loadDataAndBuildSecondChart(samples, selectedYear = "") {
    let filteredData = samples;
    let xValues = [];
    let yValues = [];

    if (selectedYear === "") {
        let years = [...new Set(samples.map(sample => sample['Year']))];
        years.sort((a, b) => a - b);
        
        xValues = years;
        yValues = years.map(year => {
            let yearlyData = samples.filter(sample => sample['Year'] === year);
            return yearlyData.reduce((sum, sample) => sum + parseInt(sample['Value']), 0);
        });
    } else {
        filteredData = samples.filter(sample => sample['Year'] === selectedYear);
        let months = [...new Set(filteredData.map(sample => sample['Month']))];
        months.sort((a, b) => monthNames.indexOf(a) - monthNames.indexOf(b));
        
        xValues = months;
        yValues = months.map(month => {
            let monthlyData = filteredData.filter(sample => sample['Month'] === month);
            return monthlyData.reduce((sum, sample) => sum + parseInt(sample['Value']), 0);
        });
    }

    let lineData = [{
        x: xValues,
        y: yValues,
        mode: 'lines+markers',
        line: {
            shape: 'spline'
        },
        marker: {
            size: 8
        }
    }];

    let lineLayout = {
        xaxis: {
            tickangle: -45,
            ticktext: xValues,
            tickvals: xValues
        },
        margin: { t: 40, r: 20, b: 80, l: 50 },
        height: document.getElementById('box1').clientHeight - 40,
        width: document.getElementById('box1').clientWidth - 40
    };

    Plotly.newPlot("box1", lineData, lineLayout);
}
