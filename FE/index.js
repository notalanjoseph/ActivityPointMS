// index page animation
$('.message a').click(function() {
   removeAlerts();
   $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});
function removeAlerts() {
  document.getElementById("display").innerHTML = "";
  document.forms["newForm"]["emailFE"].value = "";
  document.forms["newForm"]["passwordFE"].value = "";
  document.forms["newForm"]["typeFE"].value = "";
  document.forms["oldForm"]["passwordFE"].value = "";
}

function registerForm() {
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
  var u = document.forms["oldForm"]["emailFE"].value;
  var p = document.forms["oldForm"]["passwordFE"].value;

  if(u == "admin" && p == "123") {
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
    return response.json();  //necessary for next then
  })
  .then((data) => {
    // Store the user_id in local storage
    var person = data.user_id;
    localStorage.setItem("person", JSON.stringify(person));

    //check if professor
    if (person.type == 2)  {
      window.location.href = "teacher.html";
      return true;
    }

    //else student
    window.location.href = "student.html";
  });
}

$(document).on('click', '[name="createbutton"]', registerForm);
$(document).on('click', '[name="loginbutton"]', validateForm);

//$('.form button').click(validateForm());
