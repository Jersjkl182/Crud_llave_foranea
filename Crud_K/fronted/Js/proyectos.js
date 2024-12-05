const BASE_URL = "http://localhost:5000";

// Función para cargar todos los proyectos
async function cargarProyectos() {
    const tabla = document.querySelector("#tabla-proyectos tbody");
    tabla.innerHTML = ""; // Limpiar tabla

    try {
        const response = await fetch(`${BASE_URL}/proyecto`);
        const data = await response.json();

        if (data.proyectos && data.proyectos.length > 0) {
            data.proyectos.forEach(proyecto => {
                const row = `
                    <tr>
                        <td>${proyecto.id_proyecto}</td>
                        <td>${proyecto.nombre}</td>
                        <td>${proyecto.descripcion}</td>
                        <td>${proyecto.ubicacion}</td>
                        <td>${proyecto.fecha_inicio}</td>
                        <td>${proyecto.fecha_fin}</td>
                        <td>${proyecto.tipo_energia.tipo} - ${proyecto.tipo_energia.nombre_tipo_energia}</td>
                        <td>
                            <!-- Botón de Ver Detalles con imagen -->
                            <button class="btn btn-info" onclick="verDetalles(${proyecto.id_proyecto})">
                                <img src="img/vista.png" alt="Ver Detalles" width="20" height="20"> 
                            </button>
                            <!-- Botón de Eliminar con imagen -->
                            <button class="btn btn-danger" onclick="eliminarProyecto(${proyecto.id_proyecto})">
                                <img src="img/eliminar.png" alt="Eliminar Proyecto" width="20" height="20"> 
                            </button>
                        </td>
                    </tr>
                `;
                tabla.innerHTML += row;
            });
        } else {
            Swal.fire({
                title: "No se encontraron proyectos",
                text: "No hay proyectos disponibles en el sistema.",
                icon: "info",
                confirmButtonText: "Aceptar"
            });
        }
    } catch (error) {
        console.error("Error al cargar los proyectos:", error);
        Swal.fire({
            title: "Error",
            text: "Hubo un problema al cargar los proyectos. Intenta de nuevo.",
            icon: "error",
            confirmButtonText: "Aceptar"
        });
    }
}

// Función para redirigir a la página de detalles del proyecto
function verDetalles(id_proyecto) {
    window.location.href = `proyectos_detalles.html?id_proyecto=${id_proyecto}`;
}

// Función para eliminar un proyecto con SweetAlert2
async function eliminarProyecto(id_proyecto) {
    // Mostrar un SweetAlert de confirmación
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        try {
            const response = await fetch(`${BASE_URL}/proyecto/${id_proyecto}`, {
                method: "DELETE"
            });

            const data = await response.json();

            // Si la eliminación es exitosa, mostrar un mensaje de éxito
            if (response.ok && data.mensaje === 'Proyecto eliminado exitosamente') {
                Swal.fire({
                    title: '¡Eliminado!',
                    text: 'El proyecto ha sido eliminado correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    cargarProyectos(); // Recargar la lista de proyectos
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: data.mensaje || 'Hubo un problema al eliminar el proyecto.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        } catch (error) {
            console.error("Error al eliminar el proyecto:", error);
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al eliminar el proyecto. Intenta de nuevo.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    }
}

// Cargar los proyectos automáticamente al abrir la página
document.addEventListener("DOMContentLoaded", cargarProyectos);

