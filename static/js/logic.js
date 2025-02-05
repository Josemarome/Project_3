console.log("logic.js loaded successfully!");

// GENERAL

document.addEventListener('DOMContentLoaded', function() {
    // Connection to Flask Server
    fetch('/data')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            populateDropdowns(data);
            buildCharts(data, "", "");
        })
        .catch(error => console.error('Error:', error));
});

// BOX1









// BOX2










// BOX3








