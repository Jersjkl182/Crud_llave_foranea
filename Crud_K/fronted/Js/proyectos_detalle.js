const BASE_URL = "http://localhost:5000";

// Obtener el ID del proyecto desde la URL
function obtenerIdProyecto() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id_proyecto");
}

// Función para cargar los detalles del proyecto
async function cargarDetallesProyecto() {
    const id_proyecto = obtenerIdProyecto();
    if (!id_proyecto) {
        Swal.fire({
            title: "Error",
            text: "ID del proyecto no especificado.",
            icon: "error",
            confirmButtonText: "Aceptar"
        }).then(() => {
            window.location.href = "proyectos.html"; // Redirigir si no hay ID
        });
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/proyecto/${id_proyecto}`);
        const data = await response.json();

        if (data.proyecto) {
            // Mostrar los datos del proyecto en la página
            const proyecto = data.proyecto;
            document.getElementById("nombre").textContent = proyecto.nombre;
            document.getElementById("descripcion").textContent = proyecto.descripcion;
            document.getElementById("ubicacion").textContent = proyecto.ubicacion;
            document.getElementById("fecha_inicio").textContent = proyecto.fecha_inicio;
            document.getElementById("fecha_fin").textContent = proyecto.fecha_fin;
            document.getElementById("tipo_energia").textContent = `${proyecto.tipo_energia.tipo} - ${proyecto.tipo_energia.nombre_tipo_energia}`;
        } else {
            Swal.fire({
                title: "Proyecto no encontrado",
                text: "El proyecto no existe o ha sido eliminado.",
                icon: "info",
                confirmButtonText: "Aceptar"
            }).then(() => {
                window.location.href = "proyectos.html";  // Redirigir si no se encuentra el proyecto
            });
        }
    } catch (error) {
        console.error("Error al cargar los detalles del proyecto:", error);
        Swal.fire({
            title: "Error",
            text: "Hubo un problema al cargar los detalles del proyecto.",
            icon: "error",
            confirmButtonText: "Aceptar"
        }).then(() => {
            window.location.href = "proyectos.html"; // Redirigir si ocurre un error
        });
    }
}

// Función para manejar el clic en el botón "Editar Proyecto"
document.getElementById("btn-editar").addEventListener("click", function() {
    const id_proyecto = obtenerIdProyecto();  // Obtener el ID del proyecto de la URL actual
    if (id_proyecto) {
        // Redirigir a la página de edición con el ID del proyecto en la URL
        window.location.href = `editar_proyecto.html?id_proyecto=${id_proyecto}`;
    } else {
        Swal.fire({
            title: "Error",
            text: "No se puede obtener el ID del proyecto.",
            icon: "error",
            confirmButtonText: "Aceptar"
        });
    }
});

// Cargar los detalles del proyecto automáticamente al abrir la página
document.addEventListener("DOMContentLoaded", cargarDetallesProyecto);
