const API_URL = "https://script.google.com/macros/s/AKfycbwLkKSDk1z0bV5T33rI8CkLAGj5CZX_wtfaWnQVe6puV4eFl6hDvoqN5ymOtqV2VX4g/exec";
const tableBody = document.getElementById("tableBody");
const form = document.getElementById("studentForm");
const search = document.getElementById("search");
const refresh = document.getElementById("refresh");

async function fetchStudents() {
  const res = await fetch(API_URL);
  const data = await res.json();
  renderTable(data);
}

function renderTable(data) {
  const filter = search.value.toLowerCase();
  const filtered = data.filter(s => s.Name.toLowerCase().includes(filter));
  tableBody.innerHTML = filtered.map(s => {
    const logs = Array.isArray(s["Logs (JSON)"]) ? s["Logs (JSON)"] : [];
    const logRows = logs.length
      ? logs.map(l => `
          <tr class="border-t text-sm text-gray-700">
            <td colspan="4" class="px-6 py-1 pl-10">
              • <strong>${l.reason}</strong> — ${l.hours} hr(s) <span class="text-gray-500 text-xs">(${new Date(l.date).toLocaleDateString()})</span>
            </td>
          </tr>`).join('')
      : `<tr><td colspan="4" class="px-6 py-1 pl-10 text-sm text-gray-500">No logs</td></tr>`;
    
    return `
      <tbody class="group border-b">
        <tr class="hover:bg-gray-50 transition">
          <td class="p-2">${s.Name}</td>
          <td class="p-2">${s.Grade}</td>
          <td class="p-2">${s.TotalHours}</td>
          <td class="p-2 flex gap-2">
            <button onclick='toggleLogs("${s.ID}")' class="bg-gray-400 text-white px-2 py-1 rounded">Logs</button>
            <button onclick='editStudent(${JSON.stringify(s)})' class="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
            <button onclick='deleteStudent("${s.ID}")' class="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
          </td>
        </tr>
        <tr id="logs-${s.ID}" class="hidden bg-gray-50">
          <td colspan="4" class="p-0">${logRows}</td>
        </tr>
      </tbody>`;
  }).join('');
}

function toggleLogs(id) {
  const row = document.getElementById(`logs-${id}`);
  row.classList.toggle("hidden");
}

async function addOrUpdateStudent(e) {
  e.preventDefault();
  const id = document.getElementById("studentId").value;
  const name = document.getElementById("name").value;
  const grade = document.getElementById("grade").value;
  const reason = document.getElementById("reason").value;
  const hours = parseFloat(document.getElementById("hours").value) || 0;

  const student = {
    id, name, grade,
    totalHours: hours,
    logs: reason ? [{ reason, hours, date: new Date().toISOString() }] : []
  };

  const method = id ? "PUT" : "POST";
  await fetch(API_URL, {
    method,
    body: JSON.stringify(student)
  });

  form.reset();
  fetchStudents();
}

async function deleteStudent(id) {
  if (!confirm("Delete this student?")) return;
  await fetch(API_URL, {
    method: "DELETE",
    body: JSON.stringify({ id })
  });
  fetchStudents();
}

function editStudent(s) {
  document.getElementById("studentId").value = s.ID;
  document.getElementById("name").value = s.Name;
  document.getElementById("grade").value = s.Grade;
  document.getElementById("hours").value = s.TotalHours;
}

form.addEventListener("submit", addOrUpdateStudent);
refresh.addEventListener("click", fetchStudents);
search.addEventListener("input", fetchStudents);

fetchStudents();

