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



// BOX1











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









