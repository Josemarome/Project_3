
// GENERAL 

// Connection to Flask Server
document.addEventListener('DOMContentLoaded', function() {
  // Make a GET request to the Flask server
  fetch('/data')
      .then(response => response.json())
      .then(data => {
          console.log(data);
      })
      .catch(error => console.error('Error:', error));
});




// BOX3 





// BOX3 





// BOX3 
