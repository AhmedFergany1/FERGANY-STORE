const contactNameInp = document.querySelector(".contact-name-inp");
const contactMailInp = document.querySelector(".contact-mail-inp");
const contactMessageInp = document.querySelector(".contact-message-inp");
const contactSubmitBtn = document.querySelector(".contact-submit-btn");

export function initContactUs() {
  try {
    // Check all required elements are present
    if (!contactNameInp || !contactMailInp || !contactMessageInp || !contactSubmitBtn) {
      console.warn("One or more contact form elements are missing.");
      return;
    }

    contactSubmitBtn.addEventListener("click", (event) => {
      try {
        event.preventDefault();

        const name = contactNameInp.value.trim();
        const email = contactMailInp.value.trim();
        const message = contactMessageInp.value.trim();

        // --- Name Validation ---
        if (name === "") {
          showAlert("Name Required", "Please enter your name to send a message.");
          return;
        }

        const nameRegex = /^[A-Za-z\s]{3,50}$/;
        if (!nameRegex.test(name)) {
          showAlert("Name Not Valid", "Must contain only letters and be at least 3 characters.");
          return;
        }

        // --- Email Validation ---
        if (email === "") {
          showAlert("Email Required", "Please enter your email to send a message.");
          return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
          showAlert("Email Not Valid", "Please check your email format.");
          return;
        }

        // --- Message Validation ---
        if (message === "") {
          showAlert("Message Required", "Please enter your message to send.");
          return;
        }

        // --- Success ---
        showSuccess(`Thank you, <span style="color: #7066e0">${escapeHtml(name)}!</span> We'll reply to you shortly.`);

        // Reset inputs
        contactNameInp.value = "";
        contactMailInp.value = "";
        contactMessageInp.value = "";

      } catch (err) {
        console.error("Error handling contact form submission:", err);
        alert("Something went wrong. Please try again later.");
      }
    });

  } catch (error) {
    console.error("Failed to initialize contact form:", error);
  }
}


function showAlert(title, text) {
  if (typeof Swal !== "undefined") {
    Swal.fire({ title, text, icon: "warning", confirmButtonText: "OK" });
  } else {
    alert(`${title}: ${text}`);
  }
}


function showSuccess(htmlMessage) {
  if (typeof Swal !== "undefined") {
    Swal.fire({
      title: "Success!",
      html: htmlMessage,
      icon: "success",
      confirmButtonText: "OK",
    });
  } else {
    alert("Message sent successfully.");
  }
}

// Prevent XSS via user input in SweetAlert HTML
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (match) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return map[match];
  });
}
