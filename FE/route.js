// index page animation
$('.message a').click(function() {
   removeAlerts();
   $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});


function removeAlerts() {
  document.getElementById("display").innerHTML = "";
}

function regForm() {
  var u = document.forms["newForm"]["emailFE"].value;
  var p = document.forms["newForm"]["passwordFE"].value;
  var t = document.forms["newForm"]["typeFE"].value;
  
  // Create a FormData object and append the credentials
  const formData = new FormData();
  formData.append("username", u);
  formData.append("password", p);
  formData.append("type", t);

  // Make a fetch request to your FastAPI backend
  fetch("http://localhost:8000/users", {
    method: "POST",
    body: formData
  })
  .then((response) => {
    if (!response.ok) {
      document.getElementById("display").innerHTML = "ERROR";
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    document.getElementById("display").innerHTML = "created";
    return response.json();
  })
  .then(console.log);
}


function validateForm() {
  //removeAlerts();

  var u = document.forms["oldForm"]["emailFE"].value;
  var p = document.forms["oldForm"]["passwordFE"].value;
/*
    if(!username && !pwd){
        document.getElementById("error").innerHTML = "Please input username and password";
        return false;
    } else if(username == null || username == ""){
		document.getElementById("error").innerHTML = "Please input your username";
		return false;
    } else if(pwd == null || pwd == ""){
		document.getElementById("error").innerHTML = "Please input your password";
		return false;
	} else if(pwd.length < 6){
		document.getElementById("error").innerHTML = "your password should be minimum 6 character";
		return false;
	}
*/    

  if(u == "admin" && p == "123") {
    removeAlerts();
    $("form").animate({ height: "toggle", opacity: "toggle" }, "slow");
    return true;
  }

  // Create a FormData object and append the credentials
  const formData = new FormData();
  formData.append('username', u);
  formData.append('password', p);

  // Make a fetch request to your FastAPI backend
  fetch("http://localhost:8000/login", {
    method: "POST",
    body: formData
  })
  .then((response) => {
    if (!response.ok) {
      document.getElementById("display").innerHTML = "ERROR";
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    //document.getElementById("display").innerHTML = "success";      
    return response.json();  //necessary for next then
  })

      /*
            .then(data => {
                // Display the response on the page
                document.getElementById('error').innerHTML = JSON.stringify(data, null, 2);
            })
            .catch(error => {
                console.error('Fetch error:', error);
            })
            
      .then(console.log)
*/
  .then((data) => {
    // Store the user_id in the variable
    var person = data.user_id;
    localStorage.setItem("person", JSON.stringify(person));


    //check if professor
    if(person.type == 2)  {
      document.getElementById("display").innerHTML = "teacher";
      return true;
    }



    window.location.href = "student.html";
  });
}

function showActivites() {

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
      document.getElementById("display").innerHTML = "ERROR";
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    //document.getElementById("error").innerHTML  = JSON.stringify(data, null, 2);
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
    //console.log(data.data.sum);
    total.innerHTML = JSON.stringify(data.data.sum);
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
      document.getElementById("display").innerHTML = "ERROR";
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    document.getElementById("display").innerHTML = "submitted";
    return response.json();
  })
  .then(console.log);
}

//total points

//allot points

$(document).on('click', '.form [name="loginbutton"]', validateForm);
$(document).on('click', '.form [name="createbutton"]', regForm);
$(document).on("click", '.section1 [name="top-button"]', function() { window.location.replace("index.html"); });
$(document).on("click", '.section1 [name="bottom-button"]', showActivites);
$(document).on("click", '.section2 [name="lastbutton"]', uploadActiviy);

//$('.form button').click(validateForm());