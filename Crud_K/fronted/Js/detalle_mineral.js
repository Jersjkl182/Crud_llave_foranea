// URL base del servidor Flask
const BASE_URL = "http://localhost:5000";

// Obtener el ID del mineral desde la URL
const urlParams = new URLSearchParams(window.location.search);
const idMineral = urlParams.get('id_mineral');

// Función para obtener los detalles de un mineral por su ID
async function obtenerMineral() {
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

        // Verificar que la respuesta fue exitosa
        if (!response.ok) {
            throw new Error("Error al obtener los detalles del mineral.");
        }

        const data = await response.json();

        if (data.mineral) {
            // Si se encontró el mineral, mostrar sus detalles
            const mineral = data.mineral;
            const detallesMineral = `
                <h3>${mineral.nombre}</h3>
                <p><strong>Descripción:</strong> ${mineral.descripcion}</p>
                <p><strong>Ubicación:</strong> ${mineral.ubicacion}</p>
                <p><strong>Proyecto ID:</strong> ${mineral.id_proyecto}</p>
            `;
            document.getElementById("detalles-mineral").innerHTML = detallesMineral;
        } else {
            // Si no se encuentra el mineral
            Swal.fire({
                title: 'Mineral no encontrado',
                text: data.mensaje || 'No se encontraron detalles para este mineral.',
                icon: 'info',
                confirmButtonText: 'Aceptar'
            });
        }
    } catch (error) {
        // Manejo de errores
        console.error("Error al obtener el mineral:", error);
        Swal.fire({
            title: 'Error de conexión',
            text: 'Hubo un problema al intentar obtener los detalles del mineral. Inténtalo nuevamente más tarde.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
}

// Redirigir a la página de edición de ubicación
function habilitarEdicion() {
    const btnEditarUbicacion = document.getElementById('editar-ubicacion-btn');
    if (btnEditarUbicacion) {
        btnEditarUbicacion.addEventListener('click', () => {
            window.location.href = `editar_mineral.html?id_mineral=${idMineral}`;
        });
    }
}

// Cargar los detalles del mineral y habilitar el botón de edición al abrir la página
document.addEventListener("DOMContentLoaded", () => {
    obtenerMineral();
    habilitarEdicion();
});
