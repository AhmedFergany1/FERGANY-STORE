document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  const nameInput = document.getElementById("userName");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  const inputs = [nameInput, emailInput, passwordInput, confirmPasswordInput];

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

  // Validate on blur (live check)
  inputs.forEach((input) => {
    input.addEventListener("blur", () => {
      if (input.value.trim() === "") {
        showError(input, "This field is required");
      } else {
        hideError(input);
      }
    });
  });

  // On form submit
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let valid = true;
    let firstInvalid = null;

    const nameRegex = /^[A-Za-z\s]{2,50}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Name validation
    if (!nameRegex.test(nameInput.value.trim())) {
      showError(nameInput, "Name must contain only letters");
      valid = false;
      firstInvalid ||= nameInput;
    } else {
      hideError(nameInput);
    }

    // Email validation
    let usersNow = JSON.parse(localStorage.getItem("users"));
    let userAlreadyExist;
    if(usersNow){
      userAlreadyExist = usersNow.some((user)=>{
        return emailInput.value.trim() === user.email
      })
    }

    if (!emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, "Invalid email format");
      valid = false;
      firstInvalid ||= emailInput;
    } else if(userAlreadyExist) {
      showError(emailInput, "Email is already exist");
      valid = false;
      firstInvalid ||= emailInput;
    }
    else {
      hideError(emailInput);
    }

    // Password length
    if (passwordInput.value.length < 8) {
      showError(passwordInput, "Password must be at least 8 characters");
      valid = false;
      firstInvalid ||= passwordInput;
    } else {
      hideError(passwordInput);
    }

    // Confirm Password match
    if (confirmPasswordInput.value !== passwordInput.value) {
      showError(confirmPasswordInput, "Password does not match");
      valid = false;
      firstInvalid ||= confirmPasswordInput;
    } else {
      hideError(confirmPasswordInput);
    }

    if (!valid && firstInvalid) {
      firstInvalid.focus(); // Focus first invalid field
    }

    if (valid) {
      let user = {
        username: nameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
        rememberMe: false,
      };

      const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

      user.id = existingUsers.length + 1;

      existingUsers.push(user);

      localStorage.setItem("users", JSON.stringify(existingUsers));

      // const registrationSuccessful = document.querySelector(".registration-successful");
      // registrationSuccessful.style.display = "block"
      // setTimeout(()=> {
      //   registrationSuccessful.style.opacity = 1;
      // },20);

      // const goLogin = document.querySelector(".registration-successful .go-login");
      // goLogin.addEventListener("click", ()=> {
      //   location.replace("../index.html")
      // });

      Swal.fire({
        title: 'Success!',
        text: 'You have successfully signed up.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        form.reset();
        location.replace("../index.html");
      });

      inputs.forEach(hideError);
    }
  });
});
