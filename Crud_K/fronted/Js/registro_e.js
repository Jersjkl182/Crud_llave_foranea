// Función para manejar el registro del tipo de energía
async function registrarTipoEnergia(event) {
    event.preventDefault();  // Evitar que el formulario se envíe de forma tradicional

    // Obtener los valores del formulario
    const tipo = document.getElementById("tipo").value;
    const nombreTipoEnergia = document.getElementById("nombre_tipo_energia").value;

    // Validación de los campos
    if (!tipo || !nombreTipoEnergia) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor, complete todos los campos del formulario.',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    // Crear el objeto de datos para enviar al servidor
    const datos = {
        tipo: tipo,
        nombre_tipo_energia: nombreTipoEnergia
    };

    try {
        // Enviar los datos al servidor Flask
        const response = await fetch("http://localhost:5000/tipo_energia", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        const result = await response.json();

        // Si la respuesta del servidor es exitosa
        if (response.ok) {
            // Alerta de éxito con SweetAlert2
            Swal.fire({
                icon: 'success',
                title: '¡Registro Exitoso!',
                text: result.mensaje,  // Mensaje de respuesta del servidor
                confirmButtonText: 'Aceptar'
            }).then(() => {
                location.reload();  // Recargar la página después de cerrar la alerta
            });
        } else {
            // Alerta en caso de error con SweetAlert2
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: result.mensaje || 'Hubo un problema al registrar el tipo de energía.',
                confirmButtonText: 'Intentar nuevamente'
            });
        }
    } catch (error) {
        console.error("Error al registrar el tipo de energía:", error);
        
        // Alerta de error en caso de fallo en la comunicación con el servidor
        Swal.fire({
            icon: 'error',
            title: 'Hubo un error',
            text: 'Hubo un problema al intentar registrar el tipo de energía. Intenta nuevamente.',
            confirmButtonText: 'Intentar nuevamente'
        });
    }
}
