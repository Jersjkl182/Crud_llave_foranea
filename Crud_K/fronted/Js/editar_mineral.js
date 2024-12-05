// URL base del servidor Flask
const BASE_URL = "http://localhost:5000";

// Obtener el ID del mineral desde la URL
const urlParams = new URLSearchParams(window.location.search);
const idMineral = urlParams.get('id_mineral');

// Función para cargar los datos del mineral
async function cargarDatosMineral() {
    if (!idMineral) {
        Swal.fire({
            title: 'Error',
            text: 'No se proporcionó un ID de mineral.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/minerales/${idMineral}`);
        if (!response.ok) {
            throw new Error("Error al obtener los detalles del mineral.");
        }

        const data = await response.json();

        if (data.mineral) {
            // Cargar datos en los campos del formulario
            const mineral = data.mineral;
            document.getElementById("nombre").value = mineral.nombre;
            document.getElementById("descripcion").value = mineral.descripcion;
            document.getElementById("ubicacion").value = mineral.ubicacion;
            document.getElementById("proyecto").value = mineral.id_proyecto;

            // Actualizar el enlace para volver a los detalles
            const volverDetallesBtn = document.getElementById("volver-detalles-btn");
            if (volverDetallesBtn) {
                volverDetallesBtn.href = `detalle_mineral.html?id_mineral=${idMineral}`;
            }
        } else {
            Swal.fire({
                title: 'Mineral no encontrado',
                text: data.mensaje || 'No se encontraron detalles para este mineral.',
                icon: 'info',
                confirmButtonText: 'Aceptar'
            });
        }
    } catch (error) {
        console.error("Error al cargar el mineral:", error);
        Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al intentar cargar los datos del mineral.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
}

// Función para actualizar la ubicación del mineral
async function actualizarUbicacion(event) {
    event.preventDefault(); // Evitar el envío tradicional del formulario

    const nuevaUbicacion = document.getElementById("ubicacion").value;
    if (!nuevaUbicacion) {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Por favor ingresa una nueva ubicación.',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/minerales/${idMineral}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ ubicacion: nuevaUbicacion })
        });

        const result = await response.json();

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Actualización Exitosa',
                text: result.mensaje || 'La ubicación se ha actualizado correctamente.',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                window.location.href = `detalle_mineral.html?id_mineral=${idMineral}`;
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: result.mensaje || 'Hubo un problema al actualizar la ubicación.',
                confirmButtonText: 'Intentar nuevamente'
            });
        }
    } catch (error) {
        console.error("Error al actualizar la ubicación:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al intentar actualizar la ubicación.',
            confirmButtonText: 'Intentar nuevamente'
        });
    }
}

// Cargar los datos del mineral al iniciar la página
document.addEventListener("DOMContentLoaded", cargarDatosMineral);

// Asignar el evento de actualización de ubicación al formulario
document.getElementById("form-actualizar-ubicacion").addEventListener("submit", actualizarUbicacion);
