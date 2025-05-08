// Stock IDEAL predefinido (puedes modificarlo)
const stockIdeal = {
    "Pan Frances": 100,
    "Pan de Hamburguesa": 80,
    "Pan de Whopper": 60,
    "Pan de Molde": 70,
    "Pan de Leche": 100,
    "Pan de Flor": 80,
    "Pan de Piñita": 60,
    "Pan de Perro": 70
};

// Función para redondear a la decena superior (61 → 70)
function redondearDecena(num) {
    return Math.ceil(num / 10) * 10;
}

// Generar la tabla dinámicamente
document.addEventListener("DOMContentLoaded", () => {
    const table = document.querySelector("table");
    Object.entries(stockIdeal).forEach(([pan, ideal]) => {
        const row = table.insertRow();
        row.innerHTML = `
            <td>${pan}</td>
            <td>${ideal}</td>
            <td><input type="number" id="${pan.replace(/\s/g, '')}" min="0"></td>
        `;
    });
});


let multiplicador = 1; // Valor por defecto

function cambiarMultiplicador(valor) {
    multiplicador = valor;
    document.querySelectorAll('.botones-multiplicador button').forEach(boton => {
        boton.classList.remove('activo');
        if (parseFloat(boton.textContent) === valor) {
            boton.classList.add('activo');
        }
    });
}


// Calcular producción
function calcular() {
    let resultadoHTML = "<h2>📋 Producción Necesaria</h2><ul>";
    
    Object.entries(stockIdeal).forEach(([pan, ideal]) => {
        const actual = parseInt(document.getElementById(pan.replace(/\s/g, '')).value) || 0;
        const produccion = Math.max(0, ideal - actual) * multiplicador; // Aplica el multiplicador
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

// Imprimir (solo el resultado)
function imprimir() {
    const ventana = window.open("", "_blank");
    let contenido = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Producción Diaria</title>
            <style>
                body { 
                    font-family: Arial; 
                    font-size: 14px; 
                    width: 58mm; 
                    margin: 0; 
                    padding: 5px; 
                }
                h1 { 
                    font-size: 16px; 
                    text-align: center; 
                    margin: 0; 
                    color: black; 
                }
                .item { 
                    margin: 8px 0; 
                    border-bottom: 1px dashed #ccc; 
                    padding-bottom: 5px; 
                }
                .cantidad { 
                    font-weight: bold; 
                    font-size: 16px; 
                }
            </style>
        </head>
        <body>
            <h1>🎯 PRODUCIR HOY:</h1>
    `;

    Object.entries(stockIdeal).forEach(([pan, ideal]) => {
        const actual = parseInt(document.getElementById(pan.replace(/\s/g, '')).value) || 0;
        const produccion = Math.max(0, ideal - actual);
        const redondeado = redondearDecena(produccion);
        
        contenido += `
            <div class="item">
                ${pan.toUpperCase()}: <span class="cantidad">${redondeado} BOLSAS</span>
            </div>
        `;
    });

    contenido += `
            <p style="text-align: center; margin-top: 10px;">⚡ ¡A HORNEAR SE DIJO! ⚡</p>
        </body>
        </html>
    `;

    ventana.document.write(contenido);
    ventana.document.close();
    ventana.print();
}