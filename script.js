const SHEET_API = 'https://script.google.com/macros/s/AKfycbwLkKSDk1z0bV5T33rI8CkLAGj5CZX_wtfaWnQVe6puV4eFl6hDvoqN5ymOtqV2VX4g/exec';

const tableBody = document.querySelector('#students-table tbody');
const form = document.querySelector('#student-form');

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

async function deleteStudent(id) {
  await fetch(SHEET_API, {
    method: 'POST',
    body: JSON.stringify({ action: 'delete', id })
  });
  loadStudents();
}

async function editStudent(id) {
  const res = await fetch(SHEET_API);
  const data = await res.json();
  const s = data.find(stu => stu.id == id);
  document.querySelector('#student-id').value = s.id;
  document.querySelector('#name').value = s.name;
  document.querySelector('#grade').value = s.grade;
  document.querySelector('#hours').value = s.hours;
  document.querySelector('#notes').value = s.notes;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.querySelector('#student-id').value;
  const name = document.querySelector('#name').value;
  const grade = document.querySelector('#grade').value;
  const hours = document.querySelector('#hours').value;
  const notes = document.querySelector('#notes').value;

  const action = id ? 'update' : 'add';
  const payload = { action, id, name, grade, hours, notes };

  await fetch(SHEET_API, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  form.reset();
  loadStudents();
});

loadStudents();
