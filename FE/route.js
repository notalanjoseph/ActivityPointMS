// index page animation
$('.message a').click(function() {
   removeAlerts();
   $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});


function removeAlerts() {
  document.getElementById("display").innerHTML = "";
  document.getElementById("display").innerHTML = "";
  document.getElementById("display").innerHTML = "";
  document.getElementById("display").innerHTML = "";
}

function regForm() {
  var username = document.forms["newForm"]["emailFE"].value;
  var pwd = document.forms["newForm"]["passwordFE"].value;
  
  // Create a FormData object and append the credentials
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", pwd);

  // Make a fetch request to your FastAPI backend
  fetch("http://localhost:8000/users", {
    method: "POST",
    body: formData
  })
  then((response) => {
    if (!response.ok) {
      document.getElementById("display").innerHTML = "ERROR";
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    document.getElementById("display").innerHTML = "success";
    window.location.href = "index.html";
    return response.json();
  })
  .then(console.log);
}


function validateForm() {
  //removeAlerts();

  var username = document.forms["oldForm"]["emailFE"].value;
  var pwd = document.forms["oldForm"]["passwordFE"].value;
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
    // Create a FormData object and append the credentials
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', pwd);

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
    document.getElementById("display").innerHTML = "success";      
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
    window.location.href = "home.html";
    // Use the data for future fetch requests or other actions
    //handleLoggedInUser(loggedInUserId);
  });
}

function showActivites() {

  // Retrieve user_id from localStorage
  var personString = localStorage.getItem("person");
  var person = JSON.parse(personString);
  console.log(person.email);

  const loggedInUser = JSON.parse(localStorage.getItem('person'));

  console.log('User ID in localstog:', loggedInUser.email);
  const formData = new FormData();
  formData.append("user_id", loggedInUser.email);

  // Make a fetch request to your FastAPI backend
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
    // Handle the data as needed
    console.log(data.data); // Assuming the data has a "data" property
    //displayData(data.data);
    document.getElementById("display").innerHTML = JSON.stringify(data.data, null, 2);
  });
}


$(document).on('click', '.form [name="loginbutton"]', validateForm);
$(document).on('click', '.form [name="createbutton"]', regForm);
$(document).on("click", '.section1 [name="bottom-button"]', showActivites);

//$('.form button').click(validateForm());