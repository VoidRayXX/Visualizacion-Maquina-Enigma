const abecedario = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export default class Rotor {
    //nombre rotor, [cableado, letra de notch/muesca]
    static rotores = new Map([
        ["I", ["EKMFLGDQVZNTOWYHXUSPAIBRCJ", "Q"]],
        ["II", ["AJDKSIRUXBLHWTMCQGZNPYFVOE", "E"]],
        ["III", ["BDFHJLCPRTXVZNYEIWGAKMUSQO", "V"]],
        ["IV", ["ESOVPZJAYQUIRHXLNFTGKDCMWB", "J"]],
        ["V", ["VZBRGITYUPSDNHLXAWMJQOFECK", "Z"]]
    ]);

    //ocupamos una lista de tuplas como representación de los rotores. la cual en sí se mantiene fija, lo que va variando es la variable 
    //self.posInicial, que nos indica en que posición estaría la cabeza del rotor/lista, y da vueltas de forma cíclica
    constructor(nombreRotor, posInicial, offset){
        posInicial = posInicial.toUpperCase().charCodeAt() - 65;

        this.nombreRotor = nombreRotor;
        this.posInicial = posInicial;   //posicion interna, que indica cual es la tupla en el índice 0

        //con offset, me refiero al efecto que tienen los anillos (o ring settings) en la máquina, que hacen que cambie en la práctica
        //el par que se consideraría a la cabeza de la lista. por ello, se incluye en las ecuaciones para ver que impacto aplica.
        //si es el offset es de 0 (A) entonces no cambia nada
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

    //retorna la tupla que corresponde con la letra presionada, de acuerdo a la configuración de la máquina
    getLetrasAsociadas(posicionLetra){
        const posReal = ((this.posInicial + posicionLetra - this.offset) % 26 + 26) % 26;
        return this.rotor[posReal];
    }

    //columna = 0 = izq; columna = 1 = derecha
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

    //Indica en qué letra está actualmente el rotor (posición visible); esto no se ve afectado por el offset.
    //Nota: "notch" se refiere a la posición de giro del rotor (turnover position) en la máquina Enigma.

    // La posición visible del rotor indica la letra que se muestra en la ventana del rotor de la máquina Enigma. Esta posición representa el estado externo del rotor, es decir, lo que el operador ve y ajusta manualmente.
    // El offset (desplazamiento interno) se utiliza para calcular cómo se realiza la sustitución eléctrica dentro del rotor, afectando la codificación real. Sin embargo, el offset no cambia la letra que aparece en la ventana del rotor; solo modifica la forma en que las señales eléctricas se procesan internamente.
    // La posición visible es una representación física y externa, mientras que el offset es un ajuste lógico e interno para la codificación. Por eso, la posición visible no se ve afectada por el offset.
    enNotchLetraActual(){
        const letraActual = this.letraActual();
        return letraActual === this.notch;
    }

    //columna indica si se buscará la letra izq (0) o derecha (1)
    //buscar_en indica donde se buscará, izq (0) o der (1)
    procesarLetra(indice, columna, buscarEn){
        const letras = this.getLetrasAsociadas(indice);
        const letra = letras[columna];
        return this.buscarIndiceLetra(buscarEn, letra);
    }

}

