// script.js

// === CONFIG ===
const API_URL = "PASTE_YOUR_WEB_APP_URL_HERE";
const API_KEY = "CHANGE_THIS_TO_SAME_KEY_AS_SCRIPT";

// === GENERIC FUNCTIONS ===

// Fetch all data from a sheet
async function fetchSheet(sheetName) {
  const res = await fetch(`${API_URL}?sheet=${sheetName}&key=${API_KEY}`);
  return res.json();
}

// Add a student profile
async function addStudent(name, grade) {
  const res = await fetch(`${API_URL}?sheet=Students&name=${encodeURIComponent(name)}&grade=${encodeURIComponent(grade)}&key=${API_KEY}`);
  return res.json();
}

// Add a CSH record
async function addCSH(studentId, hours, date, reason) {
  const res = await fetch(`${API_URL}?sheet=CSH&studentId=${encodeURIComponent(studentId)}&hours=${encodeURIComponent(hours)}&date=${encodeURIComponent(date)}&reason=${encodeURIComponent(reason)}&key=${API_KEY}`);
  return res.json();
}

// === PAGE-SPECIFIC LOGIC ===

// For index.html (search)
function setupSearchPage() {
  const searchBtn = document.getElementById("searchBtn");
  if (!searchBtn) return; // Exit if we're not on the search page

  searchBtn.addEventListener("click", async () => {
    const name = document.getElementById("searchName").value.toLowerCase();
    const data = await fetchSheet("Students");

    const results = data.filter(s => s.Name.toLowerCase().includes(name));
    const ul = document.getElementById("results");
    ul.innerHTML = "";
    results.forEach(r => ul.innerHTML += `<li>${r.Name} (Grade: ${r.Grade})</li>`);
  });
}

// For add-profile.html
function setupAddProfilePage() {
  const form = document.getElementById("profileForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const grade = document.getElementById("grade").value;

    const result = await addStudent(name, grade);
    if (result.success) {
      alert("Profile added!");
      window.location.href = "index.html";
    } else {
      alert("Error: " + (result.error || "Unknown"));
    }
  });
}

// For add-csh.html
function setupAddCSHPage() {
  const form = document.getElementById("cshForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const studentId = document.getElementById("studentId").value;
    const hours = document.getElementById("hours").value;
    const date = document.getElementById("date").value;
    const reason = document.getElementById("reason").value;

    const result = await addCSH(studentId, hours, date, reason);
    if (result.success) {
      alert("CSH entry added!");
      window.location.href = "index.html";
    } else {
      alert("Error: " + (result.error || "Unknown"));
    }
  });
}

// === Initialize appropriate page ===
document.addEventListener("DOMContentLoaded", () => {
  setupSearchPage();
  setupAddProfilePage();
  setupAddCSHPage();
});
