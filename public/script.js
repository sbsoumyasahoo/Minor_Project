const API_URL = "http://localhost:3000/students";

// Show alert messages
function showAlert(message, type = "success") {
  const alertDiv = document.getElementById("alertMsg");
  alertDiv.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  </div>`;
}

// Load all students
async function loadStudents() {
  const res = await fetch(API_URL);
  const students = await res.json();

  const tableBody = document.getElementById("studentTable");
  tableBody.innerHTML = "";

  students.forEach((s) => {
  tableBody.innerHTML += `
    <tr id="row-${s._id}">
      <td>${s.name}</td>
      <td>${s.email}</td>
      <td>${s.course}</td>
      <td>
        <button class="btn btn-warning btn-sm me-2" onclick="editStudent('${s._id}', '${s.name}', '${s.email}', '${s.course}')">
          <i class="bi bi-pencil"></i> Edit
        </button>
        <button class="btn btn-danger btn-sm" onclick="deleteStudent('${s._id}')">
          <i class="bi bi-trash"></i> Delete
        </button>
      </td>
    </tr>
  `;
});

}

// Add or update student
document.getElementById("studentForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("studentId").value;
  const student = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    course: document.getElementById("course").value,
  };

  try {
    if (id) {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
      });
      showAlert("Student updated successfully!", "info");
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
      });
      showAlert("Student added successfully!", "success");
    }
  } catch (err) {
    showAlert("Error! Try again.", "danger");
  }

  // Reset form
  document.getElementById("studentForm").reset();
  document.getElementById("studentId").value = "";
  loadStudents();
});

// Edit student
function editStudent(id, name, email, course) {
  document.getElementById("studentId").value = id;
  document.getElementById("name").value = name;
  document.getElementById("email").value = email;
  document.getElementById("course").value = course;

  // Highlight row being edited
  document.querySelectorAll("#studentTable tr").forEach(r => r.classList.remove("editing"));
  document.getElementById(`row-${id}`).classList.add("editing");
}

// Delete student
async function deleteStudent(id) {
  if (!confirm("Are you sure you want to delete this student?")) return;

  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  showAlert("Student deleted successfully!", "warning");
  loadStudents();

function showAlert(message, type="success") {
  document.getElementById("alertMsg").innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
}


}

// Search students
function searchStudents() {
  const input = document.getElementById("search").value.toLowerCase();
  const table = document.getElementById("studentTable");
  Array.from(table.rows).forEach(row => {
    const name = row.cells[0].innerText.toLowerCase();
    const email = row.cells[1].innerText.toLowerCase();
    row.style.display = (name.includes(input) || email.includes(input)) ? "" : "none";
  });
}

// Initial load
loadStudents();
