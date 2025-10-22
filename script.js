const API_URL = "https://script.google.com/macros/s/AKfycbwLkKSDk1z0bV5T33rI8CkLAGj5CZX_wtfaWnQVe6puV4eFl6hDvoqN5ymOtqV2VX4g/exec";

// ---------- Fetch Students ----------
async function fetchStudents() {
  const res = await fetch(API_URL);
  const data = await res.json();
  return data;
}

// ---------- Add Student ----------
async function addStudent(student) {
  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(student)
  });
  return res.json();
}

// ---------- Update Student ----------
async function updateStudent(student) {
  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(student)
  });
  return res.json();
}

// ---------- Delete Student ----------
async function deleteStudent(id) {
  if (!confirm("Are you sure you want to delete this student?")) return;
  const res = await fetch(API_URL, {
    method: "DELETE",
    body: JSON.stringify({ id })
  });
  alert("Student deleted!");
  loadStudents();
  return res.json();
}

// ---------- Render Table ----------
function renderTable(students) {
  const tbody = document.getElementById("tableBody");
  if(!tbody) return; // for add/edit pages
  tbody.innerHTML = "";
  students.forEach(s => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="p-2">${s.Name}</td>
      <td class="p-2">${s.Grade}</td>
      <td class="p-2">${s.TotalHours || 0}</td>
      <td class="p-2 space-x-2">
        <a href="edit.html?id=${s.ID}" class="text-blue-500 hover:underline">Edit</a>
        <button onclick="deleteStudent('${s.ID}')" class="text-red-500 hover:underline">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ---------- Load Students for Index Page ----------
async function loadStudents() {
  const students = await fetchStudents();
  renderTable(students);
}

// ---------- Add Page Form Handling ----------
function initAddForm() {
  const addForm = document.getElementById("addForm");
  if(!addForm) return;

  addForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const student = {
      name: document.getElementById("name").value,
      grade: document.getElementById("grade").value,
      logs: []
    };
    const reason = document.getElementById("reason").value;
    const hours = parseFloat(document.getElementById("hours").value);
    if(reason && hours) {
      student.logs.push({ reason, hours, date: new Date().toISOString() });
      student.totalHours = hours;
    } else {
      student.totalHours = 0;
    }
    await addStudent(student);
    alert("Student added!");
    window.location.href = "index.html";
  });
}

// ---------- Edit Page Form Handling ----------
function initEditForm() {
  const editForm = document.getElementById("editForm");
  if(!editForm) return;

  const urlParams = new URLSearchParams(window.location.search);
  const studentId = urlParams.get("id");

  async function loadStudent() {
    const students = await fetchStudents();
    const student = students.find(s => s.ID == studentId);
    if(!student) return alert("Student not found");

    document.getElementById("studentId").value = student.ID;
    document.getElementById("name").value = student.Name;
    document.getElementById("grade").value = student.Grade;
  }

  loadStudent();

  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const student = {
      id: studentId,
      name: document.getElementById("name").value,
      grade: document.getElementById("grade").value,
      logs: []
    };
    const reason = document.getElementById("reason").value;
    const hours = parseFloat(document.getElementById("hours").value);
    if(reason && hours) {
      student.logs.push({ reason, hours, date: new Date().toISOString() });
      student.totalHours = hours;
    }
    await updateStudent(student);
    alert("Student updated!");
    window.location.href = "index.html";
  });
}

// ---------- Initialize everything ----------
document.addEventListener("DOMContentLoaded", () => {
  loadStudents();
  initAddForm();
  initEditForm();

  const refreshBtn = document.getElementById("refresh");
  if(refreshBtn) {
    refreshBtn.addEventListener("click", loadStudents);
  }

  const searchInput = document.getElementById("search");
  if(searchInput) {
    searchInput.addEventListener("input", async (e) => {
      const query = e.target.value.toLowerCase();
      const students = await fetchStudents();
      const filtered = students.filter(s => s.Name.toLowerCase().includes(query));
      renderTable(filtered);
    });
  }
});
