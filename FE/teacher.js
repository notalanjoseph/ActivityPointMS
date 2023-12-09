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


//$(document).on("click", '[id="refresh-button"]', refreshPointsTable);
//$(document).on("click", '[id="refresh-button"]', refreshSubmissionsTable);


$(document).on("click", '[id="refresh-button"]', function() {
  //refreshPointsTable();
  refreshSubmissionsTable();
});
