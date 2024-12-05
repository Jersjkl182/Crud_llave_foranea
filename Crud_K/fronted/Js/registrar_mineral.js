const BASE_URL = "http://localhost:5000";

// Función para registrar un nuevo mineral
async function registrarMineral(event) {
    event.preventDefault();  // Evitar que el formulario se envíe de forma tradicional

    // Obtener los valores del formulario
    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const ubicacion = document.getElementById("ubicacion").value;
    const id_proyecto = document.getElementById("id_proyecto").value;

    // Validar campos requeridos
    if (!nombre || !descripcion || !ubicacion || !id_proyecto) {
        Swal.fire({
            icon: 'warning',
            title: 'Faltan datos',
            text: 'Por favor, completa todos los campos del formulario.',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    // Crear el objeto de datos para enviar al servidor
    const datos = {
        nombre: nombre,
        descripcion: descripcion,
        ubicacion: ubicacion,
        id_proyecto: id_proyecto
    };

    try {
        // Enviar los datos al servidor Flask
        const response = await fetch(`${BASE_URL}/minerales`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        const result = await response.json();

        if (response.ok) {
            // Alerta de éxito con SweetAlert2
            Swal.fire({
                icon: 'success',
                title: 'Registro Exitoso',
                text: result.mensaje,  // Mensaje de respuesta del servidor
                confirmButtonText: 'Aceptar'
            }).then(() => {
                window.location.href = "minerales.html"; // Redirigir al listado de minerales
            });
        } else {
            // Alerta en caso de error con SweetAlert2
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: result.mensaje || 'Hubo un error al registrar el mineral.',
                confirmButtonText: 'Intentar nuevamente'
            });
        }
    } catch (error) {
        console.error("Error al registrar el mineral:", error);
        
        // Alerta de error en caso de fallo en la comunicación con el servidor
        Swal.fire({
            icon: 'error',
            title: 'Hubo un error',
            text: 'Hubo un error al intentar registrar el mineral. Intenta nuevamente.',
            confirmButtonText: 'Intentar nuevamente'
        });
    }
}
