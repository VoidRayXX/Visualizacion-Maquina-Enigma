import Rotor from "./enigma/rotor.js";
import Rotores from "./enigma/mecanismoRotores.js"; 
import Enigma from "./enigma/enigma.js";

const abecedario = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const rotorIzq = new Rotor("Rotor I", "a", "a");
const rotorCentral = new Rotor("Rotor II", "a", "a");
const rotorDer = new Rotor("Rotor III", "a", "a");

const rotores = new Rotores(rotorIzq, rotorCentral, rotorDer, "B");

const enigma = new Enigma(rotores);
// enigma.conectarLetras("B", "H");

const configuraciones = new Map([
    ["rotorI", ["EKMFLGDQVZNTOWYHXUSPAIBRCJ", "Q"]],
    ["rotorII", ["AJDKSIRUXBLHWTMCQGZNPYFVOE", "E"]],
    ["rotorIII", ["BDFHJLCPRTXVZNYEIWGAKMUSQO", "V"]],
    ["rotorIV", ["ESOVPZJAYQUIRHXLNFTGKDCMWB", "J"]],
    ["rotorV", ["VZBRGITYUPSDNHLXAWMJQOFECK", "Z"]],
    ["A", ["EJMZALYXVBWFCRQUONTSPIKHGD", null]],
    ["reflectorB", ["YRUHQSLDPXNGOKMIEBFZCWVJAT", null]],
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

    // obtener posición relativa dentro del documento
    const startY = origen.top + origen.height / 2 + window.scrollY;
    const endY = destino.top + destino.height / 2 + window.scrollY;

    let startX, endX;
    if(sentido === "ida"){
        startX = origen.left + window.scrollX;
        endX = destino.right + window.scrollX;
    } else {
        startX = origen.right + window.scrollX;
        endX = destino.left + window.scrollX;
    }

    svg.setAttribute("width", document.body.scrollWidth);
    svg.setAttribute("height", document.body.scrollHeight);

    // Supongamos que "id" es el número de tu flecha
    const id = parseInt(svgID.split("flecha")[1]);

    // Definir color dinámico según condición
    const color = id > 9 ? "blue" : "red";

    // defs con color dinámico
    const defs = `
    <defs>
        <marker id="arrow${id}" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
        <path d="M0,0 L10,5 L0,10 Z" fill="${color}" />
        </marker>
    </defs>
    `;

    // Línea con stroke dinámico
    const line = `
    <line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}" 
            stroke="${color}" stroke-width="2" marker-end="url(#arrow${id})" />
    `;

    // Pintar en el SVG
    svg.innerHTML = defs + line;

}

let ultimoCamino = null;
function manejarTecla(letra = null, encriptar = false){
    console.log("Letra Presionada:", letra);
    if (encriptar){
        const {letraEncriptada, caminoEncriptacion} = enigma.encriptarLetra(letra);
        ultimoCamino = caminoEncriptacion;
        console.log("Letra Encriptada:", letraEncriptada);
        // console.log(caminoEncriptacion);
        // enigma.mostrarConfigActual();
        trazarCamino(caminoEncriptacion);
    } else{
        trazarCamino(ultimoCamino);
    }
    
}

function trazarCamino(caminoEncriptacion){
    const camino = [
        "plugboard-der-",
        "plugboard-izq-",
        "rotorIII-der-",
        "rotorIII-izq-",
        "rotorII-der-",
        "rotorII-izq-",
        "rotorI-der-",
        "rotorI-izq-",
        "reflectorB-der-",
        "reflectorB-izq-",
        "reflectorB-der-",
        "rotorI-izq-",
        "rotorI-der-",
        "rotorII-izq-",
        "rotorII-der-",
        "rotorIII-izq-",
        "rotorIII-der-",
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

function crearColumna(columna, secuencia, textoID, esTeclado = false){
    for(let letra of secuencia){
        const span = document.createElement("span");
        span.textContent = letra;
        span.id = textoID + letra;

        if(esTeclado){
            span.classList.add("tecla");
            span.addEventListener("click", () => {
                manejarTecla(letra, true);
            });
        }
        columna.append(span);
    }
}

function crearRotor(nombreRotor){
    const rotor = document.getElementById(nombreRotor);
    const columnaIzq = rotor.querySelectorAll("div")[0];
    const columnaDer = rotor.querySelectorAll("div")[1];
    const [secuencia, notch] = configuraciones.get(nombreRotor)

    crearColumna(columnaIzq, abecedario, nombreRotor+"-izq-");
    crearColumna(columnaDer, secuencia, nombreRotor+"-der-")
}

const teclado = document.getElementById("teclado").querySelector("div");
crearColumna(teclado, abecedario, "teclado-", true);

crearRotor("plugboard");
crearRotor("reflectorB");    //reflector B
crearRotor("rotorI");
crearRotor("rotorII");
crearRotor("rotorIII");

const contenedor = document.getElementById("svgs");
for (let i = 0; i < 20; i++) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("flechas");
    svg.setAttribute("id", "flecha" + i);
    contenedor.appendChild(svg);
}

// Redibujar al redimensionar la ventana
window.addEventListener("resize", () => {
    // Limpia todos los SVGs
    for (let i = 0; i < 20; i++) {
        const svg = document.getElementById("flecha" + i);
        if (svg) svg.innerHTML = "";
    }

    // 👇 vuelve a trazar el camino de la última letra presionada
    if (ultimoCamino) {
        manejarTecla();
    }
});
