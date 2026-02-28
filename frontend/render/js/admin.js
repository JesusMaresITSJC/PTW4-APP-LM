/* =========================================
   INIT PANEL ADMIN
========================================= */
function initAdminDashboard() {
    mostrarUsuario();

    const titulo = document.getElementById("tituloVista");
    const menu = document.getElementById("adminMenu");
    const contenido = document.getElementById("adminContenido");

    titulo.textContent = "Panel de Administración";

    menu.innerHTML = `
    <button class="btn btn-primary" onclick="cargarAdminSeccion('idiomas')">Idiomas</button>
    <button class="btn btn-primary" onclick="cargarAdminSeccion('lecciones')">Lecciones</button>
    <button class="btn btn-primary" onclick="cargarAdminSeccion('ejercicios')">Ejercicios</button>
    <button class="btn btn-primary" onclick="cargarAdminSeccion('usuarios')">Usuarios</button>
  `;

    contenido.innerHTML = "Selecciona una sección";
}

/* =========================================
   CARGAR SECCIONES
========================================= */
async function cargarAdminSeccion(seccion) {
    const contenido = document.getElementById("adminContenido");
    contenido.innerHTML = "Cargando...";

    switch (seccion) {

        case "idiomas":
            const idiomas = await apiRequest("/idiomas");

            contenido.innerHTML = `
        <button class="btn btn-success" onclick="mostrarFormularioIdioma()">
          + Nuevo Idioma
        </button>

        <div id="formularioAdmin"></div>

        ${idiomas.map(i => `
          <div class="card">
            <h3>${i.nombre}</h3>
            <p>Código: ${i.codigo_iso}</p>
            <button class="btn btn-warning"
              onclick="editarIdioma(${i.id_idioma}, '${i.nombre}', '${i.codigo_iso}')">
              Editar
            </button>
            <button class="btn btn-danger"
              onclick="eliminarIdioma(${i.id_idioma})">
              Eliminar
            </button>
          </div>
        `).join("")}
      `;
            break;

        case "usuarios":
            try {
                const usuarios = await apiRequest("/usuarios");

                // Creamos un contenedor general para la sección de usuarios
                contenido.innerHTML = `
            <div id="usuariosAdmin">
                <button class="btn btn-success mb-2" id="btnNuevoUsuario">+ Nuevo Usuario</button>
                <div id="formularioUsuario"></div>
                <div id="listaUsuarios">
                    ${usuarios.map(u => `
                        <div class="card mb-2 p-2" id="usuario-${u.id}">
                            <p><strong>ID:</strong> ${u.id}</p>
                            <p><strong>Nombre:</strong> ${u.nombre}</p>
                            <p><strong>Correo:</strong> ${u.correo}</p>
                            <p><strong>Rol:</strong> ${u.rol}</p>
                            <button class="btn btn-warning btnEditar" data-id="${u.id}">Editar</button>
                            <button class="btn btn-danger btnEliminar" data-id="${u.id}">Eliminar</button>
                        </div>
                    `).join("")}
                </div>
            </div>
        `;

                // Agregamos listeners después de generar el HTML dinámicamente
                document.getElementById("btnNuevoUsuario")
                    .addEventListener("click", mostrarFormularioUsuario);

                document.querySelectorAll(".btnEditar").forEach(btn => {
                    btn.addEventListener("click", (e) => {
                        const id = e.target.dataset.id;
                        mostrarFormularioUsuario(id);
                    });
                });

                document.querySelectorAll(".btnEliminar").forEach(btn => {
                    btn.addEventListener("click", async (e) => {
                        const id = e.target.dataset.id;
                        await eliminarUsuario(id); // función que elimina dinámicamente
                    });
                });

            } catch (error) {
                contenido.innerHTML = "Error al cargar usuarios";
                console.error("Error al cargar usuarios", error);
            }
            break;



        case "lecciones": {
            try {
                // Traer datos
                const lecciones = await apiRequest("/lecciones/admin/all");
                const idiomas = await apiRequest("/idiomas");

                // Generar tarjetas de lecciones
                let tarjetas = "";
                lecciones.forEach(l => {
                    const idiomaNombre = idiomas.find(i => i.id_idioma === l.id_idioma)?.nombre ?? "Desconocido";

                    tarjetas += `
        <div class="card">
          <h3>${l.titulo}</h3>
          <p>Idioma: ${idiomaNombre}</p>
          <p>Orden: ${l.orden}</p>
          <p>Activo: ${l.activo ? "Sí" : "No"}</p>

          <button class="btn btn-warning"
            onclick="editarLeccion(${l.id_leccion}, ${l.id_idioma}, '${l.titulo}', '${l.descripcion ?? ""}', ${l.orden}, ${l.activo})">
            Editar
          </button>

          <button class="btn btn-danger"
            onclick="eliminarLeccion(${l.id_leccion})">
            Eliminar
          </button>
        </div>
      `;
                });

                // Insertar en el contenido
                const contenido = document.getElementById("adminContenido");
                contenido.innerHTML = `
      <button class="btn btn-success" onclick="mostrarFormularioLeccion()">+ Nueva Lección</button>
      <div id="formularioAdmin"></div>
      ${tarjetas}
    `;
            } catch (error) {
                console.error("Error cargando lecciones:", error);
                document.getElementById("adminContenido").innerHTML = "<p>Error al cargar las lecciones. Revisa la consola.</p>";
            }
            break;
        }

        //sig 
        case "ejercicios":
            const leccionesEj = await apiRequest("/lecciones");

            contenido.innerHTML = `
    <h3>Seleccionar Lección</h3>

    <select id="selectLeccion" onchange="cargarEjerciciosPorLeccion()">
      <option value="">-- Selecciona una lección --</option>
      ${leccionesEj.map(l => `
        <option value="${l.id_leccion}">
          ${l.titulo}
        </option>
      `).join("")}
    </select>

    <div id="ejerciciosAdmin"></div>
  `;
            break;

        //sig


        default:
            contenido.innerHTML = "Sección no implementada";
            break;
    }


}

/* =========================================
   CRUD IDIOMAS
========================================= */
function mostrarFormularioIdioma() {
    const form = document.getElementById("formularioAdmin");

    form.innerHTML = `
    <div class="card">
      <h3>Nuevo Idioma</h3>
      <input type="text" id="nuevoNombre" placeholder="Nombre">
      <input type="text" id="nuevoCodigo" placeholder="Código ISO">
      <button class="btn btn-primary" onclick="crearIdioma()">Guardar</button>
    </div>
  `;
}

async function crearIdioma() {
    const nombre = document.getElementById("nuevoNombre").value;
    const codigo_iso = document.getElementById("nuevoCodigo").value;

    await apiRequest("/idiomas", {
        method: "POST",
        body: JSON.stringify({ nombre, codigo_iso })
    });

    cargarAdminSeccion("idiomas");
}

function editarIdioma(id, nombre, codigo) {
    const form = document.getElementById("formularioAdmin");

    form.innerHTML = `
    <div class="card">
      <h3>Editar Idioma</h3>
      <input type="text" id="editNombre" value="${nombre}">
      <input type="text" id="editCodigo" value="${codigo}">
      <button class="btn btn-primary"
        onclick="guardarEdicionIdioma(${id})">
        Actualizar
      </button>
    </div>
  `;
}

async function guardarEdicionIdioma(id) {
    const nombre = document.getElementById("editNombre").value;
    const codigo_iso = document.getElementById("editCodigo").value;

    await apiRequest(`/idiomas/${id}`, {
        method: "PUT",
        body: JSON.stringify({ nombre, codigo_iso })
    });

    cargarAdminSeccion("idiomas");
}

async function eliminarIdioma(id) {
    if (!confirm("¿Seguro que deseas eliminar este idioma?")) return;

    await apiRequest(`/idiomas/${id}`, {
        method: "DELETE"
    });

    cargarAdminSeccion("idiomas");
}

/* =========================================
   CRUD LECCIONES
========================================= */

// Mostrar formulario para crear nueva lección
async function mostrarFormularioLeccion() {
    const form = document.getElementById("formularioAdmin");

    try {
        const idiomas = await apiRequest("/idiomas");
        if (!idiomas || idiomas.length === 0) {
            form.innerHTML = "<p>No hay idiomas disponibles.</p>";
            return;
        }

        const lecciones = await apiRequest("/lecciones/admin/all");
        const maxOrden = lecciones.length > 0 ? Math.max(...lecciones.map(l => l.orden)) : 0;

        form.innerHTML = `
      <div class="card">
        <h3>Nueva Lección</h3>

        <label>Idioma</label>
        <select id="idIdioma">
          ${idiomas.map(i => `<option value="${i.id_idioma}">${i.nombre}</option>`).join("")}
        </select>

        <label>Título</label>
        <input type="text" id="tituloLeccion" placeholder="Título">

        <label>Descripción</label>
        <textarea id="descripcionLeccion" placeholder="Descripción"></textarea>

        <label>Orden</label>
        <select id="ordenLeccion">
          ${[...Array(maxOrden + 1)].map((_, i) => `<option value="${i + 1}">${i + 1}</option>`).join("")}
        </select>

        <label>
          Activo
          <input type="checkbox" id="activoLeccion" checked>
        </label>

        <button class="btn btn-primary" onclick="crearLeccion()">Guardar</button>
      </div>
    `;
    } catch (error) {
        console.error("Error mostrando formulario de lección:", error);
        form.innerHTML = "<p>Error al cargar el formulario.</p>";
    }
}

// Crear nueva lección
async function crearLeccion() {
    const data = {
        id_idioma: parseInt(document.getElementById("idIdioma").value),
        titulo: document.getElementById("tituloLeccion").value,
        descripcion: document.getElementById("descripcionLeccion").value,
        orden: parseInt(document.getElementById("ordenLeccion").value),
        activo: document.getElementById("activoLeccion").checked ? 1 : 0
    };

    try {
        await apiRequest("/lecciones/admin", {
            method: "POST",
            body: JSON.stringify(data)
        });

        cargarAdminSeccion("lecciones");
    } catch (error) {
        console.error("Error creando lección:", error);
        alert("No se pudo crear la lección. Revisa la consola.");
    }
}

// Mostrar formulario para editar lección
async function editarLeccion(id, id_idioma, titulo, descripcion, orden, activo) {
    const form = document.getElementById("formularioAdmin");

    try {
        const idiomas = await apiRequest("/idiomas");

        const idiomaOptions = idiomas.map(i => `
      <option value="${i.id_idioma}" ${i.id_idioma === id_idioma ? "selected" : ""}>
        ${i.nombre}
      </option>
    `).join("");

        // Opciones de orden: máximo 20 o basado en número actual de lecciones
        const lecciones = await apiRequest("/lecciones/admin/all");
        const maxOrden = lecciones.length > 0 ? Math.max(...lecciones.map(l => l.orden)) : 0;
        const ordenOptions = [...Array(maxOrden + 1)].map((_, i) => `
      <option value="${i + 1}" ${i + 1 === orden ? "selected" : ""}>${i + 1}</option>
    `).join("");

        form.innerHTML = `
      <div class="card">
        <h3>Editar Lección</h3>

        <label>Idioma</label>
        <select id="editIdIdioma">${idiomaOptions}</select>

        <label>Título</label>
        <input type="text" id="editTitulo" value="${titulo}">

        <label>Descripción</label>
        <textarea id="editDescripcion">${descripcion}</textarea>

        <label>Orden</label>
        <select id="editOrden">${ordenOptions}</select>

        <label>
          Activo
          <input type="checkbox" id="editActivo" ${activo ? "checked" : ""}>
        </label>

        <button class="btn btn-primary" onclick="guardarEdicionLeccion(${id})">
          Guardar
        </button>
      </div>
    `;
    } catch (error) {
        console.error("Error mostrando formulario de edición:", error);
        form.innerHTML = "<p>Error al cargar el formulario de edición.</p>";
    }
}

// Guardar cambios de edición
async function guardarEdicionLeccion(id_leccion) {
    const data = {
        id_idioma: parseInt(document.getElementById("editIdIdioma").value),
        titulo: document.getElementById("editTitulo").value,
        descripcion: document.getElementById("editDescripcion").value,
        orden: parseInt(document.getElementById("editOrden").value),
        activo: document.getElementById("editActivo").checked ? 1 : 0
    };

    try {
        await apiRequest(`/lecciones/admin/${id_leccion}`, {
            method: "PUT",
            body: JSON.stringify(data)
        });

        cargarAdminSeccion("lecciones");
    } catch (error) {
        console.error("Error actualizando lección:", error);
        alert("No se pudo actualizar la lección. Revisa la consola.");
    }
}

// Eliminar lección
async function eliminarLeccion(id) {
    if (!confirm("¿Eliminar lección?")) return;

    try {
        await apiRequest(`/lecciones/admin/${id}`, { method: "DELETE" });
        cargarAdminSeccion("lecciones");
    } catch (error) {
        console.error("Error eliminando la lección:", error);
        alert("No se pudo eliminar la lección. Revisa la consola.");
    }
}

// Hacer funciones globales para que funcionen los onclick de HTML
window.mostrarFormularioLeccion = mostrarFormularioLeccion;
window.crearLeccion = crearLeccion;
window.editarLeccion = editarLeccion;
window.guardarEdicionLeccion = guardarEdicionLeccion;
window.eliminarLeccion = eliminarLeccion;


// =============================
// EJERCICIOS + OPCIONES (CRUD COMPLETO)
// =============================

window.editarOpciones = [];

// =============================
// Mostrar formulario para crear un nuevo ejercicio
// =============================
function mostrarFormularioEjercicio(id_leccion) {
    const form = document.getElementById("formularioAdmin");

    // Inicializamos opciones vacías
    window.editarOpciones = [];

    form.innerHTML = `
    <div class="card">
      <h3>Nuevo Ejercicio (Opción múltiple)</h3>

      <label>Pregunta</label>
      <textarea id="preguntaEj"></textarea>

      <label>Explicación</label>
      <textarea id="explicacionEj"></textarea>

      <label>Orden</label>
      <input type="number" id="ordenEj">

      <hr>
      <h4>Opciones</h4>
      <div id="opcionesContainerEdit"></div>

      <input type="text" id="textoOpcionEdit" placeholder="Nueva opción">
      <label>
        Correcta
        <input type="checkbox" id="correctaOpcionEdit">
      </label>
      <button class="btn btn-success" onclick="agregarOpcionEditar()">Agregar Opción</button>

      <hr>
      <button class="btn btn-primary" onclick="crearEjercicioConOpciones(${id_leccion})">Guardar</button>
    </div>
  `;

    renderOpcionesEditar();
}

// =============================
// Renderizar opciones (nuevo o edición)
// =============================
function renderOpcionesEditar() {
    const container = document.getElementById("opcionesContainerEdit");
    container.innerHTML = window.editarOpciones.map((o, i) => `
    <div>
      ${o.texto} ${o.es_correcta ? "✅" : ""}
      <button class="btn btn-danger" onclick="eliminarOpcionEditar(${i})">X</button>
    </div>
  `).join("");
}

// =============================
// Agregar opción (nuevo o edición)
// =============================
function agregarOpcionEditar() {
    const texto = document.getElementById("textoOpcionEdit").value.trim();
    const es_correcta = document.getElementById("correctaOpcionEdit").checked ? 1 : 0;

    if (!texto) return alert("El texto de la opción no puede estar vacío");

    // Solo una correcta
    if (es_correcta && window.editarOpciones.some(o => o.es_correcta)) {
        return alert("Solo puede haber una opción correcta");
    }

    window.editarOpciones.push({ id_opcion: null, texto, es_correcta });
    document.getElementById("textoOpcionEdit").value = "";
    document.getElementById("correctaOpcionEdit").checked = false;
    renderOpcionesEditar();
}

// =============================
// Eliminar opción temporal o existente
// =============================
function eliminarOpcionEditar(index) {
    window.editarOpciones.splice(index, 1);
    renderOpcionesEditar();
}

// =============================
// Crear ejercicio con opciones
// =============================
async function crearEjercicioConOpciones(id_leccion) {
    const pregunta = document.getElementById("preguntaEj").value.trim();
    const explicacion = document.getElementById("explicacionEj").value.trim();
    const orden = parseInt(document.getElementById("ordenEj").value);

    if (!pregunta || isNaN(orden)) return alert("Pregunta y orden son obligatorios");
    if (!window.editarOpciones.length) return alert("Agrega al menos una opción");
    if (!window.editarOpciones.some(o => o.es_correcta)) return alert("Marca cuál opción es correcta");

    const data = {
        id_leccion,
        tipo: "opcion_multiple",
        pregunta,
        explicacion,
        orden,
        opciones: window.editarOpciones
    };

    await apiRequest("/ejercicios/con-opciones", {
        method: "POST",
        body: JSON.stringify(data)
    });

    alert("Ejercicio creado correctamente");
    cargarEjerciciosPorLeccion();
}

// =============================
// Cargar ejercicios por lección
// =============================
async function cargarEjerciciosPorLeccion() {
    const select = document.getElementById("selectLeccion");
    const id_leccion = select.value;
    const contenedor = document.getElementById("ejerciciosAdmin");

    if (!id_leccion) {
        contenedor.innerHTML = "<p>Selecciona una lección</p>";
        return;
    }

    let ejercicios;
    try {
        ejercicios = await apiRequest(`/ejercicios/leccion/${id_leccion}`);
    } catch (err) {
        console.error("No se pudieron cargar los ejercicios", err);
        contenedor.innerHTML = "<p>Error al cargar los ejercicios</p>";
        return;
    }

    contenedor.innerHTML = `
    <button class="btn btn-success" onclick="mostrarFormularioEjercicio(${id_leccion})">
      + Nuevo Ejercicio
    </button>
    <div id="formularioAdmin"></div>

    ${ejercicios.map(e => `
      <div class="card">
        <h3>${e.pregunta}</h3>
        <p>Orden: ${e.orden}</p>
        <p>Opciones: ${e.opciones.map(o => `${o.texto} ${o.es_correcta ? "✅" : ""}`).join(", ")}</p>

        <button class="btn btn-warning" onclick="mostrarFormularioEditarEjercicio(${e.id_ejercicio})">Editar</button>
        <button class="btn btn-danger" onclick="eliminarEjercicio(${e.id_ejercicio})">Eliminar</button>
      </div>
    `).join("")}
  `;
}

// =============================
// Editar ejercicio con opciones
// =============================
async function mostrarFormularioEditarEjercicio(id_ejercicio) {
    const form = document.getElementById("formularioAdmin");

    let ejercicio, opciones;
    try {
        ejercicio = await apiRequest(`/ejercicios/${id_ejercicio}`);
        opciones = await apiRequest(`/opciones/ejercicio/${id_ejercicio}`);
    } catch (err) {
        console.error("Error al cargar ejercicio u opciones", err);
        return alert("No se pudo cargar el ejercicio");
    }

    window.editarOpciones = opciones.map(o => ({
        id_opcion: o.id_opcion,
        texto: o.texto,
        es_correcta: o.es_correcta
    }));

    form.innerHTML = `
    <div class="card">
      <h3>Editar Ejercicio</h3>

      <label>Pregunta</label>
      <textarea id="preguntaEjEdit">${ejercicio.pregunta}</textarea>

      <label>Explicación</label>
      <textarea id="explicacionEjEdit">${ejercicio.explicacion ?? ""}</textarea>

      <label>Orden</label>
      <input type="number" id="ordenEjEdit" value="${ejercicio.orden}">

      <hr>
      <h4>Opciones</h4>
      <div id="opcionesContainerEdit"></div>

      <input type="text" id="textoOpcionEdit" placeholder="Nueva opción">
      <label>
        Correcta
        <input type="checkbox" id="correctaOpcionEdit">
      </label>
      <button class="btn btn-success" onclick="agregarOpcionEditar()">Agregar Opción</button>

      <hr>
      <button class="btn btn-primary" onclick="guardarEdicionEjercicioConOpciones(${id_ejercicio})">Guardar Cambios</button>
    </div>
  `;

    renderOpcionesEditar();
}

// =============================
// Guardar edición de ejercicio y opciones
// =============================
async function guardarEdicionEjercicioConOpciones(id_ejercicio) {
    const pregunta = document.getElementById("preguntaEjEdit").value.trim();
    const explicacion = document.getElementById("explicacionEjEdit").value.trim();
    const orden = parseInt(document.getElementById("ordenEjEdit").value);

    if (!pregunta || isNaN(orden)) return alert("Pregunta y orden son obligatorios");
    if (!window.editarOpciones.length) return alert("Agrega al menos una opción");
    if (!window.editarOpciones.some(o => o.es_correcta)) return alert("Marca cuál opción es correcta");

    // Obtener id_leccion y tipo del ejercicio existente
    const ejercicio = await apiRequest(`/ejercicios/${id_ejercicio}`);

    const data = {
        id_leccion: ejercicio.id_leccion,
        tipo: ejercicio.tipo,
        pregunta,
        explicacion,
        orden
    };

    try {
        // Actualizar ejercicio
        await apiRequest(`/ejercicios/${id_ejercicio}`, {
            method: "PUT",
            body: JSON.stringify(data)
        });

        // Actualizar opciones
        for (const op of window.editarOpciones) {
            if (op.id_opcion) {
                await apiRequest(`/opciones/${op.id_opcion}`, {
                    method: "PUT",
                    body: JSON.stringify({ texto: op.texto, es_correcta: op.es_correcta })
                });
            } else {
                await apiRequest("/opciones", {
                    method: "POST",
                    body: JSON.stringify({ id_ejercicio, texto: op.texto, es_correcta: op.es_correcta })
                });
            }
        }

        alert("Ejercicio y opciones actualizados correctamente");
        cargarEjerciciosPorLeccion();
    } catch (err) {
        console.error("Error al guardar la edición", err);
        alert("Error al guardar la edición");
    }
}

// =============================
// Eliminar ejercicio
// =============================
async function eliminarEjercicio(id) {
    if (!confirm("¿Eliminar ejercicio?")) return;

    await apiRequest(`/ejercicios/${id}`, { method: "DELETE" });

    cargarEjerciciosPorLeccion();
}

// =============================
// Exponer funciones globales
// =============================
window.cargarEjerciciosPorLeccion = cargarEjerciciosPorLeccion;
window.mostrarFormularioEjercicio = mostrarFormularioEjercicio;
window.mostrarFormularioEditarEjercicio = mostrarFormularioEditarEjercicio;
window.agregarOpcionEditar = agregarOpcionEditar;
window.eliminarOpcionEditar = eliminarOpcionEditar;
window.guardarEdicionEjercicioConOpciones = guardarEdicionEjercicioConOpciones;
window.eliminarEjercicio = eliminarEjercicio;

// =============================
// USUARIOS CRUD (ADMIN)
// =============================

// Lista usuarios en el admin
async function cargarUsuariosAdmin() {
    const contenedor = document.getElementById("usuariosAdmin");
    if (!contenedor) {
        console.error("No se encontró el contenedor usuariosAdmin");
        return;
    }

    contenedor.innerHTML = "Cargando...";

    try {
        const usuarios = await apiRequest("/usuarios");

        contenedor.innerHTML = `
            <button class="btn btn-success mb-2" onclick="mostrarFormularioUsuario()">+ Nuevo Usuario</button>
            <div id="formularioUsuario"></div>
            ${usuarios.map(u => `
                <div class="card mb-2 p-2">
                    <p><strong>ID:</strong> ${u.id}</p>
                    <p><strong>Nombre:</strong> ${u.nombre}</p>
                    <p><strong>Correo:</strong> ${u.correo}</p>
                    <p><strong>Rol:</strong> ${u.rol}</p>
                    <button class="btn btn-warning" onclick="mostrarFormularioUsuario(${u.id})">Editar</button>
                    <button class="btn btn-danger" onclick="eliminarUsuario(${u.id})">Eliminar</button>
                </div>
            `).join("")}
        `;
    } catch (error) {
        contenedor.innerHTML = "Error al obtener usuarios";
        console.error("Error al cargar usuarios", error);
    }
}

// Mostrar formulario para crear o editar
async function mostrarFormularioUsuario(id = null) {
    const contenedor = document.getElementById("formularioUsuario");
    let usuario = { nombre: "", correo: "", rol: "usuario" };

    if (id) {
        try {
            usuario = await apiRequest(`/usuarios/${id}`);
        } catch (error) {
            alert("Error al cargar usuario");
            return;
        }
    }

    // Insertamos el formulario
    contenedor.innerHTML = `
        <div class="card p-3 mb-2">
            <h4>${id ? "Editar Usuario" : "Nuevo Usuario"}</h4>
            <label>Nombre</label>
            <input type="text" id="nombreUsuario" value="${usuario.nombre}" class="form-control mb-2">
            <label>Correo</label>
            <input type="email" id="correoUsuario" value="${usuario.correo}" class="form-control mb-2">
            <label>Rol</label>
            <select id="rolUsuario" class="form-control mb-2">
                <option value="usuario" ${usuario.rol === "usuario" ? "selected" : ""}>Usuario</option>
                <option value="admin" ${usuario.rol === "admin" ? "selected" : ""}>Admin</option>
            </select>
            <label>Contraseña ${id ? "(dejar en blanco si no cambia)" : ""}</label>
            <input type="password" id="passwordUsuario" class="form-control mb-2">
            <div class="d-flex gap-2">
                <button id="btnGuardarUsuario" class="btn btn-primary">
                    ${id ? "Actualizar" : "Crear"}
                </button>
                <button id="btnCancelarUsuario" class="btn btn-secondary">
                    Cancelar
                </button>
            </div>
        </div>
    `;

    // Asignamos listeners a los botones
    document.getElementById("btnCancelarUsuario").addEventListener("click", () => {
        contenedor.innerHTML = "";
    });

    document.getElementById("btnGuardarUsuario").addEventListener("click", async () => {
        const nombre = document.getElementById("nombreUsuario").value;
        const correo = document.getElementById("correoUsuario").value;
        const rol = document.getElementById("rolUsuario").value;
        const password = document.getElementById("passwordUsuario").value;

        try {
            if (id) {
                // Actualizar
                await apiRequest(`/usuarios/${id}`, {
                    method: "PUT",
                    body: JSON.stringify({ nombre, correo, rol, password })
                });
                alert("Usuario actualizado correctamente");
            } else {
                // Crear
                await apiRequest("/usuarios", {
                    method: "POST",
                    body: JSON.stringify({ nombre, correo, rol, password })
                });
                alert("Usuario creado correctamente");
            }

            cargarUsuariosAdmin(); // recargamos lista
            contenedor.innerHTML = "";

        } catch (error) {
            alert("Error al guardar usuario: " + error.message);
        }
    });
}

// Crear usuario
async function crearUsuario(event) {
    if (event) event.preventDefault(); // evita recarga
    const nombre = document.getElementById("nombreUsuario").value;
    const correo = document.getElementById("correoUsuario").value;
    const rol = document.getElementById("rolUsuario").value;
    const password = document.getElementById("passwordUsuario").value;

    try {
        await apiRequest("/usuarios", {
            method: "POST",
            body: JSON.stringify({ nombre, correo, password, rol })
        });
        alert("Usuario creado correctamente");
        cargarUsuariosAdmin(); // recarga la lista
        document.getElementById("formularioUsuario").innerHTML = "";
    } catch (error) {
        alert("Error al crear usuario: " + error.message);
    }
}

// Editar usuario
async function actualizarUsuario(id, event) {
    if (event) event.preventDefault();
    const nombre = document.getElementById("nombreUsuario").value;
    const correo = document.getElementById("correoUsuario").value;
    const rol = document.getElementById("rolUsuario").value;
    const password = document.getElementById("passwordUsuario").value;

    try {
        await apiRequest(`/usuarios/${id}`, {
            method: "PUT",
            body: JSON.stringify({ nombre, correo, rol, password })
        });
        alert("Usuario actualizado correctamente");
        cargarUsuariosAdmin(); 
        document.getElementById("formularioUsuario").innerHTML = "";
    } catch (error) {
        alert("Error al actualizar usuario: " + error.message);
    }
}

// Eliminar usuario
async function eliminarUsuario(id, e) {
    if (!confirm("¿Seguro que quieres eliminar este usuario?")) return;

    try {
        await apiRequest(`/usuarios/${id}`, { method: "DELETE" });

        // Eliminamos directamente la tarjeta del DOM usando el event target
        if (e && e.target) {
            const card = e.target.closest(".card");
            if (card) card.remove();
        } else {
            // fallback: recargar toda la lista si no hay event
            cargarUsuariosAdmin();
        }

    } catch (error) {
        console.error("Error al eliminar usuario", error);
        alert("No se pudo eliminar el usuario");
    }
}

// Exponer funciones globales
window.cargarUsuariosAdmin = cargarUsuariosAdmin;
window.mostrarFormularioUsuario = mostrarFormularioUsuario;
window.crearUsuario = crearUsuario;
window.actualizarUsuario = actualizarUsuario;
window.eliminarUsuario = eliminarUsuario;