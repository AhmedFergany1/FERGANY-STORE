document.addEventListener("DOMContentLoaded", function () {
  try {
    const form = document.querySelector("form");

    if (!form) {
      throw new Error("Form element not found.");
    }

    const nameInput = document.getElementById("userName");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    const inputs = [nameInput, emailInput, passwordInput, confirmPasswordInput];

    if (inputs.some(input => !input)) {
      throw new Error("One or more input elements are missing.");
    }

    let warning;
    function styleWarningInput(input) {
      warning = input.parentElement.querySelector(".input-warning");
      if (warning) {
        warning.classList.remove("d-none");
      }
      input.classList.add("is-invalid");
    }

    // Helper: hide warning and remove red border
    function hideError(input) {
      warning = input.parentElement.querySelector(".input-warning");
      if (warning) {
        warning.classList.add("d-none");
      }
      input.classList.remove("is-invalid");
    }

    // Validate on blur (live check)
    inputs.forEach((input) => {
      input.addEventListener("blur", () => {
        try {
          checkIfInputIsEmpty(input);
        } catch (err) {
          console.error("Error during blur validation:", err);
        }
      });
    });

    function checkIfInputIsEmpty(input) {
      if (input === nameInput || input === emailInput) {
        if (input.value.trim() === "") {
          styleWarningInput(input);
          return true;
        } else {
          hideError(input);
        }
      } else {
        if (input.value === "") {
          styleWarningInput(input);
          return true;
        } else {
          hideError(input);
        }
      }
      return false;
    }

    // Helper: show warning with icon, text, border
    function showError(message, input) {
      const allRequiredTxt = document.querySelector(".all-required-txt");
      if (allRequiredTxt) {
        allRequiredTxt.textContent = message;
        allRequiredTxt.style.display = "block";
      } else {
        console.warn("Warning element .all-required-txt not found");
      }
      if (input) styleWarningInput(input);
    }

    function checkEmailExist(emailValue) {
      try {
        let usersNow = JSON.parse(localStorage.getItem("users"));
        if (usersNow) return usersNow.some((user) => emailValue === user.email);
        return false;
      } catch (err) {
        console.error("Error reading users from localStorage:", err);
        return false;
      }
    }

    // On form submit
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      try {
        let valid = true;

        const nameRegex = /^[A-Za-z\s]{3,50}$/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

        inputs.forEach((input) => {
          if (checkIfInputIsEmpty(input)) {
            valid = false;
          }
        });
        if (!valid) {
          showError("All fields are required!");
          return;
        }

        // Name Validation
        if (!nameRegex.test(nameInput.value.trim())) {
          showError("Name must be letters only, and contain at least 3 letters", nameInput);
          nameInput.focus();
          return;
        } else {
          hideError(nameInput);
        }

        // Email validation
        if (!emailRegex.test(emailInput.value.trim())) {
          showError("Invalid email format", emailInput);
          emailInput.focus();
          return;
        } else if (checkEmailExist(emailInput.value.trim())) {
          showError("Email already exists", emailInput);
          emailInput.focus();
          return;
        } else {
          hideError(emailInput);
        }

        // Password validation
        if (!passwordRegex.test(passwordInput.value)) {
          showError(
            "Password must be at least 8 characters, and contain at least one lowercase, one uppercase letter, and one digit",
            passwordInput
          );
          passwordInput.focus();
          return;
        } else {
          hideError(passwordInput);
        }

        // Confirm Password match
        if (confirmPasswordInput.value !== passwordInput.value) {
          showError("Password does not match", confirmPasswordInput);
          confirmPasswordInput.focus();
          return;
        } else {
          hideError(confirmPasswordInput);
        }

        inputs.forEach(hideError);

        let user = {
          username: nameInput.value.trim(),
          email: emailInput.value.trim(),
          password: passwordInput.value,
          rememberMe: false,
        };

        let existingUsers = [];
        try {
          existingUsers = JSON.parse(localStorage.getItem("users")) || [];
        } catch (err) {
          console.error("Failed to parse users from localStorage:", err);
          existingUsers = [];
        }

        user.id = existingUsers.length + 1;

        existingUsers.push(user);

        try {
          localStorage.setItem("users", JSON.stringify(existingUsers));
        } catch (err) {
          console.error("Failed to save users to localStorage:", err);
          showError("An error occurred while saving user data.");
          return;
        }

        Swal.fire({
          title: "Success!",
          html: `Thank you, <span style="color: #7066e0">${user.username}!</span> You have successfully signed up.`,
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          form.reset();
          location.replace("../index.html");
        });
      } catch (submitErr) {
        console.error("Error during form submission:", submitErr);
        showError("An unexpected error occurred. Please try again later.");
      }
    });
  } catch (err) {
    console.error("Error initializing form:", err);
  }
});
