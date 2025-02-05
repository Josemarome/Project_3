
// GENERAL 

document.addEventListener('DOMContentLoaded', () => {
  initSqlJs().then(SQL => {
    fetch('static/sql/data.sqlite')
      .then(response => response.arrayBuffer())
      .then(buffer => {
        const db = new SQL.Database(new Uint8Array(buffer));
        const res = db.exec("SELECT * FROM border_crossing_entry_data");
        if (res.length > 0) {
          const data = res[0].values.map(row => {
            return res[0].columns.reduce((acc, col, idx) => {
              acc[col] = row[idx];
              return acc;
            }, {});
          });
          console.log(data);
          renderData(data);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  });
});

// Function to render the data in a table
function renderData(data) {
  const table = document.createElement('table');
  table.className = 'table table-striped'; // Add Bootstrap classes for styling
  const headerRow = table.insertRow();
  
  // Create table headers based on the keys of the first object in the data array
  Object.keys(data[0]).forEach(key => {
    const cell = headerRow.insertCell();
    cell.textContent = key;
  });
  
  // Insert rows of data into the table
  data.forEach(row => {
    const tableRow = table.insertRow();
    Object.values(row).forEach(value => {
      const cell = tableRow.insertCell();
      cell.textContent = value;
    });
  });

  // Append the table to the div with id 'dataTable'
  const dataTableDiv = document.getElementById('dataTable');
  dataTableDiv.innerHTML = ''; // Clear any existing content
  dataTableDiv.appendChild(table);
}




// BOX3 





// BOX3 





// BOX3 
