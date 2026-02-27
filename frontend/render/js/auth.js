let idiomaActual = null;

/* =========================================
   LOGIN
   ========================================= */
function initLogin() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="login-wrapper">
      <div class="login-logo">
        <div class="logo-placeholder">🌍</div>
      </div>
      <h1 class="login-titulo">LinguaApp</h1>
      <p class="login-subtitulo">Aprende idiomas de forma divertida</p>

      <div class="login-card">
        <div class="form-grupo">
          <label for="correo">Correo</label>
          <input type="email" id="correo" placeholder="tu@correo.com">
        </div>
        <div class="form-grupo">
          <label for="password">Contraseña</label>
          <input type="password" id="password" placeholder="••••••••">
        </div>
        <button class="btn btn-primary" id="loginBtn">Iniciar sesión</button>
        <button class="btn btn-secondary" onclick="mostrarRegistro()">Crear cuenta</button>
      </div>
    </div>
  `;

  document.getElementById("loginBtn").addEventListener("click", login);
}


//login
async function login() {
  const correo = document.getElementById("correo").value;
  const password = document.getElementById("password").value;

  if (!correo || !password) {
    alert("Completa todos los campos");
    return;
  }

  const response = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, password })
  });

  const data = await response.json();

  if (response.ok) {
    const token = data.token;   // ✅ Declaramos token
    localStorage.setItem("token", token);

    const payload = JSON.parse(atob(token.split(".")[1]));

    if (payload.rol === "admin") {
      loadView("adminDashboard");
    } else {
      loadView("idiomas");
    }

  } else {
    alert(data.mensaje || "Error al iniciar sesión");
  }
}



/* =========================================
   REGISTRO
   ========================================= */
function mostrarRegistro() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="login-wrapper">
      <div class="login-logo">
        <div class="logo-placeholder">🌍</div>
      </div>
      <h1 class="login-titulo">Crear cuenta</h1>
      <p class="login-subtitulo">Únete y empieza a aprender hoy</p>

      <div class="login-card">
        <div class="form-grupo">
          <label for="nombreRegistro">Nombre</label>
          <input type="text" id="nombreRegistro" placeholder="Tu nombre">
        </div>
        <div class="form-grupo">
          <label for="correoRegistro">Correo</label>
          <input type="email" id="correoRegistro" placeholder="tu@correo.com">
        </div>
        <div class="form-grupo">
          <label for="passwordRegistro">Contraseña</label>
          <input type="password" id="passwordRegistro" placeholder="••••••••">
        </div>
        <button class="btn btn-primary" onclick="register()">Crear cuenta</button>
        <button class="btn btn-secondary" onclick="loadView('login')">Ya tengo cuenta</button>
      </div>
    </div>
  `;
}

async function register() {
  const nombre = document.getElementById("nombreRegistro").value;
  const correo = document.getElementById("correoRegistro").value;
  const password = document.getElementById("passwordRegistro").value;

  if (!nombre || !correo || !password) {
    alert("Completa todos los campos");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, correo, password })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.mensaje);
      return;
    }

    alert("Usuario registrado correctamente");
    loadView("login");
  } catch (error) {
    console.error(error);
    alert("Error al registrar usuario");
  }
}

/* =========================================
   IDIOMAS (con progreso)
   ========================================= */
async function initIdiomas() {
  mostrarUsuario();

  const titulo = document.getElementById("tituloVista");
  const contenedor = document.getElementById("listaIdiomas");

  titulo.textContent = "Elige un idioma";
  contenedor.innerHTML = "Cargando...";

  try {
    const idiomas = await apiRequest("/idiomas/progreso");

    contenedor.innerHTML = `<div class="grid-idiomas">${
      idiomas.map(idioma => `
        <div class="card">
          <h3>${idioma.nombre}</h3>
          <p>Código ISO: ${idioma.codigo_iso}</p>
          <div class="barra">
            <div class="progreso" style="width:${idioma.porcentaje ?? 0}%">
              ${idioma.porcentaje ?? 0}%
            </div>
          </div>
          <button class="btn btn-primary" onclick="verLecciones(${idioma.id_idioma})">
            Ver lecciones
          </button>
        </div>
      `).join("")
    }</div>`;

  } catch (error) {
    console.error(error);
    contenedor.innerHTML = "Error al cargar idiomas";
  }
}

/* =========================================
   LECCIONES
   ========================================= */
async function verLecciones(idIdioma) {
  const titulo = document.getElementById("tituloVista");
  const contenedor = document.getElementById("listaIdiomas");

  idiomaActual = idIdioma;
  titulo.textContent = "Lecciones";
  contenedor.innerHTML = "Cargando lecciones...";

  const lecciones = await apiRequest(`/lecciones?idioma=${idIdioma}`);

  contenedor.innerHTML = `
    <button class="btn btn-volver" onclick="volverAIdiomas()">← Volver</button>
    <div class="grid-lecciones">
      ${lecciones.map(leccion => `
        <div class="leccion-card">
          <h3>${leccion.titulo}</h3>
          <button class="btn btn-primary" onclick="iniciarLeccion(${leccion.id_leccion})">
            Iniciar 🚀
          </button>
        </div>
      `).join("")}
    </div>
  `;
}

function volverAIdiomas() {
  initIdiomas();
}

/* =========================================
   EJERCICIOS
   ========================================= */
async function iniciarLeccion(idLeccion) {
  const titulo = document.getElementById("tituloVista");
  const contenedor = document.getElementById("listaIdiomas");

  titulo.textContent = "Ejercicios";
  contenedor.innerHTML = "Cargando ejercicios...";

  const ejercicios = await apiRequest(`/lecciones/${idLeccion}/ejercicios`);

  contenedor.innerHTML = `
    <button class="btn btn-volver" onclick="verLecciones(${idiomaActual})">← Volver</button>

    ${ejercicios.map(e => `
      <div class="ejercicio-wrapper">
        <h3>${e.pregunta}</h3>
        <div class="opciones-grid">
          ${e.opciones.map(o => `
            <label class="opcion-label">
              <input type="radio" name="ejercicio_${e.id_ejercicio}" value="${o.id_opcion}">
              ${o.texto}
            </label>
          `).join("")}
        </div>
      </div>
    `).join("")}

    <button class="btn btn-enviar" onclick="enviarRespuestas(${idLeccion})">
      Enviar respuestas ✅
    </button>
  `;
}

function volverALecciones() {
  if (idiomaActual) verLecciones(idiomaActual);
}

/* =========================================
   ENVIAR RESPUESTAS
   ========================================= */
async function enviarRespuestas(idLeccion) {
  const ejercicios = document.querySelectorAll(".ejercicio-wrapper");
  const respuestas = [];

  ejercicios.forEach(ej => {
    const input = ej.querySelector("input");
    const idEjercicio = input.name.split("_")[1];
    const seleccionada = ej.querySelector("input:checked");

    if (seleccionada) {
      respuestas.push({
        id_ejercicio: parseInt(idEjercicio),
        id_opcion: parseInt(seleccionada.value)
      });
    }
  });

  try {
    const resultado = await apiRequest(
      `/lecciones/${idLeccion}/responder`,
      { method: "POST", body: JSON.stringify({ respuestas }) }
    );

    alert(`🎉 Puntaje: ${resultado.puntaje}% | Aciertos: ${resultado.aciertos}/${resultado.totalPreguntas}`);

  } catch (error) {
    console.error(error);
    alert("Error al enviar respuestas");
  }
}

/* =========================================
   LOGOUT / UTILS
   ========================================= */
function logout() {
  localStorage.removeItem("token");
  loadView("login");
}

function mostrarUsuario() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const payload = JSON.parse(atob(token.split(".")[1]));
  const span = document.getElementById("usuarioNombre");
  if (span) span.textContent = payload.nombre;
}

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (token) {
    loadView("idiomas");
  } else {
    loadView("login");
  }
});


//panel de administracion admin
function initAdminDashboard() {
  mostrarUsuario();

  const titulo = document.getElementById("tituloVista");
  const menu = document.getElementById("adminMenu");
  const contenido = document.getElementById("adminContenido");

  titulo.textContent = "Panel de Administración";

  // Menú dinámico
  menu.innerHTML = `
    <button class="btn btn-primary" onclick="cargarAdminSeccion('idiomas')">Idiomas</button>
    <button class="btn btn-primary" onclick="cargarAdminSeccion('lecciones')">Lecciones</button>
    <button class="btn btn-primary" onclick="cargarAdminSeccion('ejercicios')">Ejercicios</button>
    <button class="btn btn-primary" onclick="cargarAdminSeccion('usuarios')">Usuarios</button>
  `;

  contenido.innerHTML = "Selecciona una sección";
}

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
        <button class="btn btn-warning" onclick="editarIdioma(${i.id_idioma}, '${i.nombre}', '${i.codigo_iso}')">Editar</button>
        <button class="btn btn-danger" onclick="eliminarIdioma(${i.id_idioma})">Eliminar</button>
      </div>
    `).join("")}
  `;
  break;

    case "usuarios":
      const usuarios = await apiRequest("/admin/usuarios");
      contenido.innerHTML = usuarios.map(u => `
        <div class="card">
          <h3>${u.nombre}</h3>
          <p>${u.correo}</p>
          <p>Rol: ${u.rol}</p>
        </div>
      `).join("");
      break;

    default:
      contenido.innerHTML = "Sección no implementada";
  }
}


//crud admin.
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
      <button class="btn btn-primary" onclick="guardarEdicionIdioma(${id})">
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


window.logout = logout;