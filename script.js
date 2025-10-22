// script.js

// === CONFIG ===
const API_URL = "https://script.google.com/macros/s/AKfycbwLkKSDk1z0bV5T33rI8CkLAGj5CZX_wtfaWnQVe6puV4eFl6hDvoqN5ymOtqV2VX4g/exec"; // Example: https://script.google.com/macros/s/AKfycbx.../exec

// === API FUNCTIONS ===

// Get all student data
async function getAllStudents() {
  const res = await fetch(API_URL);
  return res.json();
}

// Add a new student
async function addStudent(name, grade, hours, notes) {
  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ action: "add", name, grade, hours, notes }),
    headers: { "Content-Type": "application/json" },
  });
  return res.text();
}

// Update a student
async function updateStudent(id, name, grade, hours, notes) {
  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ action: "update", id, name, grade, hours, notes }),
    headers: { "Content-Type": "application/json" },
  });
  return res.text();
}

// Delete a student
async function deleteStudent(id) {
  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ action: "delete", id }),
    headers: { "Content-Type": "application/json" },
  });
  return res.text();
}

// === PAGE LOGIC ===
document.addEventListener("DOMContentLoaded", async () => {
  if (document.getElementById("studentTable")) {
    const students = await getAllStudents();
    const table = document.getElementById("studentTable");
    table.innerHTML = `
      <tr><th>ID</th><th>Name</th><th>Grade</th><th>Hours</th><th>Notes</th><th>Actions</th></tr>
    `;
    students.forEach(s => {
      table.innerHTML += `
        <tr>
          <td>${s.id}</td>
          <td>${s.name}</td>
          <td>${s.grade}</td>
          <td>${s.hours}</td>
          <td>${s.notes}</td>
          <td>
            <a href="edit-profile.html?id=${s.id}">Edit</a>
          </td>
        </tr>
      `;
    });
  }

  const form = document.getElementById("addForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const grade = document.getElementById("grade").value;
      const hours = document.getElementById("hours").value;
      const notes = document.getElementById("notes").value;
      const result = await addStudent(name, grade, hours, notes);
      alert(result);
      window.location.href = "index.html";
    });
  }

  const editForm = document.getElementById("editForm");
  if (editForm) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    const students = await getAllStudents();
    const student = students.find(s => s.id == id);
    if (student) {
      document.getElementById("name").value = student.name;
      document.getElementById("grade").value = student.grade;
      document.getElementById("hours").value = student.hours;
      document.getElementById("notes").value = student.notes;
    }

    editForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const grade = document.getElementById("grade").value;
      const hours = document.getElementById("hours").value;
      const notes = document.getElementById("notes").value;
      const result = await updateStudent(id, name, grade, hours, notes);
      alert(result);
      window.location.href = "index.html";
    });

    document.getElementById("deleteBtn").addEventListener("click", async () => {
      if (confirm("Are you sure you want to delete this record?")) {
        const result = await deleteStudent(id);
        alert(result);
        window.location.href = "index.html";
      }
    });
  }
});

