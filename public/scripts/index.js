const body = document.querySelector("body");

$(document).ready(function () {
  $("#create-account-screen").hide();
  $("#login-screen").hide();
});

// Fade Functions

function titleScreenFade (div) {
  body.style.backgroundColor = "black";

  $("#title-screen").fadeOut(2000);

  setTimeout(function () {
    $("#" + div).hide();

    $("#" + div).fadeIn(2000);
  }, 2000);

  setTimeout(function () {
    body.style.backgroundColor = "#ccff33";
  }, 2000);
}

function createAccountScreenFade (div) {
  body.style.backgroundColor = "black";

  $("#create-account-screen").fadeOut(2000);

  setTimeout(function () {
    $("#" + div).hide();

    $("#" + div).fadeIn(2000);
  }, 2000);

  setTimeout(function () {
    body.style.backgroundColor = "#ccff33";
  }, 2000);
}

function loginScreenFade (div) {
  body.style.backgroundColor = "black";

  $("#login-screen").fadeOut(2000);

  setTimeout(function () {
    $("#" + div).hide();

    $("#" + div).fadeIn(2000);
  }, 2000);

  setTimeout(function () {
    body.style.backgroundColor = "#ccff33";
  }, 2000);
}

// Title Screen Buttons

$("#create-account-button").click(function () {
  titleScreenFade("create-account-screen");
});

$("#login-button").click(function () {
  titleScreenFade("login-screen");
});

// Create Account Screen Buttons 

$("#create-account-back").click(function () {
  createAccountScreenFade("title-screen");
});

// Login Screen Buttons

$("#login-back").click(function () {
  loginScreenFade("title-screen");
});

// Handle False Links

$("#forgot-password").click(function () {
  document.getElementById("email-sent").innerText = "Email Sent!";

  const emailSendRequest = {
    junk : "blank"
  }

  fetch ("/")
});

// Form Handlers

$("#create-account-form").submit(function () {
  event.preventDefault();

  const account_creation_data = {
    name : document.getElementById("account_creation_name").value,
    email : document.getElementById("account_creation_email").value,
    pwd : document.getElementById("account_creation_pwd").value
  }

  fetch ("/create-account", {
    method : "POST",
    headers : {
      'Content-Type' : 'application/json',
    },
    body : JSON.stringify(account_creation_data)
  })
  .then(response => response.text())
  .then(data => {
    console.log(data);

    if (data === "exists") {
      document.getElementById("login-error").innerText = "Error: That account already exists!";
    }
  })
  .catch(error => {
    console.log(error);
  });
});

$("#login-form").submit(function () {
  event.preventDefault();

  const account_login_data = {
    name : document.getElementById("account_login_name").value,
    pwd : document.getElementById("account_login_pwd").value
  }

  fetch ("/login", {
    method : "POST",
    headers : {
      'Content-Type' : 'application/json',
    },
    body : JSON.stringify(account_login_data)
  })
  .then(response => response.text())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.log(error);
  });
});