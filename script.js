// Carga stockIdeal desde localStorage o usa valores por defecto
let stockIdeal = JSON.parse(localStorage.getItem('stockIdeal')) || {
    "Pan de Hamburguesa": 80,
    "Pan de Perro": 70,
    "Pan de Whopper": 60,
    "Pan Frances": 100,
    "Pan de Flor": 80,
    "Pan de Piñita": 60,
    "Pan de Molde": 70,
    "Pan de Leche": 100,
};

let multiplicador = 1;

// Guarda el stockIdeal actualizado en localStorage
function guardarStocks() {
    localStorage.setItem('stockIdeal', JSON.stringify(stockIdeal));
}

// Redondea a la decena superior
function redondearDecena(num) {
    if (num <= 0) return 0; // opcional, para no redondear negativos o cero

    const resto10 = num % 10;
    if (resto10 === 0) {
        // Ya es múltiplo de 10
        return num;
    } else if (resto10 <= 5) {
        // Redondear hacia arriba al múltiplo de 5 más cercano
        return num - resto10 + 5;
    } else {
        // Redondear hacia arriba al múltiplo de 10 siguiente
        return num - resto10 + 10;
    }
}


// Cambiar multiplicador y actualizar botones activos
function cambiarMultiplicador(valor) {
    multiplicador = valor;
    document.querySelectorAll('.botones-multiplicador button').forEach(boton => {
        boton.classList.toggle('activo', parseFloat(boton.textContent) === valor);
    });
}

// Generar tabla editable con inputs para stock ideal y actual
document.addEventListener("DOMContentLoaded", () => {
    const table = document.querySelector("table");
    Object.entries(stockIdeal).forEach(([pan, ideal]) => {
        const row = table.insertRow();
        row.innerHTML = `
            <td>${pan}</td>
            <td><input type="number" id="ideal-${pan.replace(/\s/g, '')}" 
                 value="${ideal}" min="1" class="input-ideal"></td>
            <td><input type="number" id="actual-${pan.replace(/\s/g, '')}" min="0" value="0"></td>
        `;
        // Guardar cambios en stock ideal
        row.querySelector('.input-ideal').addEventListener('change', (e) => {
            stockIdeal[pan] = Math.max(1, parseInt(e.target.value) || 1);
            guardarStocks();
        });
    });
});

// Validar inputs numéricos para que estén entre 0 y 9999
document.addEventListener('input', (e) => {
    if (e.target.type === 'number') {
        if (e.target.value < 0) e.target.value = 0;
        if (e.target.value > 9999) e.target.value = 9999;
    }
});

// Calcular producción necesaria aplicando multiplicador y redondeo
function calcular() {
    let resultadoHTML = "<h2>📋 Producción Necesaria</h2><ul>";
    
    Object.entries(stockIdeal).forEach(([pan, ideal]) => {
        const actual = parseInt(document.getElementById(`actual-${pan.replace(/\s/g, '')}`).value) || 0;
        const produccion = Math.max(0, ideal - actual) * multiplicador;
        const redondeado = redondearDecena(produccion);
        
        resultadoHTML += `
            <li><strong>${pan}:</strong> 
                ${produccion} bolsas → <span class="resaltar">${redondeado}</span> (Bolsas)
            </li>
        `;
    });
    
    resultadoHTML += "</ul>";
    document.getElementById("resultado").innerHTML = resultadoHTML;
}

function imprimir() {
    const ventana = window.open("", "_blank");
    const fecha = new Date().toLocaleString('es-ES');

    let contenido = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Producción ${fecha}</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    width: 58mm; 
                    margin: 0; 
                    padding: 5px; 
                    font-size: 16px; /* aumentado de 14px a 16px */
                }
                h1 { 
                    font-size: 18px; /* aumentado de 16px a 18px */
                    text-align: center; 
                    margin-bottom: 5px; 
                }
                .fecha { 
                    font-size: 12px; /* aumentado de 10px a 12px */
                    text-align: center; 
                    margin-bottom: 15px; 
                    color: #555;
                }
                ul { 
                    padding-left: 20px; 
                    margin: 0; 
                }
                li { 
                    margin-bottom: 8px; 
                }
            </style>
        </head>
        <body>
            <h1>Producción para hoy</h1>
            <div class="fecha">${fecha}</div>
            <ul>
    `;

    Object.entries(stockIdeal).forEach(([pan, ideal]) => {
        const actual = parseInt(document.getElementById(`actual-${pan.replace(/\s/g, '')}`).value) || 0;
        const produccion = Math.max(0, ideal - actual) * multiplicador;
        const redondeado = redondearDecena(produccion);

        contenido += `<li>${pan}: ${redondeado} bolsas</li>`;
    });

    contenido += `
            </ul>
            <p style="text-align:center; margin-top: 15px;">⚡ ¡A hornear se dijo! ⚡</p>
        </body>
        </html>
    `;

    ventana.document.write(contenido);
    ventana.document.close();
    ventana.print();
}


