import Rotor from "./enigma/rotor.js";
import Rotores from "./enigma/mecanismoRotores.js"; 
import Enigma from "./enigma/enigma.js";

const abecedario = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

let rotorIzq = new Rotor("I", "A", "A");
let rotorCentral = new Rotor("II", "A", "A");
let rotorDer = new Rotor("III", "A", "A");

let rotores = new Rotores(rotorIzq, rotorCentral, rotorDer, "B");

let enigma = new Enigma(rotores);

const letrasEncriptadas = [];
const letrasOriginales = [];

const rotorSettings = ["A", "A", "A"];
const ringSettings = ["A", "A", "A"];
let modoRings = false;

const diccPosiciones = new Map([
    ["letraIzq", 0],
    ["letraCen", 1],
    ["letraDer", 2],
]);

const configuraciones = new Map([
    ["I", ["EKMFLGDQVZNTOWYHXUSPAIBRCJ", "Q"]],
    ["II", ["AJDKSIRUXBLHWTMCQGZNPYFVOE", "E"]],
    ["III", ["BDFHJLCPRTXVZNYEIWGAKMUSQO", "V"]],
    ["IV", ["ESOVPZJAYQUIRHXLNFTGKDCMWB", "J"]],
    ["V", ["VZBRGITYUPSDNHLXAWMJQOFECK", "Z"]],
    ["B", ["YRUHQSLDPXNGOKMIEBFZCWVJAT", null]],
    ["C", ["FVPJIAOYEDRZXWGCTKUQSBNMHL", null]],
    ["plugboard", [abecedario, null]]
]);

function indicarPosRotor(id){
    const posRotor = diccPosiciones.get(id);
    return posRotor;
}


function dibujarFlecha(origenId, destinoId, svgID, sentido) {
    const svg = document.getElementById(svgID);
    svg.innerHTML = ""; //limpiar antes de dibujar otra

    const origen = document.getElementById(origenId).getBoundingClientRect();
    const destino = document.getElementById(destinoId).getBoundingClientRect();

    //Coordenadas relativas al viewport
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

    //Tamaño del viewport
    svg.setAttribute("width", window.innerWidth);
    svg.setAttribute("height", window.innerHeight);

    const id = parseInt(svgID.split("flecha")[1]);

    let color; 
    if(id < 9){
        color = "#FF4444";        
    } else if(id < 11){
        color = "#44FF88";        
    } else {
        color = "#4488FF";        
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
    actualizarRotoresVisuales();
    mostrarConfigActual();

    trazarCamino(caminoEncriptacion);
    agregarLetraASentencia(letraEncriptada, "textoEncriptado", false);
    agregarLetraASentencia(letra, "textoOriginal", true);
}

function mostrarConfigActual(){
    const {letraIzq, letraCen, letraDer} = enigma.mostrarConfigActual();

    rotorSettings[0] = letraIzq;
    rotorSettings[1] = letraCen;
    rotorSettings[2] = letraDer;

    if(!modoRings){
        const rotorIzq = document.getElementById("letraIzq");
        const rotorCen = document.getElementById("letraCen");
        const rotorDer = document.getElementById("letraDer");

        rotorDer.textContent = letraDer;
        rotorCen.textContent = letraCen;
        rotorIzq.textContent = letraIzq;
    }   
}

function actualizarRotoresVisuales(){
    actualizarRotorVisual("rotorDer", enigma.rotores.rotorDer);
    actualizarRotorVisual("rotorCentral", enigma.rotores.rotorCentral);
    actualizarRotorVisual("rotorIzq", enigma.rotores.rotorIzq);
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

    //reasignar letras en la columna izquierda
    for (let i = 0; i < 26; i++) {
        columnaIzq[i].textContent = abecedarioRotado[i];
    }

    //reasignar letras en la columna derecha
    for (let i = 0; i < 26; i++) {
        columnaDer[i].textContent = mapeoRotado[i];
    }
}

function dividirEnBloques(texto, tamaño = 5) {
    const textoSinEspacios = texto.replace(/ /g, "");
    const bloques = [];

    for (let i = 0; i < textoSinEspacios.length; i += tamaño) {
        bloques.push(textoSinEspacios.slice(i, i + tamaño));
    }

    return bloques.join(" ");
}

function agregarLetraASentencia(letra, divID, original) {
    const textoSentencia = document.getElementById(divID);
    let texto;

    if (original) {
        letrasOriginales.push(letra);
        texto = letrasOriginales.join("");
    } else {
        letrasEncriptadas.push(letra);
        texto = letrasEncriptadas.join("");
    }

    const textoEnBloques = dividirEnBloques(texto);
    textoSentencia.innerHTML = textoEnBloques + ' <span class="cursor-parpadeante">&nbsp;_</span>';
}

function obtenerIndiceLetraRotor(letra, nombreRotor = "" , columna = null){
    nombreRotor = nombreRotor.split("-")[0];
    let rotor;
    if(nombreRotor === "rotorDer") rotor = enigma.rotores.rotorDer;
    else if(nombreRotor === "rotorCentral") rotor = enigma.rotores.rotorCentral;
    else if(nombreRotor === "rotorIzq") rotor = enigma.rotores.rotorIzq;
    else if(nombreRotor === "reflector") return enigma.rotores.reflector.indexOf(letra);
    else return abecedario.indexOf(letra);

    return rotor.buscarIndiceLetra(columna, letra);
}


function trazarCamino(caminoEncriptacion) {
    const camino = [
        "plugboard-der",
        "plugboard-izq",
        "rotorDer-der",
        "rotorDer-izq",
        "rotorCentral-der",
        "rotorCentral-izq",
        "rotorIzq-der",
        "rotorIzq-izq",
        "reflector-der",
        "reflector-izq",
        "reflector-der",
        "rotorIzq-izq",
        "rotorIzq-der",
        "rotorCentral-izq",
        "rotorCentral-der",
        "rotorDer-izq",
        "rotorDer-der",
        "plugboard-izq",
        "plugboard-der",
    ];

    let sentido = "ida";
    const inputUsuario = caminoEncriptacion[0][0];
    const origenInicial = "teclado-" + obtenerIndiceLetraRotor(inputUsuario);
    const destinoInicial = "plugboard-der-" + obtenerIndiceLetraRotor(inputUsuario);
    const idFlechaInicial = "flecha0";
    dibujarFlecha(origenInicial, destinoInicial, idFlechaInicial, sentido);

    for (let i = 0; i < caminoEncriptacion.length - 1; i++) {
        let columnaOrigen = 1;
        let columnaDestino = 0;

        if (i % 2 != 0) {
            columnaOrigen = 0;
            columnaDestino = 1;
        }

        //obtener letras del camino
        const letraOrigen = caminoEncriptacion[i][columnaOrigen];
        const letraDestino = caminoEncriptacion[i + 1][columnaDestino];

        //convertir letras a índices basados en la posición fija del elemento
        const indiceOrigen = obtenerIndiceLetraRotor(letraOrigen, camino[i], columnaOrigen);
        const indiceDestino = obtenerIndiceLetraRotor(letraDestino, camino[i+1], columnaDestino);

        //usar índices para construir los IDs
        const origen = camino[i] + "-" + indiceOrigen;
        const destino = camino[i + 1] + "-" + indiceDestino;
        const idFlecha = "flecha" + (i + 1).toString();

        if (i > 8) {
            sentido = "vuelta";
        }

        dibujarFlecha(origen, destino, idFlecha, sentido);
    }

    const letraEncriptada = caminoEncriptacion[caminoEncriptacion.length - 1][0];
    const origenFinal = "plugboard-der-" + obtenerIndiceLetraRotor(letraEncriptada);
    const destinoFinal = "teclado-" + obtenerIndiceLetraRotor(letraEncriptada);
    const idFlechaFinal = "flecha19";
    dibujarFlecha(origenFinal, destinoFinal, idFlechaFinal, sentido);
}

function borrarSVGs(){
    //limpia todos los SVGs
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


function cambiarConfigEnigma(){
    const letraIzq = rotorSettings[0];
    const letraCen = rotorSettings[1];
    const letraDer = rotorSettings[2];

    const selects = document.querySelectorAll(".rotor-group select");
    let [reflector, rotorIzq, rotorCentral, rotorDer] = Array.from(selects).map(sel => sel.value);
    
    //llamar a variables globales
    rotorIzq = new Rotor(rotorIzq, letraIzq, ringSettings[0]);
    rotorCentral = new Rotor(rotorCentral, letraCen, ringSettings[1]);
    rotorDer = new Rotor(rotorDer, letraDer, ringSettings[2]);

    rotores = new Rotores(rotorIzq, rotorCentral, rotorDer, reflector);
    enigma = new Enigma(rotores);
}

function actualizarConfig(event){
    const boton = event.target;
    const direccion = boton.textContent;
    const rotor = boton.closest('.rotor-enigma');
    const ventana = rotor.querySelector('.window');
    const idVentana = ventana.id;

    const letraActual = ventana.textContent;
    let posLetra = letraActual.charCodeAt() - 65;
    if(direccion === "+") posLetra++;
    else posLetra--;

    posLetra = (posLetra + 26) % 26;
    const nuevaLetra = abecedario[posLetra];
    ventana.textContent = nuevaLetra;

    const posRotor = indicarPosRotor(idVentana);

    //aquí cambia según el modo, ring settings o rotor settigs
    if (modoRings) ringSettings[posRotor] = nuevaLetra;
    else rotorSettings[posRotor] = nuevaLetra;
    
    cambiarConfigEnigma();
    reiniciarPag();
    actualizarRotoresVisuales();
    
}



function crearColumna(columna, secuencia, textoID, esTeclado = false){
    let numFilas = 0;
    for(let letra of secuencia){
        const span = document.createElement("span");
        span.textContent = letra;
        span.id = textoID + String(numFilas);

        if(esTeclado){
            span.classList.add("tecla");
            span.addEventListener("click", () => {
                manejarTecla(letra);
            });
        }
        
        columna.append(span);
        numFilas++;
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

    crearColumna(columnaIzq, abecedario, posRotor+"-izq-");
    crearColumna(columnaDer, secuencia, posRotor+"-der-");
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

//Le agrega un listener a cada selector de rotor settings
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

function mostrarRingSettings() {
    const letraIzq = document.getElementById("letraIzq");
    const letraCen = document.getElementById("letraCen");
    const letraDer = document.getElementById("letraDer");

    letraIzq.textContent = ringSettings[0];
    letraCen.textContent = ringSettings[1];
    letraDer.textContent = ringSettings[2];
}



const botonRingSettings = document.querySelector('.ring-settings');
botonRingSettings.addEventListener('click', () => {
    modoRings = !modoRings;
    if (modoRings) {
        botonRingSettings.textContent = "< Rotor Settings";
        const titulo = document.querySelector(".rotors-title");
        titulo.textContent = "Ring Settings (Ringstellung)";
        selects.forEach(sel => sel.classList.add("desactivado"));
        mostrarRingSettings();

    } else {
        botonRingSettings.textContent = "Ring Settings >";
        const titulo = document.querySelector(".rotors-title");
        titulo.textContent = "Rotor Settings (Walzenlage)";
        selects.forEach(sel => sel.classList.remove("desactivado"));
        mostrarConfigActual(); //vuelve a mostrar las posiciones normales
    }
});



//esto es para input manual de configuraciones
document.querySelectorAll(".rotor-enigma .window").forEach(win => {
  win.addEventListener("input", () => {
    let val = win.textContent.toUpperCase().replace(/[^A-Z]/g, "");
    const contenido = val.slice(-1) || "A"; //muestre el valor válido (sólo 1 letra), y si no hay, "A"
    win.textContent = contenido;
    const idVentana = win.id;
    const posRotor = indicarPosRotor(idVentana);

    if (modoRings) ringSettings[posRotor] = contenido;
    else rotorSettings[posRotor] = contenido;

    cambiarConfigEnigma();
    reiniciarPag();
    actualizarRotoresVisuales();
  });
});



const coloresPlugboard = [
  "#FF1744",  // Rojo vibrante
  "#00E676",  // Verde lima
  "#2196F3",  // Azul brillante  
  "#FF9100",  // Naranja intenso
  "#E91E63",  // Rosa fucsia
  "#00BCD4",  // Cian
  "#FFEB3B",  // Amarillo brillante
  "#9C27B0",  // Púrpura
  "#FF5722",  // Naranja rojizo
  "#4CAF50"   // Verde intenso
];


function cambiarColorBotones(letra1, letra2){
    const boton1 = [...document.querySelectorAll(".plugboard-button")]
    .find(btn => btn.textContent.trim() === letra1);
    const boton2 = [...document.querySelectorAll(".plugboard-button")]
    .find(btn => btn.textContent.trim() === letra2);

    //Asignar color desde la lista
    const color = coloresPlugboard[colorIndex % coloresPlugboard.length];
    boton1.style.backgroundColor = color;
    boton2.style.backgroundColor = color;
}

function eliminarConex(letra1){
    const letra2 = enigma.plugboard.obtenerLetra(letra1);

    const boton1 = [...document.querySelectorAll(".plugboard-button")]
    .find(btn => btn.textContent.trim() === letra1);
    const boton2 = [...document.querySelectorAll(".plugboard-button")]
    .find(btn => btn.textContent.trim() === letra2);

    boton1.classList.remove("seleccionado");
    boton1.style.backgroundColor = "";
    boton2.classList.remove("seleccionado");
    boton2.style.backgroundColor = "";

    enigma.plugboard.eliminarConex(letra1);
}

let seleccionados = [];
let colorIndex = 0;
let numConexiones = 0;

document.querySelectorAll(".plugboard-button").forEach((boton) => {
  boton.addEventListener("click", () => {
    let letra;
    if(numConexiones < 10) letra = boton.textContent.trim();
    else return;

    if(boton.classList.contains("seleccionado")){
        eliminarConex(letra);
        numConexiones--;
        reiniciarPag();
        return;
    }

    if(seleccionados.includes(letra)) {
        seleccionados = [];
        boton.classList.remove("seleccionado");
        boton.style.backgroundColor = "";
        return;
    }

    seleccionados.push(letra);
    boton.classList.add("seleccionado");

    if(seleccionados.length === 2 && numConexiones < 11) {
        const [letra1, letra2] = seleccionados;
        enigma.conectarLetras(letra1, letra2);

        cambiarColorBotones(letra1, letra2);
        colorIndex++;
       
        seleccionados = [];
        numConexiones++;
        reiniciarPag();
    }
  });
});

let selectedFile = null;
let encryptedContent = null;

//Referencias DOM sección Upload File
const uploadAreaCompact = document.getElementById('uploadAreaCompact');
const fileInputCompact = document.getElementById('fileInputCompact');
const uploadPlaceholder = document.getElementById('uploadPlaceholder');
const encryptBtnCompact = document.getElementById('encryptBtnCompact');
const downloadBtnCompact = document.getElementById('downloadBtnCompact');
const clearBtnCompact = document.getElementById('clearBtnCompact');

//Event listeners para drag & drop
uploadAreaCompact.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadAreaCompact.classList.add('dragover');
});

uploadAreaCompact.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadAreaCompact.classList.remove('dragover');
});

uploadAreaCompact.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadAreaCompact.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelect(files[0]);
    }
});

//Event listener para click en área de carga
uploadAreaCompact.addEventListener('click', () => {
    fileInputCompact.click();
});

//Event listener para selección de archivo
fileInputCompact.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
    }
});

//Función para manejar selección de archivo
function handleFileSelect(file) {
    if (!file.name.toLowerCase().endsWith('.txt')) {
        alert('Please select only .txt files');
        return;
    }
    
    selectedFile = file;
    uploadPlaceholder.innerHTML = `<div class="file-selected">${file.name}</div>`;
    uploadPlaceholder.classList.add('fade-in');
    
    //Habilitar botón de encriptar
    encryptBtnCompact.style.opacity = '1';
    encryptBtnCompact.style.cursor = 'pointer';
}

//Event listener para botón encriptar
encryptBtnCompact.addEventListener('click', () => {
    if (!selectedFile) {
        alert('Please select a file first');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        encryptedContent = encriptarMensaje(content);
        
        //Mostrar botón de descarga
        downloadBtnCompact.classList.add('active');
        uploadPlaceholder.innerHTML = `<div class="file-selected">✅ ${selectedFile.name} encriptado</div>`;
    };
    reader.readAsText(selectedFile);
});

//Event listener para botón descargar
downloadBtnCompact.addEventListener('click', () => {
    if (!encryptedContent) return;
    
    const blob = new Blob([encryptedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'encrypted_' + selectedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

//Event listener para botón limpiar
clearBtnCompact.addEventListener('click', () => {
    selectedFile = null;
    encryptedContent = null;
    fileInputCompact.value = '';
    uploadPlaceholder.innerHTML = 'Drag or click here';
    uploadPlaceholder.classList.remove('fade-in');
    downloadBtnCompact.classList.remove('active');
    encryptBtnCompact.style.opacity = '0.7';
    encryptBtnCompact.style.cursor = 'default';
});

function encriptarMensaje(texto) {
    let textoEncriptado = "";
    for(let letra of texto){
        const {letraEncriptada, caminoEncriptacion} = enigma.encriptarLetra(letra);
        textoEncriptado += letraEncriptada;
    }
    mostrarConfigActual();
    return textoEncriptado;
}

//Inicialización
encryptBtnCompact.style.opacity = '0.7';
encryptBtnCompact.style.cursor = 'default';

//Redibujar al redimensionar la ventana
window.addEventListener("resize", () => {
    borrarSVGs();

    //vuelve a trazar el camino de la última letra presionada
    if (ultimoCamino) {
        trazarCamino(ultimoCamino);
    }
});

window.addEventListener("scroll", () => {
    borrarSVGs();
    
    //Redibujar el camino si existe
    if (ultimoCamino) {
        trazarCamino(ultimoCamino);
    }
});

document.getElementById("reajustar1").click();
document.getElementById("reajustar2").click();