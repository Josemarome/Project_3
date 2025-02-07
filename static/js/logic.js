// Log message to confirm that logic.js has loaded successfully
console.log("logic.js loaded successfully!");

// Fetch data from JSON file and initialize dropdowns and charts
document.addEventListener('DOMContentLoaded', function() {
    fetch('static/json/data.json')
        .then(response => response.json())
        .then(data => {
            populateDropdowns(data);
            buildPieChart(data, "");
            loadDataAndBuildSecondChart(data, "");
            buildCharts(data, "", "");
        })
        .catch(error => console.error('Error fetching JSON data:', error));
});

// Define monthNames globally
const monthNames = [
    "January", "February", "March", "April", "May",
    "June", "July", "August", "September", "October",
    "November", "December"
];

// Populate dropdowns with years and months from the data
function populateDropdowns(samples) {
    // Extract years and months from the data
    let years = new Set(samples.map(sample => sample['Year']));
    let months = new Set(samples.map(sample => sample['Month']));
    
    // Select dropdown elements
    let yearDropdown = d3.select("#yearDropdown");
    let monthDropdown = d3.select("#monthDropdown");

    // Sort months alphabetically to ensure consistency
    let sortedMonthsArray = Array.from(months);
    let sortedMonths = sortedMonthsArray.sort((a, b) => monthNames.indexOf(a) - monthNames.indexOf(b));

    // Add "All" option at the beginning of dropdowns
    yearDropdown.append("option").text("All").property("value", "");
    monthDropdown.append("option").text("All").property("value", "");

    // Add year options to the dropdown
    years.forEach(year => {
        yearDropdown.append("option").text(year).property("value", year);
    });

    // Add month options to the dropdown
    sortedMonths.forEach(month => {
        monthDropdown.append("option").text(month).property("value", month);
    });

    // Add event listener for dropdown changes
    function updateCharts() {
        // Get selected year and month from dropdowns
        let selectedYear = yearDropdown.property("value");
        let selectedMonth = monthDropdown.property("value");
        
        // Update charts based on the selected year and month
        buildCharts(samples, selectedYear, selectedMonth);
        buildPieChart(samples, selectedYear);
        loadDataAndBuildSecondChart(samples, selectedYear);
    }
    
    // Attach event listeners to dropdowns
    yearDropdown.on("change", updateCharts);
    monthDropdown.on("change", updateCharts);
}



// BOX0 - Function to build Pie Chart based on border data
function buildPieChart(samples, selectedYear = "") {
    // Filter data based on the selected year
    let filteredData = samples.filter(sample => {
        let year = sample['Year'];
        return (selectedYear ? year === selectedYear : true);
    });

    // Initialize the borderData object to aggregate data
    let borderData = {};

    // Process the data to aggregate by border
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

    // Convert the borderData object into arrays for plotting
    let borderNames = Object.keys(borderData);
    let borderValues = Object.values(borderData);

    // Calculate the total value for percentages
    let totalValue = borderValues.reduce((sum, value) => sum + value, 0);

    // Calculate the percentages
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

    // Build a Pie Chart with the processed data
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
        }
    }];

    // Define the pie chart title dynamically
    let pieTitle;
    if (selectedYear) {
        pieTitle = `Distribution of Border Crossings by Country in ${selectedYear}`;
    } else {
        pieTitle = "Distribution of Border Crossings by Country";
    }

    // Apply the title to the pie chart layout
    let pieLayout = {
        title: pieTitle,
        height: 400,
        width: 500
    };

    // Render the pie chart in the "box0" element
    Plotly.newPlot("box0", pieData, pieLayout);
}



// BOX1 - Function to build line chart with markers based on selected year
function loadDataAndBuildSecondChart(samples, selectedYear = "") {
    let filteredData = samples;
    let xValues = [];
    let yValues = [];

    if (selectedYear === "") {
        // Show all years (1996 - 2024) on the x-axis
        let years = [...new Set(samples.map(sample => sample['Year']))];
        years.sort((a, b) => a - b); // Sort years in ascending order

        years.forEach(year => {
            // Aggregate data by year
            let totalValue = samples.filter(sample => sample['Year'] === year)
                                    .reduce((sum, sample) => sum + parseInt(sample['Value']), 0);
            xValues.push(year);
            yValues.push(totalValue);
        });
    } else {
        // Show the months of the selected year on the x-axis
        filteredData = samples.filter(sample => sample['Year'] === selectedYear);
        let aggregatedData = {};
        
        // Aggregate data by month for the selected year
        filteredData.forEach(sample => {
            let month = sample['Month'];
            let value = parseInt(sample['Value']);

            // Check for valid month and value, then aggregate data
            if (month && !isNaN(value)) {
                if (aggregatedData[month]) {
                    aggregatedData[month] += value;
                } else {
                    aggregatedData[month] = value;
                }
            }
        });

        // Set xValues to monthNames and map yValues to aggregated data for each month
        xValues = monthNames;
        yValues = xValues.map(month => aggregatedData[month] || 0);
    }

    // Build the line chart with the processed data
    let trace = {
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines+markers', // 'lines+markers' will display both lines and markers
        line: {color: '#005A8B', width: 3},
        marker: {color: '#005A8B', size: 8}, // Customize the marker
        text: selectedYear !== "" ? yValues.map(cross => cross.toFixed(0)) : [],
        textposition: 'top center', // Position the labels above the points
        hoverinfo: 'text'
    };

    // Define the layout for the line chart
    let layout = {
        title: selectedYear ? `Total Crossings by Month in ${selectedYear}` : "Total Crossings by Year",
        height: 400,
        width: 600,
        xaxis: {
            title: selectedYear ? "Month" : "Year",
            tickangle: 45, // Rotate tick labels
            tickmode: 'linear',
            tickvals: xValues,
            ticktext: xValues.map(x => x.toString())
        },
        yaxis: {
            title: "Number of Crossings (MM)",
            tickformat: ',.0f'
        },
        plot_bgcolor: '#f9f9f9', // Background color of the plot area
        margin: {t: 50, b: 150},
        showlegend: false // Hide legend
    };

    // Render the line chart in the "box1" element
    Plotly.newPlot("box1", [trace], layout);
}



// BOX2 - Function to build bar charts based on selected year and month
function buildCharts(samples, selectedYear, selectedMonth) {
    // Filter data based on the selected year and month
    let filteredData = samples.filter(sample => {
        let year = sample['Year'];
        let month = sample['Month'];

        return (selectedYear ? year === selectedYear : true) &&
               (selectedMonth ? month === selectedMonth : true);
    });

    // Initialize the transportTypes object to aggregate data
    let transportTypes = {};

    // Process the data to aggregate by transport type
    filteredData.forEach(sample => {
        let transportType = sample['Measure'];
        let value = parseInt(sample['Value']);
        if (transportType && !isNaN(value)) {
            if (transportTypes[transportType]) {
                transportTypes[transportType] += value;
            } else {
                transportTypes[transportType] = value;
            }
        }
    });

    // Convert the transportTypes object into arrays for the chart
    let transportTypeNames = Object.keys(transportTypes);
    let transportTypeValues = Object.values(transportTypes);

    // Sort the data by values in descending order
    let sortedData = transportTypeNames.map((name, index) => {
        return { name: name, value: transportTypeValues[index] };
    }).sort((a, b) => b.value - a.value);

    // Separate the sorted data into arrays of names and values
    transportTypeNames = sortedData.map(d => d.name);
    transportTypeValues = sortedData.map(d => d.value);

    // Ensure that the largest values are at the top
    transportTypeNames.reverse();
    transportTypeValues.reverse();

    // Define the color sequence
    let colorSequence = ['#B31942', '#FFFFFF', '#0A3161'];

    // Assign colors to each data point in a cyclical manner
    let barColors = transportTypeNames.map((_, index) => colorSequence[index % colorSequence.length]);

    // Define a consistent border color for all bars
    let borderColor = '#000000';

    // Build a Bar Chart with the processed data
    let barData = [{
        y: transportTypeNames,
        x: transportTypeValues,
        text: transportTypeNames,
        type: "bar",
        orientation: "h",
        marker: {
            color: barColors,
            line: {
                color: borderColor,
                width: 1
            }
        }
    }];

    // Define the bar chart title dynamically
    let barTitle;
    if (selectedYear) {
        if (selectedMonth) {
            barTitle = `Total Border Crossings by Transport Type in ${selectedMonth} ${selectedYear}`;
        } else {
            barTitle = `Total Border Crossings by Transport Type in ${selectedYear}`;
        }
    } else {
        barTitle = "Total Border Crossings by Transport Type";
    }

    // Apply the title to the bar chart layout
    let barLayout = {
        title: barTitle,
        xaxis: { title: "Number of Crossings" },
        yaxis: { title: "", showticklabels: true },
        margin: { t: 50, l: 200, r: 50, b: 50 },
        autosize: true
    };

    // Render the bar chart in the "box2" element
    Plotly.newPlot("box2", barData, barLayout);
}



// Adjust the chart size to fit the container
function resizeCharts() {
    Plotly.Plots.resize(document.getElementById('box0'));
    Plotly.Plots.resize(document.getElementById('box1'));
    Plotly.Plots.resize(document.getElementById('box2'));
    Plotly.Plots.resize(document.getElementById('box3'));
}

// Call resizeCharts on window resize
window.addEventListener('resize', resizeCharts);

// Initial call to adjust charts
resizeCharts();




// BOX3 - Map Visualization (Assuming `url` is defined elsewhere in your code)
let myMap = L.map("map", {
    center: [40.7, -94.5],
    zoom: 3
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


d3.json(url).then(function(response) {
    console.log(response);
    features = response.features;

    let heatArray = [];

    for (let i = 0; i < features.length; i++) {
        let location = features[i].geometry;
        if (location) {
            heatArray.push([location.coordinates[1], location.coordinates[0]]);
        }
    }

    let heat = L.heatLayer(heatArray, {
        radius: 20,
        blur: 35
    }).addTo(myMap);
});






