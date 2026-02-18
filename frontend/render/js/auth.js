let idiomaActual = null;

function initLogin() {
  const btn = document.getElementById("loginBtn");

  btn.addEventListener("click", login);
}

async function login() {
  const correo = document.getElementById("correo").value;
  const password = document.getElementById("password").value;

  if (!correo || !password) {
    alert("Completa todos los campos");
    return;
  }

  const response = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ correo, password })
  });

  const data = await response.json();

  if (response.ok) {
    localStorage.setItem("token", data.token);
    loadView("idiomas"); // 🔥 cambiamos vista dinámicamente
  } else {
    alert(data.mensaje);
  }
}

function mostrarRegistro() {

  const contenedor = document.getElementById("app");

  contenedor.innerHTML = `
    <h2>Registro</h2>
    <input type="email" id="nombreRegistro" placeholder="Nombre">
    <input type="email" id="correoRegistro" placeholder="Correo">
    <input type="password" id="passwordRegistro" placeholder="Contraseña">

    <button onclick="register()">Crear cuenta</button>

    <button onclick="loadView('login')">
      Volver al login
    </button>
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
      headers: {
        "Content-Type": "application/json"
      },
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

async function initIdiomas() {
  mostrarUsuario();

  const titulo = document.getElementById("tituloVista");
  const contenedor = document.getElementById("listaIdiomas");

  titulo.textContent = "Idiomas disponibles";
  contenedor.innerHTML = "Cargando...";

  try {
    const idiomas = await apiRequest("/idiomas/progreso");

    contenedor.innerHTML = idiomas.map(idioma => `
      <div class="card">
        <h3>${idioma.nombre}</h3>
        <p>Código ISO: ${idioma.codigo_iso}</p>

        <div class="barra">
          <div class="progreso" style="width:${idioma.porcentaje ?? 0}%">
            ${idioma.porcentaje ?? 0}%
          </div>
        </div>

        <button onclick="verLecciones(${idioma.id_idioma})">
          Ver lecciones
        </button>
      </div>
    `).join("");

  } catch (error) {
    console.error(error);
    contenedor.innerHTML = "Error al cargar idiomas";
  }
}




async function verLecciones(idIdioma) {

  const titulo = document.getElementById("tituloVista");
  const contenedor = document.getElementById("listaIdiomas");

  titulo.textContent = "Lecciones";

  idiomaActual = idIdioma;
  contenedor.innerHTML = "Cargando lecciones...";

  const lecciones = await apiRequest(`/lecciones?idioma=${idIdioma}`);

  contenedor.innerHTML = `
    <button onclick="volverAIdiomas()">Volver</button>

    ${lecciones.map(leccion => `
      <div class="card">
        <h3>${leccion.titulo}</h3>
        <button onclick="iniciarLeccion(${leccion.id_leccion})">
          Iniciar
        </button>
      </div>
    `).join("")}
  `;
}


function volverAIdiomas() {
  initIdiomas();
}


async function iniciarLeccion(idLeccion) {

  const titulo = document.getElementById("tituloVista");
  const contenedor = document.getElementById("listaIdiomas");

  titulo.textContent = "Ejercicios de la lección";

  contenedor.innerHTML = "Cargando lección...";

  const ejercicios = await apiRequest(`/lecciones/${idLeccion}/ejercicios`);

  contenedor.innerHTML = `
    <button onclick="verLecciones(${idiomaActual})">
      Volver
    </button>

    ${ejercicios.map(e => `
      <div class="ejercicio">
        <h3>${e.pregunta}</h3>
        ${e.opciones.map(o => `
          <label>
            <input type="radio"
                   name="ejercicio_${e.id_ejercicio}"
                   value="${o.id_opcion}">
            ${o.texto}
          </label><br>
        `).join("")}
      </div>
    `).join("")}

    <button onclick="enviarRespuestas(${idLeccion})">
      Enviar respuestas
    </button>
  `;
}


function volverALecciones() {
  if (idiomaActual) {
    verLecciones(idiomaActual);
  }
}


async function enviarRespuestas(idLeccion) {

  const ejercicios = document.querySelectorAll(".ejercicio");
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
      {
        method: "POST",
        body: JSON.stringify({ respuestas })
      }
    );

    alert(`Puntaje: ${resultado.puntaje}%`);

  } catch (error) {
    console.error(error);
    alert("Error al enviar respuestas");
  }
}

function logout() {
  localStorage.removeItem("token");
  loadView("login");
}

document.addEventListener("DOMContentLoaded", () => {

  const token = localStorage.getItem("token");

  if (token) {
    loadView("idiomas");
  } else {
    loadView("login");
  }

});

function mostrarUsuario() {

  const token = localStorage.getItem("token");
  if (!token) return;

  const payload = JSON.parse(atob(token.split(".")[1]));
  console.log("Payload del token:", payload);

  const span = document.getElementById("usuarioNombre");

  if (span) {
    span.textContent = `Bienvenido, ${payload.nombre}`;
  }
}
/*
async function cargarIdiomas() {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:3000/api/idiomas/progreso", {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    const idiomas = await response.json();

    const contenedor = document.getElementById("listaIdiomas");
    contenedor.innerHTML = "";

    idiomas.forEach(idioma => {
        contenedor.innerHTML += `
            <div class="idioma-card">
                <h3>${idioma.nombre}</h3>
                <div class="barra">
                    <div class="progreso" style="width:${idioma.porcentaje}%">
                        ${idioma.porcentaje}%
                    </div>
                </div>
            </div>
        `;
    });
}
*/

window.logout = logout;

