// Inicio de validaciones//
document.addEventListener("DOMContentLoaded", () => {
  const jugadores = document.querySelectorAll(".jugadores");
  const iniciarJuego = document.getElementById("iniciar-juego");

  const validarCampos = () => {
    let validado = true;
    let jugadorNombre;

    for (let i = 0; i < jugadores.length; i++) {
      jugadorNombre = jugadores[i].value.trim();

      if (
        jugadorNombre === "" ||
        jugadorNombre.length < 3 ||
        jugadorNombre.length > 20 ||
        !/^[a-zA-Z\s]+$/.test(jugadorNombre)
      ) {
        validado = false;
        break;
      }
    }

    const matrizSeleccionada = document.getElementById("matriz-selector");
    const matrizValue = matrizSeleccionada.value.trim();

    if (matrizValue === "") {
      validado = false;
    }

    if (validado) {
      iniciarJuego.setAttribute("data-validado", "true");
      iniciarJuego.removeAttribute("disabled");
    } else {
      iniciarJuego.setAttribute("data-validado", "false");
      iniciarJuego.setAttribute("disabled", "");
    }
  };

  jugadores.forEach((jugador) =>
    jugador.addEventListener("input", validarCampos)
  );
  document
    .getElementById("matriz-selector")
    .addEventListener("change", validarCampos);
  iniciarJuego.addEventListener("click", () => {
    if (iniciarJuego.getAttribute("data-validado") === "true") {
      const tamanio = document.getElementById("matriz-selector").value;
      localStorage.setItem("tamanio", tamanio);
      window.location.href = "jugador1.html";
    }
  });
});
// Final de validaciones//

//Generar la matriz//
function generarMatriz(tamanio) {
  const carton = document.getElementById("carton");
  carton.innerHTML = "";
  const numeros = new Set();

  while (numeros.size < tamanio * tamanio) {
    numeros.add(Math.floor(Math.random() * 50) + 1);
  }

  const arrayNumeros = Array.from(numeros);
  for (let i = 0; i < tamanio; i++) {
    const fila = document.createElement("tr");
    for (let j = 0; j < tamanio; j++) {
      const celda = document.createElement("td");
      celda.textContent = arrayNumeros.shift();
      fila.appendChild(celda);
    }
    carton.appendChild(fila);
  }
}

window.onload = () => {
  const tamanio = localStorage.getItem("tamanio");
  if (tamanio) {
    generarMatriz(parseInt(tamanio));
  }
};

document.getElementById("matriz-selector").addEventListener("change", () => {
  const tamanio = document.getElementById("matriz-selector").value;
  localStorage.setItem("tamanio", tamanio);
  window.location.href = "jugador1.html";
});
//Termino de generar la matriz//

// Generar un numero //
function generarNumeroAleatorio() {
  const numeroAleatorio = Math.floor(Math.random() * 50) + 1;
  const carton = document.getElementById("carton");
  const celdas = carton.getElementsByTagName("td");

  for (let i = 0; i < celdas.length; i++) {
    if (celdas[i].textContent == numeroAleatorio) {
      celdas[i].classList.add("seleccionado");
      break;
    }
  }
  mostrarNumero(numeroAleatorio);

  function mostrarNumero(numero) {
    const mensaje = document.createElement("h2");
    mensaje.textContent = `Número generado: ${numero}`;
    document.body.appendChild(mensaje);

    setTimeout(() => {
      document.body.removeChild(mensaje);
    }, 5000);
  }
}
// Termino de generar numero //

// Puntajes //

// Función para verificar si se ha completado una línea horizontal, vertical o diagonal
function verificarLinea(matriz, numero) {
  for (let i = 0; i < matriz.length; i++) {
    let fila = matriz[i];
    let columna = [];
    for (let j = 0; j < fila.length; j++) {
      columna.push(matriz[j][i]);
    }
    if (fila.includes(numero) || columna.includes(numero)) {
      return true;
    }
  }
  if (
    matriz[0][0] === numero &&
    matriz[1][1] === numero &&
    matriz[2][2] === numero
  ) {
    return true;
  }
  if (
    matriz[0][2] === numero &&
    matriz[1][1] === numero &&
    matriz[2][0] === numero
  ) {
    return true;
  }
  return false;
}

// Función para calcular el puntaje de la matriz
function calcularPuntaje(matriz) {
  let puntaje = 0;
  if (verificarCartonLleno(matriz)) {
    puntaje += 5;
  }
  if (verificarLinea(matriz, matriz[0][0])) {
    puntaje += 1;
  }
  if (verificarLinea(matriz, matriz[0][1])) {
    puntaje += 1;
  }
  if (verificarLinea(matriz, matriz[0][2])) {
    puntaje += 1;
  }
  if (verificarLinea(matriz, matriz[1][0])) {
    puntaje += 1;
  }
  if (verificarLinea(matriz, matriz[1][1])) {
    puntaje += 3; // Se suman 3 puntos por línea diagonal
  }
  if (verificarLinea(matriz, matriz[1][2])) {
    puntaje += 1;
  }
  if (verificarLinea(matriz, matriz[2][0])) {
    puntaje += 1;
  }
  if (verificarLinea(matriz, matriz[2][1])) {
    puntaje += 1;
  }
  if (verificarLinea(matriz, matriz[2][2])) {
    puntaje += 1;
  }
  return puntaje;
}

// Función para actualizar el puntaje y las victorias de cada jugador
function actualizarPuntaje(jugador, puntaje) {
  let victorias = JSON.parse(localStorage.getItem(jugador)) || {
    victorias: 0,
    puntaje: 0,
  };
  victorias.puntaje += puntaje;
  victorias.victorias++;
  localStorage.setItem(jugador, JSON.stringify(victorias));
}

// Función para verificar si el cartón está lleno
function verificarCartonLleno(matriz) {
  for (let i = 0; i < matriz.length; i++) {
    for (let j = 0; j < matriz[i].length; j++) {
      if (!matriz[i][j]) {
        return false;
      }
    }
  }
  return true;
}

function mostrarPuntaje() {
  let tablaPuntajeBody = document.getElementById("tabla-puntaje-body");
  tablaPuntajeBody.innerHTML = "";

  for (let i = 1; i <= 4; i++) {
    let jugador = `jugador${i}`;
    let victorias = JSON.parse(localStorage.getItem(jugador)) || {
      victorias: 0,
      puntaje: 0,
    };

    let fila = document.createElement("tr");
    fila.innerHTML = `
      <td>Jugador ${i}</td>
      <td>${victorias.victorias}</td>
      <td>${victorias.puntaje}</td>
    `;
    tablaPuntajeBody.appendChild(fila);
  }

  document.getElementById("puntaje").style.display = "block";
  document.getElementById("ocultar-puntaje").disabled = false;
  document.getElementById("verificar-linea").disabled = true;
}

function ocultarPuntaje() {
  document.getElementById("puntaje").style.display = "none";
  document.getElementById("verificar-linea").disabled = false;
  document.getElementById("mostrar-puntaje").disabled = false;
}

function obtenerMatriz(carton) {
  const filas = carton.getElementsByTagName("tr");
  const matriz = Array.from(filas).map((fila) => {
    const celdas = fila.getElementsByTagName("td");
    return Array.from(celdas).map((celda) => parseInt(celda.textContent));
  });
  return matriz;
}

let jugadorActivo = null;

function obtenerJugadorActivo() {
  return jugadorActivo;
}

function seleccionarJugador(numeroJugador) {
  jugadorActivo = `jugador${numeroJugador}`;
}
