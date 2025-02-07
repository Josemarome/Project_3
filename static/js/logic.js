// Log message to confirm that logic.js has loaded successfully
console.log("logic.js loaded successfully!");

// Fetch data from Flask server and initialize dropdowns and charts
document.addEventListener('DOMContentLoaded', function() {
    // Wait until the DOM is fully loaded
    fetch('/data')
        .then(response => response.json())
        .then(data => {
            populateDropdowns(data);  

            buildCharts(data, "", "");  

        })
        .catch(error => console.error('Error:', error));  
});


// Populate dropdowns with years and months from the data
function populateDropdowns(samples) {
    // Extract years and months from the data
    let years = new Set(samples.map(sample => sample[5]));
    let months = new Set(samples.map(sample => sample[4]));

    let yearDropdown = d3.select("#yearDropdown");
    let monthDropdown = d3.select("#monthDropdown");

    // Mapping month names to indexes
    const monthNames = [
        "January", "February", "March", "April", "May",
        "June", "July", "August", "September", "October",
        "November", "December"
    ];

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
        let selectedYear = yearDropdown.property("value");
        let selectedMonth = monthDropdown.property("value");
        buildCharts(samples, selectedYear, selectedMonth);  
    }

    yearDropdown.on("change", updateCharts);
    monthDropdown.on("change", updateCharts);
}



// BOX1 - Second chart (line chart with markers)
function loadDataAndBuildSecondChart(data) {
    const years = Array.from(new Set(data.map(d => parseInt(d[5])))).sort((a, b) => a - b);
    const yearDropdown = document.getElementById('yearDropdown');
    const allOption = document.createElement('option');
    allOption.value = 'All';
    allOption.textContent = 'All';
    yearDropdown.appendChild(allOption);

    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearDropdown.appendChild(option);
    });

    yearDropdown.addEventListener('change', function() {
        updateSecondChart(data, this.value);
    });

    if (years.length > 0) {
        yearDropdown.value = 'All';
        updateSecondChart(data, 'All');
    }
}

function updateSecondChart(data, selectedYear) {
    let filteredData;

    if (selectedYear === 'All') {
        filteredData = data;
    } else {
        filteredData = data.filter(d => d[5] === selectedYear);
    }

    // Group data by year using d3.nest (for D3 versions 5.x and below)
    const yearData = d3.nest()
        .key(d => d[5])  // Group by the year (d[5] is assumed to be the year)
        .rollup(v => d3.sum(v, d => +d[7]))  // Sum the values (d[7] is assumed to be the crossing values)
        .entries(filteredData);

    const years = yearData.map(d => d.key);
    const crossings = yearData.map(d => d.value / 1_000_000);  // Convert to millions

    const trace = {
        x: years,
        y: crossings,
        type: 'scatter',
        mode: 'lines+markers', // 'lines+markers' will display both lines and markers (bolitas)
        line: {color: '#005A8B', width: 3},
        marker: {color: '#005A8B', size: 8}, // Customize the marker (bolitas)
        text: selectedYear !== 'All' ? crossings.map(cross => cross.toFixed(0)) : [],
        textposition: 'top center', // Position the labels above the points
        hoverinfo: 'text'
    };

    const layout = {
        title: 'Crossings by Year',
        xaxis: {
            title: 'Year',
            tickangle: 45,
            tickmode: 'linear',
            tickvals: years,
            ticktext: years.map(year => year.toString())
        },
        yaxis: {
            title: 'Number of Crossings (MM)',
            tickformat: ',.0f'
        },
        plot_bgcolor: '#f9f9f9',
        margin: {t: 50, b: 150},
        showlegend: false
    };

    Plotly.newPlot('chart2', [trace], layout);
}


// BOX2

// Function to build charts based on selected year and month
function buildCharts(samples, selectedYear, selectedMonth) {
    // Filter data based on the selected year and month
    let filteredData = samples.filter(sample => {
        let year = sample[5];
        let month = sample[4];

        return (selectedYear ? year === selectedYear : true) &&
               (selectedMonth ? month === selectedMonth : true);
    });

    // Initialize the transportTypes object to aggregate data
    let transportTypes = {};

    // Process the data to aggregate by transport type
    filteredData.forEach(sample => {
        let transportType = sample[6];
        let value = parseInt(sample[7]);

        if (transportType && !isNaN(value)) {
            if (transportTypes[transportType]) {
                transportTypes[transportType] += value;
            } else {
                transportTypes[transportType] = value;
            }
        }
    });

    // Convert the transportTypes object into arrays for plotting
    let transportTypeNames = Object.keys(transportTypes);
    let transportTypeValues = Object.values(transportTypes);

    // Sort the data by values in descending order
    let sortedData = transportTypeNames.map((name, index) => {
        return { name: name, value: transportTypeValues[index] };
    }).sort((a, b) => b.value - a.value);

    // Separate the sorted data into names and values arrays
    transportTypeNames = sortedData.map(d => d.name);
    transportTypeValues = sortedData.map(d => d.value);

    // Ensure the largest values are at the top
    transportTypeNames.reverse();
    transportTypeValues.reverse();

    // Build a Bar Chart with the processed data
    let barData = [{
        y: transportTypeNames,
        x: transportTypeValues,
        text: transportTypeNames,
        type: "bar",
        orientation: "h",
    }];

    // Adjust chart size to fit the container
    let box2Element = document.getElementById('box2');
    if (box2Element) {
        let box2Width = box2Element.clientWidth;
        let box2Height = box2Element.clientHeight;

        let barLayout = {
            title: "Total Border Crossings by Transport Type",
            xaxis: { title: "Number of Crossings" },
            yaxis: { title: "", showticklabels: true },
            margin: { t: 50, l: 150, r: 50, b: 50 },
            autosize: true
        };

        Plotly.newPlot("box2", barData, barLayout);  
    }
}



// BOX3

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
      //console.log(location);
      heatArray.push([location.coordinates[1], location.coordinates[0]]);
    }

  }

  let heat = L.heatLayer(heatArray, {
    radius: 20,
    blur: 35
  }).addTo(myMap);

});









