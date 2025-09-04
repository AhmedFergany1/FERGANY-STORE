// Login

const emailElement = document.getElementById("email");
const passwordElement = document.getElementById("password");
const rememberElement = document.getElementById("rememberMe");

const loginElement = document.getElementsByClassName("login-btn")[0];
const validationText = document.getElementsByClassName(
  "form-box__validation-login"
)[0];

// rememberMe CheckBox
let rememberCheck = JSON.parse(localStorage.getItem("rememberMe")) || false;

if (rememberCheck) {
  rememberElement.checked = true;
  const userRemember = JSON.parse(localStorage.getItem("userRemember"));
  emailElement.value = userRemember.email;
  password.value = userRemember.password;
}

// Validate on blur (live check)
const inputs = [emailElement, passwordElement];

// Helper: show warning with icon, text, border
function showError(input, message) {
  const warning = input.parentElement.querySelector(".input-warning");
  const textSpan = warning.querySelector(".warning-text");
  textSpan.textContent = message;

  warning.classList.remove("d-none");
  input.classList.add("is-invalid");
}

// Helper: hide warning and remove red border
function hideError(input) {
  const warning = input.parentElement.querySelector(".input-warning");
  warning.classList.add("d-none");
  input.classList.remove("is-invalid");
}

inputs.forEach((input) => {
  input.addEventListener("blur", (_) => {
    if (input.value.trim() === "") {
      if (input == emailElement) {
        showError(input, "Please enter your Email");
      } else {
        showError(input, "Please enter your Password");
      }
    } else {
      hideError(input);
    }
  });
});

// login event
loginElement.addEventListener("click", (event) => {
  event.preventDefault();

  // handle rememebrMe
  if (rememberElement.checked) {
    localStorage.setItem("rememberMe", true);
    localStorage.setItem(
      "userRemember",
      JSON.stringify({
        email: emailElement.value,
        password: passwordElement.value,
      })
    );
  } else {
    localStorage.setItem("rememberMe", false);
    localStorage.removeItem("userRemember");
  }

  // check email is registerd
  const email = emailElement.value;
  const password = passwordElement.value;

  const usersStorage = JSON.parse(localStorage.getItem("users"));
  const checkLogin = usersStorage?.some(
    (element) => element.email === email && element.password === password
  );

  const loggedUser = usersStorage?.filter((user)=> {
    return (user.email === email && user.password === password);
  });


  if (checkLogin) {
    const user = {
      id: loggedUser[0].id,
      userName: loggedUser[0].username,
      userEmail: loggedUser[0].email
    }
    localStorage.setItem("LoggedInUser", JSON.stringify(user));
    window.location.replace('./pages/home.html');
    // alert("succesful");
  } else {
    validationText.textContent = "Email or Password is incorrect!";
  }
});
