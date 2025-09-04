const abecedario = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export default class Rotores {
    static reflectores = new Map([
            ["A", "EJMZALYXVBWFCRQUONTSPIKHGD"],
            ["B", "YRUHQSLDPXNGOKMIEBFZCWVJAT"],
            ["C", "FVPJIAOYEDRZXWGCTKUQSBNMHL"]
        ])
    constructor(rotorIzq, rotorCentral, rotorDer, reflector){
        reflector = reflector.toUpperCase();
        this.nombreReflector = reflector;
        this.rotorIzq = rotorIzq;
        this.rotorCentral = rotorCentral;
        this.rotorDer = rotorDer;
        this.reflector = Rotores.reflectores.get(reflector);
    }

    mostrarConfigActual(){
        const letraIzq = this.rotorIzq.letraActual();
        const letraCen = this.rotorCentral.letraActual();
        const letraDer = this.rotorDer.letraActual();

        return {
            letraIzq: letraIzq,
            letraCen: letraCen,
            letraDer: letraDer
        };
    }

    printConfig(){
        console.log("Reflector: " + this.nombreReflector);
        console.log("Rotor Izquierdo " + this.rotorIzq.getInfo());
        console.log("Rotor Central " + this.rotorCentral.getInfo());
        console.log("Rotor Derecho " + this.rotorDer.getInfo());
        console.log("***********************");
    }

    encriptarLetra(letra){
        if(letra == " ") return letra;

        const rotarIzq = this.rotorCentral.enNotchLetraActual();
        const rotarCentral = this.rotorDer.enNotchLetraActual();


        if(rotarIzq){
            this.rotorCentral.rotar();
            this.rotorIzq.rotar();
        }

        else if (rotarCentral){
            this.rotorCentral.rotar();
        }

        this.rotorDer.rotar();
        let caminoEncriptacion = new Array();

        const posLetra = letra.toUpperCase().charCodeAt() - 65;

        let entradaRotorDer = this.rotorDer.getLetrasAsociadas(posLetra);
        let indiceDer = this.rotorDer.procesarLetra(posLetra, 1, 0);
        let letrasDer = this.rotorDer.getLetrasAsociadas(indiceDer);  //camino a recoorer por la encriptación
        
        let entradaRotorCen = this.rotorCentral.getLetrasAsociadas(indiceDer);
        let indiceCen = this.rotorCentral.procesarLetra(indiceDer, 1, 0);
        let letrasCen = this.rotorCentral.getLetrasAsociadas(indiceCen);
        
        let entradaRotorIzq = this.rotorIzq.getLetrasAsociadas(indiceCen);
        let indiceIzq = this.rotorIzq.procesarLetra(indiceCen, 1, 0);
        let letrasIzq = this.rotorIzq.getLetrasAsociadas(indiceIzq);

        caminoEncriptacion.push(entradaRotorDer, letrasDer, entradaRotorCen, letrasCen, entradaRotorIzq, letrasIzq);

        const letraIngRefl = this.reflector[indiceIzq];
        const letraReflejada = String.fromCharCode(indiceIzq + 65);
        caminoEncriptacion.push([letraIngRefl, letraIngRefl]);
        caminoEncriptacion.push([letraIngRefl, letraIngRefl]);
        caminoEncriptacion.push([letraReflejada, letraReflejada]);

        // console.log([letraIngRefl, letraIngRefl]);
        // console.log([letraIngRefl, letraIngRefl]);
        // console.log([letraReflejada, letraReflejada]);

        const posicionLetra = letraIngRefl.charCodeAt() - 65;

        entradaRotorIzq = this.rotorIzq.getLetrasAsociadas(posicionLetra);
        indiceIzq = this.rotorIzq.procesarLetra(posicionLetra, 0, 1);
        letrasIzq = this.rotorIzq.getLetrasAsociadas(indiceIzq);

        entradaRotorCen = this.rotorCentral.getLetrasAsociadas(indiceIzq);
        indiceCen = this.rotorCentral.procesarLetra(indiceIzq, 0, 1);
        letrasCen = this.rotorCentral.getLetrasAsociadas(indiceCen);

        entradaRotorDer = this.rotorDer.getLetrasAsociadas(indiceCen);
        indiceDer = this.rotorDer.procesarLetra(indiceCen, 0, 1);
        letrasDer = this.rotorDer.getLetrasAsociadas(indiceDer);

        caminoEncriptacion.push(entradaRotorIzq, letrasIzq, entradaRotorCen, letrasCen, entradaRotorDer, letrasDer);

        const letraRotores = abecedario[indiceDer];
        return {
            letraRotores: letraRotores,
            caminoEncriptacion: caminoEncriptacion
        };
    }

    encriptarPalabra(palabra) {
    let mensaje = "";

    for (const letra of palabra) {
        mensaje += this.encriptarLetra(letra);
    }

    console.log("Mensaje encriptado:", mensaje);
    return mensaje;
}



}
