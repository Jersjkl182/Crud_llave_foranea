// URL base del servidor Flask
const BASE_URL = "http://localhost:5000";

// Función para cargar todos los tipos de energía al cargar la página
async function cargarTiposEnergia() {
    const tabla = document.querySelector("#tabla-tipos-energia tbody");
    tabla.innerHTML = ""; // Limpiar tabla
    const mensajeNoDatos = document.getElementById("mensaje-no-datos");

    try {
        const response = await fetch(`${BASE_URL}/tipo_energia`);
        const data = await response.json();

        if (data.tipo_energia && data.tipo_energia.length > 0) {
            data.tipo_energia.forEach(tipo => {
                const row = `
                    <tr>
                        <td>${tipo.id_tipo_energia}</td>
                        <td>${tipo.tipo}</td>
                        <td>${tipo.nombre_tipo_energia}</td>
                        <td>
                            <button class="btn btn-danger" onclick="eliminarTipoEnergia(${tipo.id_tipo_energia})">Eliminar</button>
                        </td>
                    </tr>
                `;
                tabla.innerHTML += row;
            });
            // Ocultar mensaje "sin registros" si hay datos
            mensajeNoDatos.style.display = "none";
        } else {
            // Mostrar mensaje si no hay registros
            mensajeNoDatos.style.display = "block";
            Swal.fire({
                icon: 'info',
                title: 'Sin registros',
                text: 'No se encontraron registros en la base de datos.',
            });
        }
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al cargar los datos. Intenta nuevamente más tarde.',
        });
    }
}

// Función para eliminar un tipo de energía
async function eliminarTipoEnergia(id_tipo) {
    // Mostrar confirmación antes de eliminar
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción eliminará el tipo de energía de forma permanente.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                // Realizar la solicitud DELETE al servidor
                const response = await fetch(`${BASE_URL}/tipo_energia/${id_tipo}`, {
                    method: "DELETE",
                });

                const data = await response.json();

                // Mostrar mensaje de éxito
                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Eliminado',
                        text: data.mensaje || 'El tipo de energía ha sido eliminado exitosamente.',
                    });
                    // Recargar la tabla después de la eliminación
                    cargarTiposEnergia();
                } else {
                    // Mostrar error si el servidor respondió con algo no esperado
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.mensaje || 'Hubo un error al eliminar el tipo de energía. Intenta nuevamente.',
                    });
                }
            } catch (error) {
                console.error("Error al eliminar los datos:", error);
                // Mostrar mensaje de error en caso de fallo en la conexión
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error al eliminar el tipo de energía. Intenta nuevamente.',
                });
            }
        }
    });
}

// Cargar los tipos de energía automáticamente al abrir la página
document.addEventListener("DOMContentLoaded", cargarTiposEnergia);
