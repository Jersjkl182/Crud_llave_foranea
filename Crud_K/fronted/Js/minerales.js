const BASE_URL = "http://localhost:5000";

// Función para cargar todos los minerales
async function cargarMinerales() {
    const tabla = document.getElementById("tabla-minerales");
    tabla.innerHTML = ""; // Limpiar la tabla antes de agregar datos nuevos

    try {
        const response = await fetch(`${BASE_URL}/minerales`);
        const data = await response.json();

        if (response.ok) {
            if (data.minerales.length > 0) {
                // Si hay minerales, los mostramos
                data.minerales.forEach(mineral => {
                    const row = crearFilaMineral(mineral);
                    tabla.innerHTML += row;
                });
            } else {
                // Si no hay minerales, mostramos un mensaje informativo
                tabla.innerHTML = "<tr><td colspan='5' class='text-center'>No se encontraron minerales.</td></tr>";
            }
        } else {
            Swal.fire('Sin Datos', 'No se pudieron cargar los minerales. Intente nuevamente.', 'info');
        }
    } catch (error) {
        console.error("Error al cargar minerales:", error);
        Swal.fire('Error', 'Hubo un problema al cargar los minerales.', 'error');
    }
}

// Función para crear una fila de mineral
function crearFilaMineral(mineral) {
    return `
        <tr>
            <td>${mineral.id_mineral}</td>
            <td>${mineral.nombre}</td>
            <td>${mineral.descripcion}</td>
            <td>${mineral.ubicacion}</td>
            <td>
                <!-- Botón de ver detalles con imagen -->
                <button class="btn btn-info btn-sm" onclick="verDetalles(${mineral.id_mineral})">
                    <img src="img/vista.png" alt="Ver Detalles" width="20" height="20"> 
                </button>
                <!-- Botón de eliminar con imagen -->
                <button class="btn btn-danger btn-sm" onclick="eliminarMineral(${mineral.id_mineral})">
                    <img src="img/eliminar.png" alt="Eliminar" width="20" height="20"> 
                </button>
            </td>
        </tr>
    `;
}

// Función para ver detalles de un mineral
function verDetalles(id_mineral) {
    // Redirige a la página de detalles con el ID del mineral en la URL
    window.location.href = `detalle_mineral.html?id_mineral=${id_mineral}`;
}

// Función para eliminar un mineral
async function eliminarMineral(id_mineral) {
    const confirmacion = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (confirmacion.isConfirmed) {
        try {
            const response = await fetch(`${BASE_URL}/minerales/${id_mineral}`, {
                method: "DELETE"
            });

            if (response.ok) {
                Swal.fire('Eliminado', 'El mineral ha sido eliminado correctamente.', 'success');
                cargarMinerales(); // Recargar la tabla después de eliminar
            } else {
                const data = await response.json();
                Swal.fire('Error', data.mensaje || 'No se pudo eliminar el mineral.', 'error');
            }
        } catch (error) {
            console.error("Error al eliminar mineral:", error);
            Swal.fire('Error', 'Hubo un problema al eliminar el mineral. Intente nuevamente.', 'error');
        }
    }
}

// Cargar los minerales automáticamente al abrir la página
document.addEventListener("DOMContentLoaded", cargarMinerales);

