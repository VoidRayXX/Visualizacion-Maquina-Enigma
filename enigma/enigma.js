import Plugboard from "./plugboard.js";

export default class Enigma {
    constructor(rotores){
        this.rotores = rotores;
        this.plugboard = new Plugboard();
    }

    conectarLetras(letra1, letra2){
        this.plugboard.conectarLetras(letra1, letra2);
        // console.log(`Conectado: ${letra1} ↔ ${letra2}`);
    }

    encriptarLetra(letra){
        if(!letra.match(/[a-zA-Z]/)) return{
            letraEncriptada: letra,
            caminoEncriptacion: null,
        }

        const letraPgb = this.plugboard.obtenerLetra(letra);
        const {letraRotores, caminoEncriptacion} = this.rotores.encriptarLetra(letraPgb);
        const letraEncriptada = this.plugboard.obtenerLetra(letraRotores);
        
        caminoEncriptacion.splice(0, 0, [letra, letra]);
        caminoEncriptacion.splice(1, 0, [letra, letraPgb]);
        
        caminoEncriptacion.push([letraRotores, letraEncriptada]);
        caminoEncriptacion.push([letraEncriptada, letraEncriptada]);

        return {
            letraEncriptada: letraEncriptada,
            caminoEncriptacion: caminoEncriptacion
        };
    }

    // encriptarMensaje(mensaje){
    //     let mensajeEncriptado = "";
    //     for(let letra of mensaje){
    //         const letraPgb = this.plugboard.obtenerLetra(letra);
    //         const {letraRotores, caminoEncriptacion} = this.rotores.encriptarLetra(letraPgb);
    //         const letraEncriptada = this.plugboard.obtenerLetra(letraRotores);
    //         mensajeEncriptado += letraEncriptada;
    //     }
    //     return {
    //         letraEncriptada: mensajeEncriptado,
    //         caminoEncriptacion: caminoEncriptacion
    //     };
    // }

    mostrarConfigActual(){
        return this.rotores.mostrarConfigActual();
    }

    printConfig(){
        this.rotores.printConfig();

        const offsetIzq = String.fromCharCode(this.rotores.rotorIzq.offset + 65);
        const offsetCentral = String.fromCharCode(this.rotores.rotorCentral.offset + 65);
        const offsetDer = String.fromCharCode(this.rotores.rotorDer.offset + 65);

        console.log("Anillo Izquierdo: " + offsetIzq);
        console.log("Anillo Central: " + offsetCentral);
        console.log("Anillo Derecho: " + offsetDer);

        console.log("***********************");
    }

}
