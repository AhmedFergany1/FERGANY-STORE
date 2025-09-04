export function getLoggedUser() {
  const userData = localStorage.getItem("LoggedInUser");
  return userData ? JSON.parse(userData) : null;
}

export function logOut() {
  localStorage.removeItem("LoggedInUser");
  window.location.href = "../index.html";
}