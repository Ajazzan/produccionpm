// Carga stockIdeal desde localStorage o usa valores por defecto
let stockIdeal = JSON.parse(localStorage.getItem('stockIdeal')) || {
    // Panes de comida rápida
    "Pan de Hamburguesa": 30,
    "Pan de Perro": 20,
    "Pan de Whopper": 10,
    
    // Panes de panadería
    "Pan Frances": 75,
    "Pan de Flor": 5,
    "Pan de Piñita": 5,
    "Pan de Molde": 6,
    "Pan de Leche": 10,
    "Pan Canilla x4": 15,
    "Pan Dulce Largo": 5
};

let multiplicadorPanaderia = 1;
let multiplicadorRapida = 1;

// Guardar stocks en localStorage
function guardarStocks() {
    localStorage.setItem('stockIdeal', JSON.stringify(stockIdeal));
}

// Redondeo especializado para producción
function redondearDecena(num) {
    if (num <= 0) return 0;
    const resto10 = num % 10;
    return resto10 <= 5 ? num - resto10 + 5 : num - resto10 + 10;
}

// Inicializar la interfaz
document.addEventListener("DOMContentLoaded", () => {
    const table = document.getElementById("inventoryTable");
    const bakeryMultipliers = document.getElementById("bakeryMultipliers");
    const fastfoodMultipliers = document.getElementById("fastfoodMultipliers");

    // Generar tabla de inventario
    Object.entries(stockIdeal).forEach(([pan, ideal]) => {
        const row = table.insertRow();
        row.innerHTML = `
            <td>${pan}</td>
            <td><input type="number" id="ideal-${pan.replace(/\s/g, '')}" 
                 value="${ideal}" min="1" class="input-ideal"></td>
            <td><input type="number" id="actual-${pan.replace(/\s/g, '')}" 
                 min="0" value="0" placeholder="0"></td>
        `;
        
        // Guardar cambios en stock ideal
        row.querySelector('.input-ideal').addEventListener('change', (e) => {
            stockIdeal[pan] = Math.max(1, parseInt(e.target.value) || 1);
            guardarStocks();
        });
    });

    // Generar botones de multiplicadores
    const multipliers = [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5];
    multipliers.forEach(mult => {
        // Para panadería
        bakeryMultipliers.innerHTML += `
            <button class="multiplier-btn ${mult === 1 ? 'active-pan' : ''}" 
                    onclick="cambiarMultiplicadorPanaderia(${mult})">
                ${mult}x
            </button>
        `;
        
        // Para comida rápida
        fastfoodMultipliers.innerHTML += `
            <button class="multiplier-btn ${mult === 1 ? 'active-rapid' : ''}" 
                    onclick="cambiarMultiplicadorRapida(${mult})">
                ${mult}x
            </button>
        `;
    });

    // Cargar valores guardados de bolsas actuales
    document.querySelectorAll('input[id^="actual-"]').forEach(input => {
        const savedValue = localStorage.getItem(input.id);
        if (savedValue) input.value = savedValue;
    });
});

// Cambiar multiplicador panadería
function cambiarMultiplicadorPanaderia(valor) {
    multiplicadorPanaderia = valor;
    document.querySelectorAll('#bakeryMultipliers .multiplier-btn').forEach(btn => {
        btn.classList.remove('active-pan');
        if (parseFloat(btn.textContent) === valor) {
            btn.classList.add('active-pan');
        }
    });
    calcular();
}

// Cambiar multiplicador comida rápida
function cambiarMultiplicadorRapida(valor) {
    multiplicadorRapida = valor;
    document.querySelectorAll('#fastfoodMultipliers .multiplier-btn').forEach(btn => {
        btn.classList.remove('active-rapid');
        if (parseFloat(btn.textContent) === valor) {
            btn.classList.add('active-rapid');
        }
    });
    calcular();
}

// Validación de inputs
document.addEventListener('input', (e) => {
    if (e.target.type === 'number') {
        let value = parseInt(e.target.value) || 0;
        value = Math.max(0, Math.min(value, 9999));
        e.target.value = value;
        
        // Guardar automáticamente los stocks actuales
        if (e.target.id.startsWith('actual-')) {
            localStorage.setItem(e.target.id, value);
        }
    }
});

// Calcular producción
function calcular() {
    const panesRapida = ["Pan de Hamburguesa", "Pan de Perro", "Pan de Whopper"];
    let resultadoHTML = `
        <h3><i class="fas fa-clipboard-check"></i> Producción Requerida</h3>
        <div class="result-grid">
            <div class="result-header">Tipo de Pan</div>
            <div class="result-header">Bolsas</div>
    `;

    let totalBolsas = 0;
    
    Object.entries(stockIdeal).forEach(([pan, ideal]) => {
        const actual = parseInt(document.getElementById(`actual-${pan.replace(/\s/g, '')}`).value) || 0;
        let produccion = Math.max(0, ideal - actual);
        
        // Aplicar multiplicador correspondiente
        produccion *= panesRapida.includes(pan) ? multiplicadorRapida : multiplicadorPanaderia;
        
        const redondeado = redondearDecena(produccion);
        totalBolsas += redondeado;
        
        resultadoHTML += `
            <div class="result-item">${pan}</div>
            <div class="result-quantity highlight">${redondeado}</div>
        `;
    });
    
    resultadoHTML += `
            <div class="result-total">TOTAL</div>
            <div class="result-total highlight">${totalBolsas} bolsas</div>
        </div>
        <p class="result-notes">
            <i class="fas fa-info-circle"></i> Valores redondeados al múltiplo de 5 superior.
        </p>
    `;
    
    document.getElementById("resultado").innerHTML = resultadoHTML;
}

function imprimir() {
    const ventana = window.open("", "_blank");
    const fecha = new Date().toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const mensajes = [
        "¡Precisión ante todo! Cada gramo cuenta.",
        "Calidad constante es la clave del éxito.",
        "Las desviaciones impactan negativamente tu bono.",
        "La consistencia es lo que nos diferencia.",
        "Masa bien preparada, cliente satisfecho.",
        "El secreto está en el tiempo de fermentación.",
        "Las desviaciones impactan tu bono."
    ];
    const mensajeAleatorio = mensajes[Math.floor(Math.random() * mensajes.length)];

    const panesRapida = ["Pan de Hamburguesa", "Pan de Perro", "Pan de Whopper"];

    let contenido = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Producción ${fecha}</title>
            <style>
                @page { 
                    size: 58mm auto; 
                    margin: 0;
                }
                body {
                    font-family: Arial, sans-serif;
                    width: 58mm;
                    margin: 0;
                    padding: 5px;
                    font-size: 16px;
                }
                .header {
                    text-align: center;
                    font-weight: bold;
                    font-size: 17px;
                    margin-bottom: 3px;
                }
                .fecha {
                    text-align: center;
                    font-size: 12px;
                    margin-bottom: 8px;
                }
                .item {
                    margin-bottom: 5px;
                    border-bottom: 1px dashed #eee;
                    padding-bottom: 3px;
                }
                .mensaje {
                    text-align: center;
                    font-style: italic;
                    margin-top: 10px;
                    font-size: 14px;
                }
            </style>
        </head>
        <body>
            <div class="header">PRODUCCIÓN DIARIA</div>
            <div class="fecha">${fecha}</div>
    `;

    Object.entries(stockIdeal).forEach(([pan, ideal]) => {
        const actual = parseInt(document.getElementById(`actual-${pan.replace(/\s/g, '')}`).value) || 0;
        let produccion = Math.max(0, ideal - actual);
        
        produccion *= panesRapida.includes(pan) ? multiplicadorRapida : multiplicadorPanaderia;
        const redondeado = redondearDecena(produccion);
        
        contenido += `
            <div class="item">
                <strong>${pan}:</strong> ${redondeado} bolsas
            </div>
        `;
    });

    contenido += `
            <div class="mensaje">
                ${mensajeAleatorio}
            </div>
        </body>
        </html>
    `;

    ventana.document.write(contenido);
    ventana.document.close();
    ventana.print();
}

// Sistema de ayuda (complementario al HTML)
function mostrarAyuda(tema) {
    const temas = {
        calculo: "El sistema calcula: (Stock Ideal - Stock Actual) × Multiplicador, luego redondea al múltiplo de 5 superior.",
        redondeo: "Redondeamos siempre hacia arriba: 11→15, 16→20, etc. Esto optimiza la producción.",
        multiplicadores: "Use 1.5x para fines de semana, 2x para festivos. Ajuste independientemente por categoría."
    };
    
    alert(temas[tema] || "Ayuda no disponible para este tema");
}
