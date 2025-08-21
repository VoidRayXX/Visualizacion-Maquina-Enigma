const abecedario = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

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

function crearColumna(columna, secuencia){
    for(letra of secuencia){
        const span = document.createElement("span");
        span.textContent = letra;
        columna.append(span);
    }
}

function crearRotor(nombreRotor){
    const rotor = document.getElementById(nombreRotor);
    const columnaIzq = rotor.querySelectorAll("div")[0];
    const columnaDer = rotor.querySelectorAll("div")[1];
    const [secuencia, notch] = configuraciones.get(nombreRotor)

    crearColumna(columnaIzq, abecedario);
    crearColumna(columnaDer, secuencia)
}

const teclado = document.getElementById("teclado").querySelector("div");
crearColumna(teclado, abecedario);

crearRotor("plugboard");

crearRotor("reflectorB");    //reflector B

crearRotor("rotorI");
crearRotor("rotorII");
crearRotor("rotorIII");

