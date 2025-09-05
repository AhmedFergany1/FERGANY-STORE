// Login

const emailElement = document.getElementById("email");
const passwordElement = document.getElementById("password");
const rememberElement = document.getElementById("rememberMe");
const loginElement = document.getElementsByClassName("login-btn")[0];
const validationText = document.getElementsByClassName("form-box__validation-login")[0];

if (!emailElement || !passwordElement || !rememberElement || !loginElement || !validationText) {
  console.error("One or more login form elements are missing.");
  throw new Error("Login form not properly initialized.");
}

// RememberMe Checkbox
try {
  let rememberCheck = JSON.parse(localStorage.getItem("rememberMe")) || false;

  if (rememberCheck) {
    rememberElement.checked = true;

    const userRemember = JSON.parse(localStorage.getItem("userRemember"));
    if (userRemember?.email && userRemember?.password) {
      emailElement.value = userRemember.email;
      passwordElement.value = userRemember.password;
    }
  }
} catch (error) {
  console.warn("Failed to load remembered user data:", error);
}

// Validate on blur
const inputs = [emailElement, passwordElement];

function showError(input, message) {
  try {
    const warning = input.parentElement.querySelector(".input-warning");
    const textSpan = warning.querySelector(".warning-text");
    textSpan.textContent = message;
    warning.classList.remove("d-none");
    input.classList.add("is-invalid");
  } catch (err) {
    console.error("Error showing input warning:", err);
  }
}

function hideError(input) {
  try {
    const warning = input.parentElement.querySelector(".input-warning");
    warning.classList.add("d-none");
    input.classList.remove("is-invalid");
  } catch (err) {
    console.error("Error hiding input warning:", err);
  }
}

inputs.forEach((input) => {
  input.addEventListener("blur", () => {
    if (input.value.trim() === "") {
      if (input === emailElement) {
        showError(input, "Please enter your Email");
      } else {
        showError(input, "Please enter your Password");
      }
    } else {
      hideError(input);
    }
  });
});

// Login event
loginElement.addEventListener("click", (event) => {
  event.preventDefault();

  try {
    const email = emailElement.value.trim();
    const password = passwordElement.value.trim();

    if (!email || !password) {
      validationText.textContent = "Email and Password are required!";
      return;
    }

    // Handle RememberMe
    try {
      if (rememberElement.checked) {
        localStorage.setItem("rememberMe", true);
        localStorage.setItem("userRemember", JSON.stringify({ email, password }));
      } else {
        localStorage.setItem("rememberMe", false);
        localStorage.removeItem("userRemember");
      }
    } catch (storageErr) {
      console.warn("LocalStorage write failed:", storageErr);
    }

    let usersStorage;
    try {
      usersStorage = JSON.parse(localStorage.getItem("users")) || [];
    } catch (parseErr) {
      console.error("Invalid JSON in localStorage.users:", parseErr);
      validationText.textContent = "Something went wrong. Please try again.";
      return;
    }

    if (!Array.isArray(usersStorage) || usersStorage.length === 0) {
      validationText.textContent = "No registered users found.";
      return;
    }

    const loggedUser = usersStorage.find(
      (user) => user.email === email && user.password === password
    );

    if (loggedUser) {
      const user = {
        id: loggedUser.id,
        userName: loggedUser.username,
        userEmail: loggedUser.email,
      };

      localStorage.setItem("LoggedInUser", JSON.stringify(user));
      window.location.replace("./pages/home.html");
    } else {
      validationText.textContent = "Email or Password is incorrect!";
    }

  } catch (err) {
    console.error("Error during login process:", err);
    validationText.textContent = "Login failed due to a system error.";
  }
});
