from flask import Flask, jsonify, request
from flask_cors import CORS
import pymysql

app = Flask(__name__)
CORS(app)  # Habilitar CORS

# Función para conectarse a la base de datos
def conectar():
    return pymysql.connect(host='localhost', user='root', password='', database='oriana', charset='utf8mb4')

# ----------------- CRUD para la tabla tipo_energia -----------------

@app.route("/tipo_energia", methods=['GET'])
def obtener_tipos_energia():
    try:
        conn = conectar()
        cur = conn.cursor()
        cur.execute("SELECT * FROM tipo_energia")
        datos = cur.fetchall()
        cur.close()
        conn.close()
        resultado = [{'id_tipo_energia': row[0], 'tipo': row[1], 'nombre_tipo_energia': row[2]} for row in datos]
        return jsonify({'tipo_energia': resultado, 'mensaje': 'Consulta exitosa'})
    except Exception as ex:
        return jsonify({'mensaje': f'Error: {str(ex)}'})

@app.route("/tipo_energia/<int:id_tipo>", methods=['GET'])
def obtener_tipo_energia(id_tipo):
    try:
        conn = conectar()
        cur = conn.cursor()
        cur.execute("SELECT * FROM tipo_energia WHERE id_tipo_energia = %s", (id_tipo,))
        row = cur.fetchone()
        cur.close()
        conn.close()
        if row:
            return jsonify({'tipo_energia': {'id_tipo_energia': row[0], 'tipo': row[1], 'nombre_tipo_energia': row[2]}, 'mensaje': 'Registro encontrado'})
        else:
            return jsonify({'mensaje': 'Registro no encontrado'})
    except Exception as ex:
        return jsonify({'mensaje': f'Error: {str(ex)}'})

@app.route("/tipo_energia", methods=['POST'])
def agregar_tipo_energia():
    try:
        conn = conectar()
        cur = conn.cursor()
        cur.execute("INSERT INTO tipo_energia (tipo, nombre_tipo_energia) VALUES (%s, %s)", 
                    (request.json['tipo'], request.json['nombre_tipo_energia']))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Tipo de energía agregado exitosamente'})
    except Exception as ex:
        return jsonify({'mensaje': f'Error: {str(ex)}'})

@app.route("/tipo_energia/<int:id_tipo>", methods=['PUT'])
def actualizar_tipo_energia(id_tipo):
    try:
        conn = conectar()
        cur = conn.cursor()
        cur.execute("UPDATE tipo_energia SET tipo = %s, nombre_tipo_energia = %s WHERE id_tipo_energia = %s", 
                    (request.json['tipo'], request.json['nombre_tipo_energia'], id_tipo))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Tipo de energía actualizado exitosamente'})
    except Exception as ex:
        return jsonify({'mensaje': f'Error: {str(ex)}'})

@app.route("/tipo_energia/<int:id_tipo>", methods=['DELETE'])
def eliminar_tipo_energia(id_tipo):
    try:
        conn = conectar()
        cur = conn.cursor()
        cur.execute("DELETE FROM tipo_energia WHERE id_tipo_energia = %s", (id_tipo,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Tipo de energía eliminado exitosamente'})
    except Exception as ex:
        return jsonify({'mensaje': f'Error: {str(ex)}'})

# ----------------- CRUD para la tabla Proyecto -----------------

@app.route("/proyecto", methods=['GET'])
def obtener_proyectos():
    try:
        conn = conectar()
        cur = conn.cursor()
        cur.execute("""
            SELECT p.id_proyecto, p.nombre, p.descripcion, p.ubicacion, p.fecha_inicio, p.fecha_fin, t.tipo, t.nombre_tipo_energia
            FROM Proyecto p
            JOIN tipo_energia t ON p.id_tipo_energia = t.id_tipo_energia
        """)
        datos = cur.fetchall()
        cur.close()
        conn.close()
        resultado = [{
            'id_proyecto': row[0],
            'nombre': row[1],
            'descripcion': row[2],
            'ubicacion': row[3],
            'fecha_inicio': str(row[4]),
            'fecha_fin': str(row[5]),
            'tipo_energia': {'tipo': row[6], 'nombre_tipo_energia': row[7]}
        } for row in datos]
        return jsonify({'proyectos': resultado, 'mensaje': 'Consulta exitosa'})
    except Exception as ex:
        return jsonify({'mensaje': f'Error: {str(ex)}'})

@app.route("/proyecto/<int:id_proyecto>", methods=['GET'])
def obtener_proyecto(id_proyecto):
    try:
        conn = conectar()
        cur = conn.cursor()
        cur.execute("""
            SELECT p.id_proyecto, p.nombre, p.descripcion, p.ubicacion, p.fecha_inicio, p.fecha_fin, t.tipo, t.nombre_tipo_energia
            FROM Proyecto p
            JOIN tipo_energia t ON p.id_tipo_energia = t.id_tipo_energia
            WHERE p.id_proyecto = %s
        """, (id_proyecto,))
        row = cur.fetchone()
        cur.close()
        conn.close()
        if row:
            resultado = {
                'id_proyecto': row[0],
                'nombre': row[1],
                'descripcion': row[2],
                'ubicacion': row[3],
                'fecha_inicio': str(row[4]),
                'fecha_fin': str(row[5]),
                'tipo_energia': {'tipo': row[6], 'nombre_tipo_energia': row[7]}
            }
            return jsonify({'proyecto': resultado, 'mensaje': 'Registro encontrado'})
        else:
            return jsonify({'mensaje': 'Registro no encontrado'})
    except Exception as ex:
        return jsonify({'mensaje': f'Error: {str(ex)}'})

@app.route("/proyecto", methods=['POST'])
def agregar_proyecto():
    try:
        conn = conectar()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO Proyecto (nombre, descripcion, id_tipo_energia, ubicacion, fecha_inicio, fecha_fin)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            request.json['nombre'],
            request.json['descripcion'],
            request.json['id_tipo_energia'],
            request.json['ubicacion'],
            request.json['fecha_inicio'],
            request.json['fecha_fin']
        ))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Proyecto agregado exitosamente'})
    except Exception as ex:
        return jsonify({'mensaje': f'Error: {str(ex)}'})

@app.route('/investigadores/<int:id_investigador>', methods=['PATCH'])
def editar_investigador(id_investigador):
    try:
        datos = request.json
        nombre = datos.get('nombre')
        apellido = datos.get('apellido')
        especialidad = datos.get('especialidad')
        id_proyecto = datos.get('id_proyecto')  # Ahora el id_proyecto es opcional

        if not nombre or not apellido:
            return jsonify({'mensaje': 'Nombre y apellido son obligatorios'}), 400

        conexion = conectar()
        cursor = conexion.cursor()

        # Query para actualizar los campos del investigador
        query = """
            UPDATE Investigadores 
            SET nombre = %s, apellido = %s, especialidad = %s
        """

        # Si se pasa id_proyecto, actualizar también ese campo
        params = [nombre, apellido, especialidad]
        if id_proyecto is not None:
            query += ", id_proyecto = %s"
            params.append(id_proyecto)

        query += " WHERE id_investigador = %s"
        params.append(id_investigador)

        cursor.execute(query, tuple(params))
        conexion.commit()

        if cursor.rowcount > 0:
            return jsonify({'mensaje': 'Investigador actualizado exitosamente'}), 200
        else:
            return jsonify({'mensaje': 'Investigador no encontrado'}), 404
    except Exception as e:
        return jsonify({'mensaje': 'Error al actualizar investigador', 'error': str(e)}), 500
    finally:
        cursor.close()
        conexion.close()


@app.route("/proyecto/<int:id_proyecto>", methods=['DELETE'])
def eliminar_proyecto(id_proyecto):
    try:
        conn = conectar()
        cur = conn.cursor()
        cur.execute("DELETE FROM Proyecto WHERE id_proyecto = %s", (id_proyecto,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Proyecto eliminado exitosamente'})
    except Exception as ex:
        return jsonify({'mensaje': f'Error: {str(ex)}'})
#-----------------------------------------------------------------------------


# Ruta para consultar todos los minerales
@app.route('/minerales', methods=['GET'])
def obtener_minerales():
    try:
        conexion = conectar()
        cursor = conexion.cursor(pymysql.cursors.DictCursor)
        cursor.execute("SELECT * FROM Minerales")
        minerales = cursor.fetchall()
        return jsonify({'minerales': minerales}), 200
    except Exception as e:
        return jsonify({'mensaje': 'Error al consultar minerales', 'error': str(e)}), 500
    finally:
        cursor.close()
        conexion.close()


# Ruta para registrar un nuevo mineral
@app.route('/minerales', methods=['POST'])
def registrar_mineral():
    try:
        datos = request.json
        nombre = datos.get('nombre')
        descripcion = datos.get('descripcion')
        ubicacion = datos.get('ubicacion')
        id_proyecto = datos.get('id_proyecto')

        if not (nombre and descripcion and ubicacion):
            return jsonify({'mensaje': 'Todos los campos excepto id_proyecto son obligatorios'}), 400

        conexion = conectar()
        cursor = conexion.cursor()
        query = """
            INSERT INTO Minerales (nombre, descripcion, ubicacion, id_proyecto)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(query, (nombre, descripcion, ubicacion, id_proyecto))
        conexion.commit()
        return jsonify({'mensaje': 'Mineral registrado exitosamente'}), 201
    except Exception as e:
        return jsonify({'mensaje': 'Error al registrar mineral', 'error': str(e)}), 500
    finally:
        cursor.close()
        conexion.close()


# Ruta para consultar un mineral por su ID
@app.route('/minerales/<int:id_mineral>', methods=['GET'])
def obtener_mineral(id_mineral):
    try:
        conexion = conectar()
        cursor = conexion.cursor(pymysql.cursors.DictCursor)
        cursor.execute("SELECT * FROM Minerales WHERE id_mineral = %s", (id_mineral,))
        mineral = cursor.fetchone()
        if mineral:
            return jsonify({'mineral': mineral}), 200
        else:
            return jsonify({'mensaje': 'Mineral no encontrado'}), 404
    except Exception as e:
        return jsonify({'mensaje': 'Error al consultar mineral', 'error': str(e)}), 500
    finally:
        cursor.close()
        conexion.close()


# Ruta para editar solo la ubicación de un mineral por ID
@app.route('/minerales/<int:id_mineral>', methods=['PATCH'])
def editar_ubicacion_mineral(id_mineral):
    try:
        datos = request.json
        nueva_ubicacion = datos.get('ubicacion')

        if not nueva_ubicacion:
            return jsonify({'mensaje': 'La ubicación es obligatoria'}), 400

        conexion = conectar()
        cursor = conexion.cursor()
        query = "UPDATE Minerales SET ubicacion = %s WHERE id_mineral = %s"
        cursor.execute(query, (nueva_ubicacion, id_mineral))
        conexion.commit()

        if cursor.rowcount > 0:
            return jsonify({'mensaje': 'Ubicación del mineral actualizada exitosamente'}), 200
        else:
            return jsonify({'mensaje': 'Mineral no encontrado'}), 404
    except Exception as e:
        return jsonify({'mensaje': 'Error al actualizar la ubicación del mineral', 'error': str(e)}), 500
    finally:
        cursor.close()
        conexion.close()


# Ruta para eliminar un mineral por ID
@app.route('/minerales/<int:id_mineral>', methods=['DELETE'])
def eliminar_mineral(id_mineral):
    try:
        conexion = conectar()
        cursor = conexion.cursor()
        query = "DELETE FROM Minerales WHERE id_mineral = %s"
        cursor.execute(query, (id_mineral,))
        conexion.commit()

        if cursor.rowcount > 0:
            return jsonify({'mensaje': 'Mineral eliminado exitosamente'}), 200
        else:
            return jsonify({'mensaje': 'Mineral no encontrado'}), 404
    except Exception as e:
        return jsonify({'mensaje': 'Error al eliminar mineral', 'error': str(e)}), 500
    finally:
        cursor.close()
        conexion.close()

# ----------------- Similar CRUD para otras tablas -----------------
# Minerales, Investigadores, Inversiones, Estudios, Empresa, EficienciaEnergetica, ComunidadesEnergeticas

# Iniciar servidor
if __name__ == "__main__":
    app.run(debug=True)
