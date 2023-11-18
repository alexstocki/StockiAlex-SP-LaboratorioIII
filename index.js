document.addEventListener('DOMContentLoaded', cargarDatos);

const listaEnMemoria = [];

function cargarDatos() {
    mostrarSpinner(true);
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost/PersonasFutbolistasProfesionales.php', true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            mostrarSpinner(false);
            if (xhr.status === 200) {
                const respuesta = JSON.parse(xhr.responseText);
                respuesta.map(obj => {
                    if ('equipo' in obj && 'posicion' in obj && 'cantidadGoles' in obj) {
                        listaEnMemoria.push(new Futbolista(obj.id, obj.nombre, obj.apellido, obj.edad, obj.equipo, obj.posicion, obj.cantidadGoles));
                    } else {
                        listaEnMemoria.push(new Profesional(obj.id, obj.nombre, obj.apellido, obj.edad, obj.titulo, obj.facultad, obj.añoGraduacion));
                    }
                });
                procesarRespuesta(respuesta);
                mostrarFormularioLista(); 
            } else {
                alert("Hubo un problema al obtener los datos: " + xhr.status);
            }
        }
    };

    xhr.send(); 
}

function procesarRespuesta(respuesta) {
    const tbody = document.querySelector('#formularioLista tbody');
    tbody.innerHTML = '';

    respuesta.forEach((obj) => {
        const tr = document.createElement('tr'); 
        
        const tdId = document.createElement('td');
        tdId.textContent = obj.id;
        tr.appendChild(tdId);

        const tdNombre = document.createElement('td');
        tdNombre.textContent = obj.nombre;
        tr.appendChild(tdNombre);

        const tdApellido = document.createElement('td');
        tdApellido.textContent = obj.apellido;
        tr.appendChild(tdApellido);

        const tdEdad = document.createElement('td');
        tdEdad.textContent = obj.edad;
        tr.appendChild(tdEdad);

        const tdEquipo = document.createElement('td');
        const tdPosicion = document.createElement('td');
        const tdCantidadGoles = document.createElement('td');
        const tdTitulo = document.createElement('td');
        const tdFacultad = document.createElement('td');
        const tdañoGraduacion = document.createElement('td');

        if ('equipo' in obj && 'posicion' in obj && 'cantidadGoles' in obj) {
            tdEquipo.textContent = obj.equipo;
            tdPosicion.textContent = obj.posicion;
            tdCantidadGoles.textContent = obj.cantidadGoles;
            tdTitulo.textContent = 'N/A';
            tdFacultad.textContent = 'N/A';
            tdañoGraduacion.textContent = 'N/A';
        } else {
            tdEquipo.textContent = 'N/A';
            tdPosicion	.textContent = 'N/A';
            tdCantidadGoles.textContent = 'N/A';
            tdTitulo.textContent = obj.titulo;
            tdFacultad.textContent = obj.facultad;
            tdañoGraduacion.textContent = obj.añoGraduacion;
        }
        
        tr.appendChild(tdEquipo);
        tr.appendChild(tdPosicion);
        tr.appendChild(tdCantidadGoles);
        tr.appendChild(tdTitulo);
        tr.appendChild(tdFacultad);
        tr.appendChild(tdañoGraduacion);

        const tdModificar = document.createElement('td');
        const btnModificar = document.createElement('button');
        btnModificar.classList.add('btn', 'btn-warning');
        btnModificar.textContent = 'Modificar';
        btnModificar.onclick = function () { prepararFormularioModificacion(obj); };
        tdModificar.appendChild(btnModificar);
        tr.appendChild(tdModificar);

        const tdEliminar = document.createElement('td');
        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn', 'btn-danger');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.onclick = function () { aceptarEliminacion(obj); };
        tdEliminar.appendChild(btnEliminar);
        tr.appendChild(tdEliminar);

        tbody.appendChild(tr);
    });
}

function mostrarSpinner(mostrar) {
    const spinner = document.getElementById('spinner');
    spinner.style.display = mostrar ? 'flex' : 'none';
}

function prepararFormularioModificacion(objeto) {
    mostrarFormularioABM();
    document.getElementById('tituloFormulario').innerText = 'Modificación';

    const id = document.getElementById('id');
    const nombre = document.getElementById('nombre');
    const apellido = document.getElementById('apellido');
    const edad = document.getElementById('atributo3'); 
    const tipo = document.getElementById('tipo');

    const tipoObjeto = objeto.equipo && objeto.posicion && objeto.cantidadGoles >=0 ? 'Futbolista' : 'Profesional';

    if (objeto.equipo && objeto.posicion && objeto.cantidadGoles >= 0) {
        const equipo = document.getElementById('equipo');
        const posicion = document.getElementById('posicion');
        const cantidadGoles = document.getElementById('cantidadGoles');
        tipo.value = 'Futbolista';
    } else {
        const titulo = document.getElementById('titulo');
        const facultad = document.getElementById('facultad');
        const añoGraduacion = document.getElementById('añoGraduacion');
        tipo.value = 'Profesional';
    }

    id.value = objeto.id;
    id.disabled = true;
    
    nombre.value = objeto.nombre;
    apellido.value = objeto.apellido;
    edad.value = objeto.edad;
    tipo.disabled = true;

    cambiarTipo();

    if (tipoObjeto === 'Futbolista') {
        equipo.value = objeto.equipo;
        posicion.value = objeto.posicion;
        cantidadGoles.value = objeto.cantidadGoles;
    } else {
        titulo.value = objeto.titulo;
        facultad.value = objeto.facultad;
        añoGraduacion.value = objeto.añoGraduacion;
    }

    const btnAceptar = document.getElementById('btnAceptar');
    btnAceptar.onclick = function () { aceptarModificacion(); };
}


class Persona {
    constructor(id, nombre, apellido, edad) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
    }

    toString() {
        return `${this.nombre} ${this.apellido}`;
    }
}

class Futbolista extends Persona {
    constructor(id, nombre, apellido, edad, equipo, posicion, cantidadGoles) {
        super(id, nombre, apellido, edad);
        this.equipo = equipo;
        this.posicion = posicion;
        this.cantidadGoles = cantidadGoles;
    }

    toString() {
        return `${super.toString()} - Equipo: ${this.equipo}, Posición: ${this.posicion}, Goles: ${this.cantidadGoles}`;
    }
}

class Profesional extends Persona {
    constructor(id, nombre, apellido, edad, titulo, facultad, añoGraduacion) {
        super(id, nombre, apellido, edad);
        this.titulo = titulo;
        this.facultad = facultad;
        this.añoGraduacion = añoGraduacion;
    }

    toString() {
        return `${super.toString()} - Título: ${this.titulo}, Facultad: ${this.facultad}, Año de ingreso: ${this.añoGraduacion}`;
    }
}

function validarDatosFormulario() {
    const id = document.getElementById('id').value;
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const edad = document.getElementById('atributo3').value;
    const tipo = document.getElementById('tipo').value; 

    if (!nombre || !apellido || !edad || edad <= 15) {
        alert("Los campos comunes no cumplen con las restricciones necesarias.");
        return false;
    }

    if (tipo === 'Futbolista') {
        const equipo = document.getElementById('equipo').value;
        const posicion = document.getElementById('posicion').value;
        const cantidadGoles = document.getElementById('cantidadGoles').value;
        
        if (!equipo || !posicion || cantidadGoles < 0) {
            alert("Los campos de futbolista no cumplen con las restricciones necesarias.");
            return false;
        }
    } else if (tipo === 'Profesional') {
        const titulo = document.getElementById('titulo').value;
        const facultad = document.getElementById('facultad').value;
        const añoGraduacion = document.getElementById('añoGraduacion').value;
        
        if (!titulo || !facultad || añoGraduacion <= 1950) {
            alert("Los campos de Profesional no cumplen con las restricciones necesarias.");
            return false;
        }
    }

    return true;
}

function mostrarFormularioABM() {
    document.getElementById('formularioLista').style.display = 'none';
    document.getElementById('formularioABMContainer').style.display = 'block';
}

function cancelarYMostrarLista() {
    document.getElementById('formularioABMContainer').style.display = 'none';
    document.getElementById('formularioLista').style.display = 'block';
}

function mostrarFormularioLista() {
    document.getElementById('formularioLista').style.display = 'block';
}

function cambiarTipo() {
    const tipo = document.getElementById('tipo').value;
    const camposFutbolista = document.getElementById('camposFutbolista');
    const camposProfesional = document.getElementById('camposProfesional');

    camposFutbolista.style.display = 'none';
    camposProfesional.style.display = 'none';

    if (tipo === 'Futbolista') {
        camposFutbolista.style.display = 'block';
    } else if (tipo === 'Profesional') {
        camposProfesional.style.display = 'block';
    }
}

function obtenerDatosFormulario() {
    const id = document.getElementById('id').value;
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const edad = document.getElementById('atributo3').value; 
    const tipo = document.getElementById('tipo').value;

    if (!nombre || !apellido || !edad || edad <= 15) {
        alert("Los campos comunes no cumplen con las restricciones necesarias.");
        return false;
    }

    if (tipo === 'Futbolista') {
        const equipo = document.getElementById('equipo').value;
        const posicion = document.getElementById('posicion').value;
        const cantidadGoles = document.getElementById('cantidadGoles').value;

        if (!equipo || !posicion || cantidadGoles < 0) {
            alert("Los campos de futbolista no cumplen con las restricciones necesarias.");
            return false;
        }

        return new Futbolista(id, nombre, apellido, edad, equipo, posicion, cantidadGoles);
    } else if (tipo === 'Profesional') {
        const titulo = document.getElementById('titulo').value;
        const facultad = document.getElementById('facultad').value;
        const añoGraduacion = document.getElementById('añoGraduacion').value;

        if (!titulo || !facultad || añoGraduacion <= 1950) {
            alert("Los campos de profesional no cumplen con las restricciones necesarias.");
            return false;
        }

        return new Profesional(id, nombre, apellido, edad, titulo, facultad, añoGraduacion);
    }

    return true;
}

function agregarElementoALista(elemento) {
    listaEnMemoria.push(elemento);
}

function actualizarTabla() {
    debugger;
    procesarRespuesta(listaEnMemoria);
}

async function aceptar() {
    const esValido = validarDatosFormulario();
    if (!esValido) {
        alert('Los datos del formulario no son válidos.');
        return;
    }

    const datosFormulario = obtenerDatosFormulario();
    mostrarSpinner(true); 
    
    const { id, ...datosSinId } = datosFormulario;

    await fetch('http://localhost/PersonasFutbolistasProfesionales.php', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosSinId)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('La solicitud al API fallo');
        }
        return response.json();
    })
    .then(data => {
        datosFormulario.id = data.id;
        agregarElementoALista(datosFormulario);
        actualizarTabla();
    })
    .catch(error => {
        console.error('Error al realizar la solicitud:', error);
        alert('No se pudo realizar la operación.');
    })
    .finally(() => {
        mostrarSpinner(false);
        mostrarFormularioLista();
        cancelarYMostrarLista();

    });
}

function aceptarModificacion() {
    const objetoModificado = obtenerDatosFormulario();

    mostrarSpinner(true);

    fetch('http://localhost/PersonasFutbolistasProfesionales.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(objetoModificado)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('La solicitud al API fallo');
        }
    })
    .then(data => {
        const indice = listaEnMemoria.findIndex(obj => obj.id == objetoModificado.id);
        listaEnMemoria[indice] = objetoModificado;
        actualizarTabla();
        cancelarYMostrarLista();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('No se pudo realizar la operación.');
        mostrarFormularioLista();
    })
    .finally(() => {
        const btnAceptar = document.getElementById('btnAceptar');
        btnAceptar.onclick = function () { aceptar(); };
        mostrarSpinner(false);
    });
}

async function aceptarEliminacion(objetoAEliminar) {
    mostrarSpinner(true);

    try {
        const response = await fetch('http://localhost/PersonasFutbolistasProfesionales.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: objetoAEliminar.id })
        });

        if (!response.ok) {
            throw new Error('La solicitud al API falló');
        }

        const index = listaEnMemoria.findIndex(item => item.id === objetoAEliminar.id);
        if (index !== -1) {
            listaEnMemoria.splice(index, 1);
        }

        procesarRespuesta(listaEnMemoria);

        mostrarFormularioLista();
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo realizar la operación.');
        mostrarFormularioLista();
    } finally {
        mostrarSpinner(false);
    }
}

function cancelar() {
    document.getElementById('formularioABM').reset();
    cambiarTipo();
    cancelarYMostrarLista();
}