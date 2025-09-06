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

        if(this.plugboard.has(letra1)){
            const antiguaConex = this.plugboard.get(letra1);
            this.plugboard.delete(antiguaConex);
            this.plugboard.delete(letra1);
        }

        if(this.plugboard.has(letra2)){
            const antiguaConex = this.plugboard.get(letra2);
            this.plugboard.delete(antiguaConex);
            this.plugboard.delete(letra2);
        }

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
