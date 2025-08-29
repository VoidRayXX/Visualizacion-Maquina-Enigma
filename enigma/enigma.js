import Plugboard from "./plugboard.js";

export default class Enigma {
    constructor(rotores){
        this.rotores = rotores;
        this.plugboard = new Plugboard();
    }

    conectarLetras(letra1, letra2){
        this.plugboard.conectarLetras(letra1, letra2);
    }

    encriptarLetra(letra){
        const letraPgb = this.plugboard.obtenerLetra(letra);
        const {letraRotores, caminoEncriptacion} = this.rotores.encriptarLetra(letraPgb);
        const letraEncriptada = this.plugboard.obtenerLetra(letraRotores);
        
        caminoEncriptacion.splice(0, 0, [letra, letraPgb]);
        caminoEncriptacion.push(letraEncriptada);

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
        this.rotores.mostrarConfigActual();
    }

}
