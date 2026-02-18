async function login() {
  const correo = document.getElementById("correo").value;
  const password = document.getElementById("password").value;

  const response = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      correo: correo,
      password: password
    })
  });

  const data = await response.json();
  console.log(data);
}
