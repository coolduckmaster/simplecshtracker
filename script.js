// Replace with your deployed Google Apps Script URL
const SHEET_API = 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE';

// Elements
const addForm = document.getElementById('add-form');
const editForm = document.getElementById('edit-form');
const cancelEditBtn = document.getElementById('cancel-edit');
const refreshBtn = document.getElementById('refresh-btn');
const tableBody = document.querySelector('#students-table tbody');

// Tab Switching
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    tabContents.forEach(tab => tab.classList.remove('active'));
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
  });
});

// Load Data
async function loadStudents() {
  const res = await fetch(SHEET_API);
  const data = await res.json();
  tableBody.innerHTML = '';
  data.forEach(student => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${student.name}</td>
      <td>${student.grade}</td>
      <td>${student.hours}</td>
      <td>${student.notes}</td>
      <td>
        <button onclick="editStudent('${student.id}')">✏️</button>
        <button onclick="deleteStudent('${student.id}')">🗑️</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

// Refresh Button
refreshBtn.addEventListener('click', async () => {
  refreshBtn.textContent = '⏳ Refreshing...';
  await loadStudents();
  refreshBtn.textContent = '🔄 Refresh';
});

// Add Student
addForm.addEventListener('submit', async e => {
  e.preventDefault();
  const payload = {
    action: 'add',
    name: document.getElementById('add-name').value,
    grade: document.getElementById('add-grade').value,
    hours: document.getElementById('add-hours').value,
    notes: document.getElementById('add-notes').value
  };
  await fetch(SHEET_API, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  addForm.reset();
  loadStudents();
});

// Delete Student
async function deleteStudent(id) {
  await fetch(SHEET_API, {
    method: 'POST',
    body: JSON.stringify({ action: 'delete', id })
  });
  loadStudents();
}

// Edit Student
async function editStudent(id) {
  const res = await fetch(SHEET_API);
  const data = await res.json();
  const s = data.find(stu => stu.id == id);
  if (!s) return;

  document.getElementById('edit-id').value = s.id;
  document.getElementById('edit-name').value = s.name;
  document.getElementById('edit-grade').value = s.grade;
  document.getElementById('edit-hours').value = s.hours;
  document.getElementById('edit-notes').value = s.notes;

  editForm.classList.remove('hidden');
  document.querySelector('#tab-manage').scrollIntoView({ behavior: 'smooth' });
}

// Update Student
editForm.addEventListener('submit', async e => {
  e.preventDefault();
  const payload = {
    action: 'update',
    id: document.getElementById('edit-id').value,
    name: document.getElementById('edit-name').value,
    grade: document.getElementById('edit-grade').value,
    hours: document.getElementById('edit-hours').value,
    notes: document.getElementById('edit-notes').value
  };
  await fetch(SHEET_API, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  editForm.classList.add('hidden');
  loadStudents();
});

// Cancel Edit
cancelEditBtn.addEventListener('click', () => {
  editForm.classList.add('hidden');
});

loadStudents();

