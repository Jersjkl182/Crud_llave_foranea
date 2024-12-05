// URL base del servidor Flask
const BASE_URL = "http://localhost:5000";

// Función para buscar tipos de energía por renovabilidad (Renovable o No Renovable)
async function buscarPorRenovabilidad() {
    const tipoRenovabilidad = document.getElementById("tipo-renovabilidad").value;
    const tablaResultados = document.querySelector("#resultados-busqueda tbody");
    tablaResultados.innerHTML = ""; // Limpiar tabla antes de mostrar los nuevos resultados

    if (!tipoRenovabilidad) {
        Swal.fire({
            icon: 'warning',
            title: 'Selección requerida',
            text: 'Por favor, seleccione un tipo de renovabilidad.'
        });
        return;
    }

    // Mostrar mensaje de carga
    tablaResultados.innerHTML = "<tr><td colspan='3'>Cargando resultados...</td></tr>";

    try {
        // Realizar la solicitud al servidor
        const response = await fetch(`${BASE_URL}/tipo_energia`);
        
        if (!response.ok) {
            throw new Error("Error al obtener los datos desde el servidor");
        }

        const data = await response.json();

        if (data.tipo_energia && Array.isArray(data.tipo_energia)) {
            // Filtra los datos por el tipo de renovabilidad
            const filtrados = data.tipo_energia.filter(tipo => tipo.tipo === tipoRenovabilidad);

            if (filtrados.length > 0) {
                // Crear contenido HTML de las filas de la tabla de manera eficiente
                const rows = filtrados.map(tipo => `
                    <tr>
                        <td>${tipo.id_tipo_energia}</td>
                        <td>${tipo.tipo}</td>
                        <td>${tipo.nombre_tipo_energia}</td>
                    </tr>
                `).join('');

                // Insertar las filas en la tabla
                tablaResultados.innerHTML = rows;
            } else {
                tablaResultados.innerHTML = "<tr><td colspan='3'>No se encontraron resultados para esta opción.</td></tr>";
            }
        } else {
            tablaResultados.innerHTML = "<tr><td colspan='3'>No se encontraron registros válidos.</td></tr>";
        }
    } catch (error) {
        console.error("Error al buscar el tipo de energía:", error);
        tablaResultados.innerHTML = "<tr><td colspan='3'>Error al buscar los datos. Por favor, inténtelo de nuevo.</td></tr>";
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'Hubo un problema al obtener los datos del servidor. Inténtalo más tarde.'
        });
    }
}

// Asociar evento al botón de búsqueda
document.getElementById("buscar-tipo-btn").addEventListener("click", buscarPorRenovabilidad);

