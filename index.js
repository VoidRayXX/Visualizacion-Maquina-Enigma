import Rotor from "./enigma/rotor.js";
import Rotores from "./enigma/mecanismoRotores.js"; 
import Enigma from "./enigma/enigma.js";

const abecedario = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const rotorIzq = new Rotor("Rotor I", "a", "a");
const rotorCentral = new Rotor("Rotor II", "a", "a");
const rotorDer = new Rotor("Rotor III", "a", "a");

const rotores = new Rotores(rotorIzq, rotorCentral, rotorDer, "B");

const enigma = new Enigma(rotores);

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


function dibujarFlecha(origenId, destinoId, svgID) {
    const svg = document.getElementById(svgID);
    svg.innerHTML = ""; // limpiar antes de dibujar otra

    const origen = document.getElementById(origenId).getBoundingClientRect();
    const destino = document.getElementById(destinoId).getBoundingClientRect();

    // obtener posición relativa dentro del documento
    const startX = origen.left + window.scrollX;
    const startY = origen.top + origen.height / 2 + window.scrollY;
    const endX = destino.right + window.scrollX;
    const endY = destino.top + destino.height / 2 + window.scrollY;

    svg.setAttribute("width", document.body.scrollWidth);
    svg.setAttribute("height", document.body.scrollHeight);

    // Definir marcador de flecha
    const defs = `
    <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
        <path d="M0,0 L10,5 L0,10 Z" fill="red" />
        </marker>
    </defs>
    `;

    // Línea con flecha
    const line = `<line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}" 
                stroke="red" stroke-width="2" marker-end="url(#arrow)" />`;

    svg.innerHTML = defs + line;
}


function manejarTecla(letra){
    console.log("Letra Presionada:", letra);
    const {letraEncriptada, caminoEncriptacion} = enigma.encriptarLetra(letra);
    console.log("Letra Encriptada:", letraEncriptada);
    console.log(caminoEncriptacion);
    enigma.mostrarConfigActual();
    // dibujarFlecha("teclado-A", "plugboard-der-B");
    trazarCamino(caminoEncriptacion);
}

function trazarCamino(caminoEncriptacion){
    const camino = [
        "teclado-",
        "plugboard-der-",
        "plugboard-izq-",
        "rotorIII-der-",
        "rotorIII-izq-",
        "rotorII-der-",
        "rotorII-izq-",
        "rotorI-der-",
        "rotorI-izq-"
    ];

    for(let i = 0; i < camino.length - 3; i++){

        //[B,D] D->D; D->otro rotor
        //[D,H]
        
        //camEn[i][0] = B, [i][1] D
        //camEn[i+1][0] = D, [i+1][1] = H

        const origen = camino[i] + caminoEncriptacion[i][1];
        const destino = camino[i+1] + caminoEncriptacion[i+1][0];
        const idFlecha = "flecha" + (i + 1).toString();
        console.log(idFlecha);
        console.log(origen,"->", destino);

        dibujarFlecha(origen, destino, idFlecha);
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

