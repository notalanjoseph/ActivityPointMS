function refreshSubmissionsTable() {
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
            // Add the id as a data attribute to the row
            row.dataset.id = entry.id;
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
      // Add a textbox to each row
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
      button.addEventListener('click', () => uploadPoint(row));
      buttonCell.appendChild(button);
      row.appendChild(buttonCell);

      tableBody.appendChild(row);
    });
  });
}


function refreshPointsTable() {
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


function uploadPoint(row) {

  // Extract the points entered by the user
  const inputElement = row.querySelector('input');
  const points = inputElement.value;

  // Extract the id from the data attribute
  const id = row.dataset.id;

  const formData = new FormData();
  formData.append("post_id", id);
  formData.append("points", points);

  fetch("http://localhost:8000/teacher/allot", {
        method: 'POST',
        body: formData
    })
    .then((response) => {
      if (!response.ok) {
        const buttonCell = row.querySelector('td button');
        buttonCell.style.backgroundColor = 'red';
        console.log(data);
      }
      return response.json();
    })
    .then(data => {
        const buttonCell = row.querySelector('td button');
        buttonCell.style.backgroundColor = 'green';
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
    }, 500);
  });
});

$(document).on("click", '[id="logout-button"]', function() { window.location.replace("index.html"); });