export default class Plugboard {
    constructor(){
        this.plugboard = new Map();
    }

    eliminarConex(letra){
        if(this.plugboard.has(letra)){
            const antiguaConex = this.plugboard.get(letra);
            this.plugboard.delete(antiguaConex);
            this.plugboard.delete(letra);
        }
    }

    conectarLetras(letra1, letra2){
        letra1 = letra1.toUpperCase();
        letra2 = letra2.toUpperCase();

        this.eliminarConex(letra1);
        this.eliminarConex(letra2);

        this.plugboard.set(letra1, letra2);
        this.plugboard.set(letra2, letra1);
    }

    obtenerLetra(letra){
        letra = letra.toUpperCase();
        if(!this.plugboard.has(letra)){
            return letra;
        }
        return this.plugboard.get(letra);
    }

    mostrarPlugboard(){
        console.log(this.plugboard);
    }

}
