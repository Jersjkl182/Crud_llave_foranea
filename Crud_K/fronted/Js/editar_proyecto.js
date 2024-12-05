// URL base del servidor Flask
const BASE_URL = "http://localhost:5000";

// Obtener el ID del proyecto desde la URL
function obtenerIdProyecto() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id_proyecto");
}

// Función para cargar los datos del proyecto en el formulario de edición
async function cargarDatosFormulario() {
    const id_proyecto = obtenerIdProyecto();  // Obtener el ID del proyecto desde la URL
    if (!id_proyecto) {
        Swal.fire({
            title: 'Error',
            text: 'ID del proyecto no especificado.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            window.location.href = "proyectos.html"; // Redirigir si no hay ID
        });
        return;
    }

    try {
        // Realizar la solicitud al servidor para obtener los datos del proyecto
        const response = await fetch(`${BASE_URL}/proyecto/${id_proyecto}`);
        if (!response.ok) {
            throw new Error("Error al obtener los detalles del proyecto.");
        }

        const data = await response.json();

        if (data.proyecto) {
            const proyecto = data.proyecto;

            // Rellenar el formulario con los datos del proyecto
            document.getElementById("nombre").value = proyecto.nombre;
            document.getElementById("descripcion").value = proyecto.descripcion;
            document.getElementById("ubicacion").value = proyecto.ubicacion;
            document.getElementById("fecha_inicio").value = proyecto.fecha_inicio;
            document.getElementById("fecha_fin").value = proyecto.fecha_fin;

            // Cargar los tipos de energía
            const tipoEnergiaSelect = document.getElementById("tipo_energia");
            tipoEnergiaSelect.innerHTML = `
                <option value="${proyecto.tipo_energia.tipo}">${proyecto.tipo_energia.nombre_tipo_energia}</option>
            `;
        } else {
            Swal.fire({
                title: 'Proyecto no encontrado',
                text: 'No se encontró el proyecto solicitado.',
                icon: 'info',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                window.location.href = "proyectos.html";  // Redirigir si no se encuentra el proyecto
            });
        }
    } catch (error) {
        console.error("Error al cargar los datos del proyecto:", error);
        Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al cargar los datos del proyecto.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            window.location.href = "proyectos.html";  // Redirigir si ocurre un error
        });
    }
}

// Función para guardar los cambios del proyecto
async function guardarCambios(event) {
    event.preventDefault(); // Evitar el comportamiento por defecto del formulario

    const id_proyecto = obtenerIdProyecto();
    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const ubicacion = document.getElementById("ubicacion").value;
    const fecha_inicio = document.getElementById("fecha_inicio").value;
    const fecha_fin = document.getElementById("fecha_fin").value;
    const tipo_energia = document.getElementById("tipo_energia").value;

    // Validación básica de datos
    if (!nombre || !descripcion || !ubicacion || !fecha_inicio || !fecha_fin || !tipo_energia) {
        Swal.fire({
            title: 'Faltan campos',
            text: 'Por favor, complete todos los campos del formulario.',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    const datosProyecto = {
        nombre: nombre,
        descripcion: descripcion,
        ubicacion: ubicacion,
        fecha_inicio: fecha_inicio,
        fecha_fin: fecha_fin,
        id_tipo_energia: tipo_energia
    };

    try {
        const response = await fetch(`${BASE_URL}/proyecto/${id_proyecto}`, {
            method: 'PUT', // Usamos PUT para actualizar el proyecto
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosProyecto)
        });

        const data = await response.json();

        if (response.ok) {
            // Si la respuesta es positiva, mostramos un SweetAlert2
            Swal.fire({
                title: '¡Éxito!',
                text: 'Los cambios se han guardado correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                // Redirigir al usuario después de confirmar el mensaje
                window.location.href = "proyectos.html";  // O la página que desees
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: data.mensaje || 'No se pudo guardar los cambios. Intenta de nuevo.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    } catch (error) {
        console.error("Error al guardar los cambios:", error);
        Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al guardar los cambios. Intenta de nuevo.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
}

// Cargar los datos del proyecto automáticamente cuando se abre la página
document.addEventListener("DOMContentLoaded", cargarDatosFormulario);

// Escuchar el evento del formulario para guardar los cambios
document.getElementById("form-editar-proyecto").addEventListener("submit", guardarCambios);

