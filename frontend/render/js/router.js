const app = document.getElementById("app");

async function loadView(view) {
  const response = await fetch(`./views/${view}.html`);
  const html = await response.text();
  app.innerHTML = html;

  // Inicializar lógica específica de cada vista
  if (view === "login") {
    initLogin();
  }

  if (view === "idiomas") {
    initIdiomas();
  }
}

window.loadView = loadView;

// Vista inicial
document.addEventListener("DOMContentLoaded", () => {
  loadView("login");
});
