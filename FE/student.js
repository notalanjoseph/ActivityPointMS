function refreshPage() {
  // clear inputs
  document.getElementById("semFE").selectedIndex = 0;
  document.getElementById("catFE").selectedIndex = 0;
  document.getElementById("titleFE").value = "";
  document.getElementById("proofFE").value = "";
  document.getElementById("lastbutton").value = "SUBMIT";
  
  // Retrieve user_id from localStorage
  const loggedInUser = JSON.parse(localStorage.getItem('person'));
  //console.log('User ID in localstog:', loggedInUser.email);

  const formData = new FormData();
  formData.append("user_id", loggedInUser.email);

  // display all activities of student
  fetch("http://localhost:8000/view", {
    method: "POST",
    body: formData
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log(data.data); //data has a "data" property

    // dynamically generate table rows
    const tableBody = document.querySelector("#data-table tbody");
    tableBody.innerHTML = "";
    // Iterate over the data array and create rows
    data.data.forEach((entry) => {
      const row = document.createElement("tr");
      // Create table cells and populate with data
      for (const key in entry) {
        const cell = document.createElement("td");
        // Check if the current key is "proof" to create a clickable link
        if (key === "proof") {
          const link = document.createElement('a');
          link.href = entry[key];
          link.textContent = "Link";
          link.target = "_blank"; // Open link in a new tab/window
          cell.appendChild(link);
        } else {
            cell.textContent = entry[key];
        }
        row.appendChild(cell);
      }
      tableBody.appendChild(row);
    });

    // display total points of student
    fetch("http://localhost:8000/total", {
      method: "POST",
      body: formData
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log("sum equals", data);
      if(data.data === null || data.data === undefined || data.data.sum === null || data.data.sum === undefined) {
        {}
      } else {
        var t = parseInt(JSON.stringify(data.data.sum));
        progressText.innerHTML = t;
        document.getElementById('progressCircle').style.strokeDashoffset = 3.297*(100-t);
      }
    });
  });
}


function uploadActiviy() {
  var loggedInUser = JSON.parse(localStorage.getItem("person"));
  var s = document.forms["uploadForm"]["semFE"].value;
  var c = document.forms["uploadForm"]["catFE"].value;
  var t = document.forms["uploadForm"]["titleFE"].value;
  var p = document.forms["uploadForm"]["proofFE"].value;
  
  // Create a FormData object and append the data
  const formData = new FormData();
  formData.append("user_id", loggedInUser.email);
  formData.append("semester", s);
  formData.append("category", c);
  formData.append("title", t);
  formData.append("proof", p);

  // Make a fetch request to your FastAPI backend
  fetch("http://localhost:8000/upload", {
    method: "POST",
    body: formData
  })
  .then((response) => {
    if (!response.ok) {
      document.getElementById("lastbutton").value = "error";
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    document.getElementById("lastbutton").value = "submitted";
    return response.json();
  })
  .then(console.log);
}


$(document).on("click", '.section1 [name="bottom-button"]', refreshPage);
$(document).on("click", '.section2 [name="lastbutton"]', uploadActiviy);
$(document).on("click", '.section1 [name="top-button"]', function() { window.location.replace("index.html"); });

//$('.form button').click(validateForm());
