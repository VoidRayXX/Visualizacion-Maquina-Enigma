const svg = document.getElementById("canvas");

// Dibujar flecha entre dos elementos
function dibujarFlecha(origenId, destinoId) {
    svg.innerHTML = ""; // limpiar antes de dibujar otra

    const origen = document.getElementById(origenId).getBoundingClientRect();
    const destino = document.getElementById(destinoId).getBoundingClientRect();

    // obtener posición relativa dentro del documento
    const startX = origen.right + window.scrollX;
    const startY = origen.top + origen.height / 2 + window.scrollY;
    const endX = destino.left + window.scrollX;
    const endY = destino.top + destino.height / 2 + window.scrollY;

    svg.setAttribute("width", document.body.scrollWidth);
    svg.setAttribute("height", document.body.scrollHeight);

    // Definir marcador de flecha
    const defs = `
    <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
        <path d="M0,0 L10,5 L0,10 Z" fill="red" />
        </marker>
    </defs>
    `;

    // Línea con flecha
    const line = `<line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}" 
                stroke="red" stroke-width="2" marker-end="url(#arrow)" />`;

    svg.innerHTML = defs + line;
}

// Ejemplo inicial: A → J
dibujarFlecha("A", "J");

// Si clickeas una letra del teclado, apunte a otra fija (ej: L)
document.querySelectorAll(".tecla").forEach(tecla => {
    tecla.addEventListener("click", () => {
    dibujarFlecha(tecla.id, "K"); // aquí cambias "L" por cualquier destino
    });
});