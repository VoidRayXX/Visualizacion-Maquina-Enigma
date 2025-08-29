import Rotor from "./rotor.js";
import Rotores from "./mecanismoRotores.js";
import Enigma from "./enigma.js";

function dividirEnBloques(texto, tamaño = 5) {
    const textoSinEspacios = texto.replace(/ /g, "");
    const bloques = [];

    for (let i = 0; i < textoSinEspacios.length; i += tamaño) {
        bloques.push(textoSinEspacios.slice(i, i + tamaño));
    }

    return bloques.join(" ");
}

const rotorIzq = new Rotor("Rotor I", "a", "a");
const rotorCentral = new Rotor("Rotor II", "a", "a");
const rotorDer = new Rotor("Rotor III", "a", "a");

const rotores = new Rotores(rotorIzq, rotorCentral, rotorDer, "B");

const enigma = new Enigma(rotores);
let mensaje = "A";
// for(let i = 0; i < 18; i++) mensaje += "A";
// enigma.conectarLetras("A", "H");
enigma.encriptarMensaje(mensaje);
enigma.mostrarConfigActual();
