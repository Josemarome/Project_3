
// GENERAL 

document.addEventListener('DOMContentLoaded', function() {
    // Connection to Flask Server
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
