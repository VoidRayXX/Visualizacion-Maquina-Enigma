const abecedario = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export default class Rotor {
    static rotores = new Map([
        ["I", ["EKMFLGDQVZNTOWYHXUSPAIBRCJ", "Q"]],
        ["II", ["AJDKSIRUXBLHWTMCQGZNPYFVOE", "E"]],
        ["III", ["BDFHJLCPRTXVZNYEIWGAKMUSQO", "V"]],
        ["IV", ["ESOVPZJAYQUIRHXLNFTGKDCMWB", "J"]],
        ["V", ["VZBRGITYUPSDNHLXAWMJQOFECK", "Z"]]
    ]);

    constructor(nombreRotor, posInicial, offset){
        posInicial = posInicial.toUpperCase().charCodeAt() - 65;

        this.nombreRotor = nombreRotor;
        this.posInicial = posInicial;

        this.offset = offset.toUpperCase().charCodeAt() - 65;

        const [orden, notch] = Rotor.rotores.get(nombreRotor);
        this.notch = notch;
        this.rotor = new Array();
        for(let i = 0; i < abecedario.length; i++){
            this.rotor.push([abecedario[i], orden[i]]);
        }
    }

    getPosicion(){
        return this.posInicial;
    }

    getLetrasAsociadas(posicionLetra){
        const posReal = ((this.posInicial + posicionLetra - this.offset) % 26 + 26) % 26;
        return this.rotor[posReal];
    }

    buscarIndiceLetra(columna, letraBuscada){
        let indiceEncontrado = -1;
        for(const [i, tupla] of this.rotor.entries()){
            if(tupla[columna] === letraBuscada){
                indiceEncontrado = i;
                break;
            }
        }
        const indice = ((indiceEncontrado - this.posInicial + this.offset) % 26 + 26) % 26;
        return indice;
    }

    
    getInfo(){
        return "(" + this.nombreRotor + ")" + ": " + this.letraActual();
    }

    rotar(){
        this.posInicial = (this.posInicial + 1) % 26;
    }

    letraActual(){
        return String.fromCharCode(this.posInicial + 65);
    }

    enNotchLetraActual(){
        const letraActual = this.letraActual();
        return letraActual === this.notch;
    }

    procesarLetra(indice, columna, buscarEn){
        const letras = this.getLetrasAsociadas(indice);
        const letra = letras[columna];
        return this.buscarIndiceLetra(buscarEn, letra);
    }

}

