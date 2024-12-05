// URL base del servidor Flask
const BASE_URL = "http://localhost:5000";

// Función para cargar los tipos de energía al cargar la página
async function cargarTiposEnergia() {
    const select = document.getElementById("tipo_energia");

    try {
        const response = await fetch(`${BASE_URL}/tipo_energia`);
        const data = await response.json();

        if (data.tipo_energia && data.tipo_energia.length > 0) {
            data.tipo_energia.forEach(tipo => {
                const option = document.createElement("option");
                option.value = tipo.id_tipo_energia;
                option.textContent = `${tipo.tipo} - ${tipo.nombre_tipo_energia}`;
                select.appendChild(option);
            });
        } else {
            Swal.fire({
                title: 'Sin registros',
                text: 'No se encontraron tipos de energía. Por favor, registra algunos primero.',
                icon: 'info',
                confirmButtonText: 'Aceptar'
            });
        }
    } catch (error) {
        console.error("Error al cargar los tipos de energía:", error);
        Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al cargar los tipos de energía. Intenta nuevamente.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
}

// Función para enviar los datos del formulario
async function registrarProyecto(event) {
    event.preventDefault(); // Evitar que el formulario se envíe de forma predeterminada

    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const ubicacion = document.getElementById("ubicacion").value;
    const fecha_inicio = document.getElementById("fecha_inicio").value;
    const fecha_fin = document.getElementById("fecha_fin").value;
    const id_tipo_energia = document.getElementById("tipo_energia").value;

    // Validación de campos vacíos
    if (!nombre || !descripcion || !ubicacion || !fecha_inicio || !fecha_fin || !id_tipo_energia) {
        Swal.fire({
            title: 'Advertencia',
            text: 'Por favor, completa todos los campos.',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    // Crear objeto para el nuevo proyecto
    const nuevoProyecto = {
        nombre: nombre,
        descripcion: descripcion,
        ubicacion: ubicacion,
        fecha_inicio: fecha_inicio,
        fecha_fin: fecha_fin,
        id_tipo_energia: id_tipo_energia
    };

    try {
        // Enviar los datos al servidor Flask
        const response = await fetch(`${BASE_URL}/proyecto`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevoProyecto)
        });

        const data = await response.json();

        if (response.ok) {
            // Mostrar SweetAlert con mensaje de éxito
            Swal.fire({
                title: '¡Registro exitoso!',
                text: 'Tu proyecto se ha registrado correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                location.reload(); // Recargar la página
            });
        } else {
            // Mostrar SweetAlert en caso de error
            Swal.fire({
                title: 'Error',
                text: data.mensaje || 'Hubo un problema al registrar el proyecto.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    } catch (error) {
        console.error("Error al registrar el proyecto:", error);
        // Mostrar SweetAlert en caso de error de red
        Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al registrar el proyecto. Intenta nuevamente.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
}

// Cargar los tipos de energía y agregar el evento al formulario
document.addEventListener("DOMContentLoaded", () => {
    cargarTiposEnergia();
    const formulario = document.getElementById("formulario-proyecto");
    formulario.addEventListener("submit", registrarProyecto);
});

