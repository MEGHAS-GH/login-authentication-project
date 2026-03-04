// ================= CONTAINER CONTROL =================

const container = document.getElementById("container");
const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

// Switch to Register panel
showRegister.addEventListener("click", () => {
  container.classList.add("active");
});

// Switch to Login panel
showLogin.addEventListener("click", () => {
  container.classList.remove("active");
});

// ================= WIFI PASSWORD TOGGLE =================

function togglePassword(id, element) {
  const input = document.getElementById(id);

  if (input.type === "password") {
    input.type = "text";
    element.classList.add("active");
  } else {
    input.type = "password";
    element.classList.remove("active");
  }
}

// ================= REGISTER =================

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("registerUsername").value;
  const password = document.getElementById("registerPassword").value;

  const response = await fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  const message = document.getElementById("registerMessage");

  message.textContent = data.message;

  if (data.message === "Registration successful") {
    message.style.color = "lime";

    // Auto slide back to login after success
    setTimeout(() => {
      container.classList.remove("active");
      message.textContent = "";
      document.getElementById("registerForm").reset();
    }, 1200);

  } else {
    message.style.color = "red";
  }
});

// ================= LOGIN =================

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  const response = await fetch("https://meg-login-authentication-project.onrender.com", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  const message = document.getElementById("loginMessage");

  if (data.success) {
    message.textContent = "Login Successful!";
    message.style.color = "lime";

    setTimeout(() => {
      window.location.href = "https://www.netflix.com";
    }, 1500);

  } else {
    message.textContent = "Invalid Credentials";
    message.style.color = "red";
  }
});