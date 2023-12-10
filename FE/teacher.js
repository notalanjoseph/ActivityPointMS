function refreshSubmissionsTable() {
  // display points of student
  fetch("http://localhost:8000/teacher/viewnew", {
    method: "GET",
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log(data.data);
    // dynamically generate table rows
    const tableBody = document.querySelector("#submissions-table tbody");
    tableBody.innerHTML = "";
    data.data.forEach((entry) => {
      const row = document.createElement("tr");
      for (const key in entry) {
        const cell = document.createElement("td");

        if (key === "id") {
            {}
        } else if (key === "proof") {
            const link = document.createElement('a');
            link.href = entry[key];
            link.textContent = "Link";
            link.target = "_blank"; // Open link in a new tab/window
            cell.appendChild(link);
            row.appendChild(cell);

        } else {
            cell.textContent = entry[key];
            row.appendChild(cell);
        }
      }

      // Add a button to each row
      const inputCell = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'number';
      //input.value = entry[key];
      inputCell.appendChild(input);
      row.appendChild(inputCell);

      // Add a button to each row
      const buttonCell = document.createElement('td');
      const button = document.createElement('button');
      button.textContent = 'submit';
      button.addEventListener('click', () => uploadPoint(entry.id, row));
      buttonCell.appendChild(button);
      row.appendChild(buttonCell);

      tableBody.appendChild(row);
    });
  });
}


function refreshPointsTable() {
  // display points of student
  fetch("http://localhost:8000/teacher/viewold", {
    method: "GET",
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log(data.data);
    // dynamically generate table rows
    const tableBody = document.querySelector("#points-table tbody");
    tableBody.innerHTML = "";
    data.data.forEach((entry) => {
      const row = document.createElement("tr");
      for (const key in entry) {
        const cell = document.createElement("td");
        cell.textContent = entry[key];
        row.appendChild(cell);
      }
      tableBody.appendChild(row);
    });
  });
}




// Function to upload points, edit using latest reply from chatgpt!
function uploadPoint(id, row) {
  // Get the input element within the row
  const inputElement = row.querySelector('input');

  // Extract the points entered by the user
  const points = inputElement.value;

  const formData = new FormData();
  formData.append("post_id", id);
  formData.append("points", points);


  fetch("http://localhost:8000/teacher/allot", {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response if needed
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


$(document).ready(function() {
  $('[id="refresh-button"]').on("click", function() {
    refreshPointsTable();
    setTimeout(function() {
      refreshSubmissionsTable();
    }, 1000);
  });
});