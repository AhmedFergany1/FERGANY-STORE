export function getLoggedUser() {
  try {
    const userData = localStorage.getItem("LoggedInUser");

    if (!userData) {
      return null;
    }

    try {
      return JSON.parse(userData);
    } catch (jsonError) {
      console.error("Failed to parse logged-in user JSON:", jsonError.message);

      localStorage.removeItem("LoggedInUser");
      return null;
    }

  } catch (error) {
    console.error("Failed to access localStorage for LoggedInUser:", error.message);
    return null;
  }
}

export function logOut() {
  try {
    localStorage.removeItem("LoggedInUser");
  } catch (error) {
    console.error("Failed to remove LoggedInUser from localStorage:", error.message);
  }

  try {
    window.location.href = "../index.html";
  } catch (error) {
    console.error("Failed to redirect to login page:", error.message);
  }
}
