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


async function initIdiomas() {
  const contenedor = document.getElementById("listaIdiomas");

  contenedor.innerHTML = "Cargando...";

  try {
    const idiomas = await apiRequest("/idiomas");

    contenedor.innerHTML = idiomas.map(idioma => `
      <div class="card">
        <h3>${idioma.nombre}</h3>
        <p>Código ISO: ${idioma.codigo_iso}</p>

        <progress value="0" max="100"></progress>

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


window.logout = logout;

