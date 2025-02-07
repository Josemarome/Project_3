// Log message to confirm that logic.js has loaded successfully
console.log("logic.js loaded successfully!");

// Fetch data from Flask server and initialize dropdowns and charts
document.addEventListener('DOMContentLoaded', function() {
    fetch('/data')
        .then(response => response.json())
        .then(data => {
            console.log('Data received from server:', data);  // Verifica los datos recibidos
            populateDropdowns(data);
          //  buildCharts(data, "", "");
            loadDataAndBuildSecondChart(data); // Llamamos a la función para la segunda gráfica
        })
        .catch(error => console.error('Error:', error));
});

// Populate dropdowns with years and months from the data
function populateDropdowns(samples) {
    let years = new Set(samples.map(sample => sample[5]));
    let months = new Set(samples.map(sample => sample[4]));

    let yearDropdown = d3.select("#yearDropdown");
    let monthDropdown = d3.select("#monthDropdown");

    const monthNames = [
        "January", "February", "March", "April", "May",
        "June", "July", "August", "September", "October",
        "November", "December"
    ];

    let sortedMonthsArray = Array.from(months);
    let sortedMonths = sortedMonthsArray.sort((a, b) => monthNames.indexOf(a) - monthNames.indexOf(b));

    yearDropdown.append("option").text("All").property("value", "");
    monthDropdown.append("option").text("All").property("value", "");

    years.forEach(year => {
        yearDropdown.append("option").text(year).property("value", year);
    });

    sortedMonths.forEach(month => {
        monthDropdown.append("option").text(month).property("value", month);
    });

    yearDropdown.on("change", updateCharts);
    monthDropdown.on("change", updateCharts);

    function updateCharts() {
        let selectedYear = yearDropdown.property("value");
        let selectedMonth = monthDropdown.property("value");
        buildCharts(samples, selectedYear, selectedMonth);
    }
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


//BOX2