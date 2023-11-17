$('.message a').click(function(){
   removeAlerts();
   $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});



//from another pen

function removeAlerts(){
  document.getElementById("error").innerHTML = "";
  document.getElementById("error").innerHTML = "";
  document.getElementById("error").innerHTML = "";
  document.getElementById("error").innerHTML = "";
}




function regForm() {
  var username = document.forms["newForm"]["username"].value;
  var pwd = document.forms["newForm"]["password"].value;
  
  // Create a FormData object and append the credentials
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", pwd);

  // Make a fetch request to your FastAPI backend
  fetch("http://localhost:8000/users", {
    method: "POST",
    body: formData
  })
    .then((response) => {
      if (!response.ok) {
        document.getElementById("error").innerHTML = "ERROR";
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      document.getElementById("error").innerHTML = "success";
      window.location.href = "index.html";
      return response.json();
    })
    .then(console.log);
}


function validateForm() {
  //removeAlerts();

    var username = document.forms["myForm"]["username"].value;
    var pwd = document.forms["myForm"]["password"].value;
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
    fetch('http://localhost:8000/login', {
      method: 'POST',
      body: formData
    })

    .then(response => {
      if (!response.ok) {
        document.getElementById("error").innerHTML = "ERROR";
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      document.getElementById("error").innerHTML = "success";
      window.location.href = "landing.html";
      return response.json();
    })


            /*
            .then(data => {
                // Display the response on the page
                document.getElementById('error').innerHTML = JSON.stringify(data, null, 2);
            })
            .catch(error => {
                console.error('Fetch error:', error);
            })
            */
    .then(console.log)  
}

function showActivites() {

  // Make a fetch request to your FastAPI backend
  fetch("http://localhost:8000/view", {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        document.getElementById("error").innerHTML = "ERROR";
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      //document.getElementById("error").innerHTML  = JSON.stringify(data, null, 2);
      return response.json();
    })
    .then((data) => {
      // Handle the data as needed
      console.log(data.data); // Assuming the data has a "data" property
      //displayData(data.data);
      document.getElementById("error").innerHTML  = JSON.stringify(data.data, null, 2);
    });
}


$(document).on('click', '.form [name="logi"]', validateForm);
$(document).on('click', '.form [name="crea"]', regForm);
$(document).on("click", '.form [name="sho"]', showActivites);

//$('.form button').click(validateForm());