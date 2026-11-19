const API_URL = 'https://seven-3-api-rest-js-1.onrender.com/api/students';
const form = document.getElementById('studentForm');
const userList = document.getElementById('userList');
const userCount = document.getElementById('userCount');
const toast = document.getElementById('toast');

// Mostrar notificaciones
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `show ${type}`;
    setTimeout(() => {
        toast.className = '';
    }, 3000);
}

// Obtener y renderizar estudiantes (GET)
async function fetchStudents() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al obtener los datos');
        const students = await response.json();
        renderStudents(students);
    } catch (error) {
        console.error(error);
        userList.innerHTML = `<div class="empty-state">No se pudo conectar con el servidor en ${API_URL}. Verifica que esté encendido y con CORS habilitado.</div>`;
        userCount.textContent = '0 registros';
    }
}

// Dibujar elementos en el DOM
function renderStudents(students) {
    userCount.textContent = `${students.length} ${students.length === 1 ? 'registro' : 'registros'}`;

    if (students.length === 0) {
        userList.innerHTML = `<div class="empty-state">Aún no hay estudiantes registrados. ¡Agrega el primero arriba!</div>`;
        return;
    }

    userList.innerHTML = students.map(student => `
        <div class="user-item">
            <div class="user-info">
                <span class="user-name">${student.firstName} ${student.lastName}</span>
                <span class="user-details">${student.email} • ${student.age} años</span>
            </div>
            <button class="btn-delete" onclick="deleteStudent(${student.id})">Eliminar</button>
        </div>
    `).join('');
}

// Guardar estudiante (POST)
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newStudent = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        age: parseInt(document.getElementById('age').value, 10)
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newStudent)
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo guardar`);
        }

        form.reset();
        showToast('Estudiante guardado correctamente', 'success');
        fetchStudents();
    } catch (error) {
        console.error(error);
        showToast('Error al guardar el estudiante. Revisa la consola.', 'error');
    }
});

// Eliminar estudiante (DELETE)
async function deleteStudent(id) {
    if (!id) {
        showToast('Error: El estudiante no tiene un ID válido', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo eliminar`);
        }

        showToast('Estudiante eliminado', 'success');
        fetchStudents();
    } catch (error) {
        console.error(error);
        showToast('Error al eliminar el estudiante', 'error');
    }
}

// Cargar lista al iniciar la página
document.addEventListener('DOMContentLoaded', fetchStudents);
