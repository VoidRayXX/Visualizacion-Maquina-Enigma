import Rotor from "./enigma/rotor.js";
import Rotores from "./enigma/mecanismoRotores.js"; 
import Enigma from "./enigma/enigma.js";

const abecedario = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

let rotorIzq = new Rotor("I", "a", "a");
let rotorCentral = new Rotor("II", "a", "a");
let rotorDer = new Rotor("III", "a", "a");

let rotores = new Rotores(rotorIzq, rotorCentral, rotorDer, "B");

let enigma = new Enigma(rotores);
// enigma.conectarLetras("B", "H");

const letrasEncriptadas = [];
const letrasOriginales = [];

const configuraciones = new Map([
    ["I", ["EKMFLGDQVZNTOWYHXUSPAIBRCJ", "Q"]],
    ["II", ["AJDKSIRUXBLHWTMCQGZNPYFVOE", "E"]],
    ["III", ["BDFHJLCPRTXVZNYEIWGAKMUSQO", "V"]],
    ["IV", ["ESOVPZJAYQUIRHXLNFTGKDCMWB", "J"]],
    ["V", ["VZBRGITYUPSDNHLXAWMJQOFECK", "Z"]],
    ["A", ["EJMZALYXVBWFCRQUONTSPIKHGD", null]],
    ["B", ["YRUHQSLDPXNGOKMIEBFZCWVJAT", null]],
    ["C", ["FVPJIAOYEDRZXWGCTKUQSBNMHL", null]],
    ["plugboard", [abecedario, null]]
]);


function dividirEnBloques(texto, tamaño = 5) {
    const textoSinEspacios = texto.replace(/ /g, "");
    const bloques = [];

    for (let i = 0; i < textoSinEspacios.length; i += tamaño) {
        bloques.push(textoSinEspacios.slice(i, i + tamaño));
    }

    return bloques.join(" ");
}


function dibujarFlecha(origenId, destinoId, svgID, sentido) {
    const svg = document.getElementById(svgID);
    svg.innerHTML = ""; // limpiar antes de dibujar otra

    const origen = document.getElementById(origenId).getBoundingClientRect();
    const destino = document.getElementById(destinoId).getBoundingClientRect();

    // Coordenadas relativas al viewport (sin scroll)
    const startY = origen.top + origen.height / 2;
    const endY = destino.top + destino.height / 2;

    let startX, endX;
    if(sentido === "ida"){
        startX = origen.left;
        endX = destino.right;
    } else {
        startX = origen.right;
        endX = destino.left;
    }

    // Tamaño del viewport
    svg.setAttribute("width", window.innerWidth);
    svg.setAttribute("height", window.innerHeight);

    const id = parseInt(svgID.split("flecha")[1]);

    let color; 
    if(id < 9){
        color = "red";
    } else if(id < 11){
        color = "green";
    } else {
        color = "blue";
    }

    const defs = `
    <defs>
        <marker id="arrow${id}" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
        <path d="M0,0 L10,5 L0,10 Z" fill="${color}" />
        </marker>
    </defs>
    `;

    const line = `
    <line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}" 
            stroke="${color}" stroke-width="2" marker-end="url(#arrow${id})" />
    `;

    svg.innerHTML = defs + line;
}

let ultimoCamino = null;
function manejarTecla(letra){
    const {letraEncriptada, caminoEncriptacion} = enigma.encriptarLetra(letra);
    ultimoCamino = caminoEncriptacion;
    trazarCamino(caminoEncriptacion);
    agregarLetraASentencia(letraEncriptada, "textoEncriptado", false);
    agregarLetraASentencia(letra, "textoOriginal", true);
    mostrarConfigActual();
    // enigma.printConfig();
    actualizarRotoresVisuales();
}

function actualizarRotoresVisuales(){
    actualizarRotorVisual("rotorDer", enigma.rotores.rotorDer);
    actualizarRotorVisual("rotorCentral", enigma.rotores.rotorCentral);
    actualizarRotorVisual("rotorIzq", enigma.rotores.rotorIzq);
}

function agregarLetraASentencia(letra, divID, original) {
    const textoSentencia = document.getElementById(divID);
    let texto;
    if(original){
        letrasOriginales.push(letra);
        texto = letrasOriginales.join(" ");
    }
    else {
        letrasEncriptadas.push(letra);
        texto = letrasEncriptadas.join(" ");
    }

    textoSentencia.innerHTML = texto + ' <span class="cursor-parpadeante">&nbsp;_</span>';
}


function trazarCamino(caminoEncriptacion){
    const camino = [
        "plugboard-der-",
        "plugboard-izq-",
        "rotorDer-der-",
        "rotorDer-izq-",
        "rotorCentral-der-",
        "rotorCentral-izq-",
        "rotorIzq-der-",
        "rotorIzq-izq-",
        "reflector-der-",
        "reflector-izq-",
        "reflector-der-",
        "rotorIzq-izq-",
        "rotorIzq-der-",
        "rotorCentral-izq-",
        "rotorCentral-der-",
        "rotorDer-izq-",
        "rotorDer-der-",
        "plugboard-izq-",
        "plugboard-der-",
    ];

    let sentido = "ida";
    const inputUsuario = caminoEncriptacion[0][0];
    const origenInicial = "teclado-" + inputUsuario;
    const destinoInicial = "plugboard-der-" + inputUsuario;
    const idFlechaInicial = "flecha0";
    dibujarFlecha(origenInicial, destinoInicial, idFlechaInicial, sentido);

    for(let i = 0; i < caminoEncriptacion.length - 1; i++){
        let columnaOrigen = 1;
        let columnaDestino = 0;

        if(i % 2 != 0){
            columnaOrigen = 0;
            columnaDestino = 1;
        };

        const origen = camino[i] + caminoEncriptacion[i][columnaOrigen];
        const destino = camino[i+1] + caminoEncriptacion[i+1][columnaDestino];
        const idFlecha = "flecha" + (i + 1).toString();
        // console.log(idFlecha);
        // console.log(origen,"->", destino);

        if(i > 8){
            sentido = "vuelta";
        }

        dibujarFlecha(origen, destino, idFlecha, sentido);
    }

    const letraEncriptada = caminoEncriptacion[caminoEncriptacion.length - 1][0];
    const origenFinal = "plugboard-der-" + letraEncriptada;
    const destinoFinal = "teclado-" + letraEncriptada;
    const idFlechaFinal = "flecha19";
    dibujarFlecha(origenFinal, destinoFinal, idFlechaFinal, sentido);

}

function borrarSVGs(){
    //Limpia todos los SVGs
    for (let i = 0; i < 20; i++) {
        const svg = document.getElementById("flecha" + i);
        if (svg) svg.innerHTML = "";
    }
}

function borrarSentencias(){
    const encriptado = document.getElementById("textoEncriptado");
    const original = document.getElementById("textoOriginal");

    encriptado.innerHTML = ' <span class="cursor-parpadeante">&nbsp;_</span>';
    original.innerHTML = ' <span class="cursor-parpadeante">&nbsp;_</span>';
    letrasEncriptadas.length = 0;
    letrasOriginales.length = 0;
}

function reiniciarPag(){
    borrarSVGs();
    ultimoCamino = null;
    borrarSentencias();
}

function mostrarConfigActual(){
    const {letraIzq, letraCen, letraDer} = enigma.mostrarConfigActual();
    const rotorIzq = document.getElementById("letraIzq");
    const rotorCen = document.getElementById("letraCen");
    const rotorDer = document.getElementById("letraDer");

    rotorDer.textContent = letraDer;
    rotorCen.textContent = letraCen;
    rotorIzq.textContent = letraIzq;
}

function cambiarConfigEnigma(){
    const letraIzq = document.getElementById("letraIzq").textContent;
    const letraCen = document.getElementById("letraCen").textContent;
    const letraDer = document.getElementById("letraDer").textContent;

    const selects = document.querySelectorAll(".rotor-group select");
    let [reflector, rotorIzq, rotorCentral, rotorDer] = Array.from(selects).map(sel => sel.value);
    
    //variables globales
    rotorIzq = new Rotor(rotorIzq, letraIzq, "a");
    rotorCentral = new Rotor(rotorCentral, letraCen, "a");
    rotorDer = new Rotor(rotorDer, letraDer, "a");

    rotores = new Rotores(rotorIzq, rotorCentral, rotorDer, reflector);
    enigma = new Enigma(rotores);
}

function actualizarConfig(event){
    const boton = event.target;
    const direccion = boton.textContent;
    const rotor = boton.closest('.rotor-enigma');
    const ventana = rotor.querySelector('.window');

    const letraActual = ventana.textContent;
    let posLetra = letraActual.charCodeAt() - 65;
    if(direccion === "+") posLetra++;
    else posLetra--;

    posLetra = (posLetra + 26) % 26;
    const nuevaLetra = abecedario[posLetra];
    ventana.textContent = nuevaLetra;
    cambiarConfigEnigma();
    reiniciarPag();

    actualizarRotoresVisuales();

}

function actualizarRotorVisual(rotorID, rotorObj) {
    const rotorDiv = document.getElementById(rotorID);
    const columnas = rotorDiv.querySelectorAll("div");

    const columnaIzq = columnas[0].querySelectorAll("span");
    const columnaDer = columnas[1].querySelectorAll("span");

    const abecedarioRotado = 
        abecedario.slice(rotorObj.posInicial) + abecedario.slice(0, rotorObj.posInicial);

    const mapeo = rotorObj.rotor.map(pair => pair[1]).join("");
    const mapeoRotado = 
        mapeo.slice(rotorObj.posInicial) + mapeo.slice(0, rotorObj.posInicial);

    // reasignar letras en la columna izquierda
    for (let i = 0; i < 26; i++) {
        columnaIzq[i].textContent = abecedarioRotado[i];
    }

    // reasignar letras en la columna derecha
    for (let i = 0; i < 26; i++) {
        columnaDer[i].textContent = mapeoRotado[i];
    }
}


function crearColumna(columna, secuencia, textoID, esTeclado = false){
    for(let letra of secuencia){
        const span = document.createElement("span");
        span.textContent = letra;
        span.id = textoID + letra;

        if(esTeclado){
            span.classList.add("tecla");
            span.addEventListener("click", () => {
                manejarTecla(letra);
            });
        }
        columna.append(span);
    }
}


function crearRotor(posRotor, nombreRotor){
    let rotor = document.getElementById(posRotor);

    const columnaIzq = rotor.querySelectorAll("div")[0];
    const columnaDer = rotor.querySelectorAll("div")[1];

    // Aplica animación de giro
    columnaIzq.classList.add("rotor-columna", "girar");
    columnaDer.classList.add("rotor-columna", "girar");

    columnaIzq.innerHTML = "";
    columnaDer.innerHTML = "";

    const [secuencia, notch] = configuraciones.get(nombreRotor);

    // Crea nuevo contenido
    crearColumna(columnaIzq, abecedario, posRotor+"-izq-");
    crearColumna(columnaDer, secuencia, posRotor+"-der-");

    // Quita animación para mostrar nuevo contenido
    columnaIzq.classList.remove("girar");
    columnaDer.classList.remove("girar");
}


const teclado = document.getElementById("teclado").querySelector("div");
crearColumna(teclado, abecedario, "teclado-", true);

crearRotor("plugboard", "plugboard");
crearRotor("reflector", "B");    //reflector B
crearRotor("rotorIzq", "I");
crearRotor("rotorCentral", "II");
crearRotor("rotorDer", "III");

const contenedor = document.getElementById("svgs");
for (let i = 0; i < 20; i++) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("flechas");
    svg.setAttribute("id", "flecha" + i);
    contenedor.appendChild(svg);
}

document.querySelectorAll('.rotor-enigma button').forEach(boton => {
  boton.addEventListener('click', event => {
    actualizarConfig(event);
  });
});

const selects = document.querySelectorAll(".rotor-group select");

// Recorre cada uno y le agrega un listener
selects.forEach(sel => {
  sel.addEventListener("change", (e) => {
    const grupo = e.target.closest(".rotor-group");
    const reflector = grupo?.dataset.reflector;

    const nombreReflector = e.target.value;

    reiniciarPag();

    if(reflector)  crearRotor("reflector", nombreReflector);

    cambiarConfigEnigma();

    actualizarRotoresVisuales();
  });
});

document.querySelectorAll(".rotor-enigma .window").forEach(win => {
  win.addEventListener("input", () => {
    let val = win.textContent.toUpperCase().replace(/[^A-Z]/g, "");
    win.textContent = val.slice(-1) || "A"; // siempre 1 letra
    cambiarConfigEnigma();
    reiniciarPag();
    actualizarRotoresVisuales();
  });
});

// Redibujar al redimensionar la ventana
window.addEventListener("resize", () => {
    borrarSVGs();

    // vuelve a trazar el camino de la última letra presionada
    if (ultimoCamino) {
        trazarCamino(ultimoCamino);
    }
});

window.addEventListener("scroll", () => {
    borrarSVGs();
    
    // Redibujar el camino si existe
    if (ultimoCamino) {
        trazarCamino(ultimoCamino);
    }
});

