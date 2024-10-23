var quadro = document.getElementById("drawing-area");
var tabelaPoligonos = document.querySelector("#polygon-table");
var id = 0;
var pinturaCor = "black";

var bPintarArestas = false;
var pintarArestas = document.querySelector("#paintLineOption").value;

quadro.addEventListener("mousedown", function(){
    handleAddPoint();
});

document.getElementById("fill-color").addEventListener("change", function(e){
    pinturaCor = e.target.value;
});

document.getElementById("paintLineOption").addEventListener("change", function(e){
    bPintarArestas = !bPintarArestas;
    pintarArestas = document.querySelector("#paintLineOption").value;

    arestasAtual = Array.from(document.getElementsByClassName(id.toString()));
    arestasAtual = arestasAtual.filter(aresta => aresta.id === "line");
    arestasAtual.forEach(aresta => {
        aresta.style.backgroundColor = bPintarArestas ? pinturaCor : "yellow";
    });
})

var rect = quadro.getBoundingClientRect();
var xMin = rect.left;
var xMax = rect.right;
var yMin = rect.top;
var yMax = rect.bottom;

var alfabeto = [
    'A', 'B', 'C', 'D', 'E', 
    'F', 'G', 'H', 'I', 'J', 
    'K', 'L', 'M', 'N', 'O', 
    'P', 'Q', 'R', 'S', 'T', 
    'U', 'V', 'X', 'W', 'Y', 'Z'
]
var pontos = []
var arestas = []
var poligonos = []

function handleClean() {
    let pontosExistentes = document.querySelectorAll("#point");
    let arestasExistentes = document.querySelectorAll("#line");
    let pinturasExistentes = document.querySelectorAll("#paintedline");

    if(pontosExistentes){
        pinturasExistentes.forEach(pintura => {
            pintura.remove();
        });
        pontosExistentes.forEach(ponto => {
            ponto.remove();
        });
        arestasExistentes.forEach(aresta => {
            aresta.remove();
        });

        pontos = [];
        arestas = [];
        poligonos = [];
        tabelaPoligonos.innerHTML = `<tr>
            <th>Polígono</th>
            <th>Cor</th>
            <th>Ações</th>
        `;
    }
}

function handleDeletePolygon(id) {
    console.log(`Deletando polígono ${id}`);
    let pontosExistentes = Array.from(document.getElementsByClassName((id).toString()));
    let pintura = Array.from(document.getElementsByClassName(`paintedline${id}`));
    
    pintura.forEach(elemento => {
        elemento.remove();
    });

    pontosExistentes.forEach(elemento => {
        elemento.remove();
    });
    
    // poligonos = poligonos.filter(p => p.id !== id);
}

function handleChangePolyColor(id, color){
    let pintura = Array.from(document.getElementsByClassName(`paintedline${id}`));
    let arestas = Array.from(document.getElementsByClassName(id.toString()));
    arestas = arestas.filter(aresta => aresta.id === "line");

    pintura.forEach(elemento => {
        elemento.style.backgroundColor = color;
    })

    if (bPintarArestas){
        console.log(poligonos[id].arestas)
        arestas.forEach(aresta => {
            aresta.style.backgroundColor = color;
        })
    }

    console.log(poligonos[id].arestas)
}

function fillPoly(id, pontos, pinturaCor) {
    let scanlines = Array(yMax - yMin + 1).fill(0).map(() => []); // Array para armazenar interseções por scanline

    // Processar arestas do polígono
    for (let i = 0; i < pontos.length; i++) {
        let pontoAtual = pontos[i];
        let proximoPonto = pontos[(i + 1) % pontos.length];

        // Ignorar arestas horizontais
        if (pontoAtual.y === proximoPonto.y) continue;
            // Garantir que o ponto atual seja o de menor y
            if (pontoAtual.y > proximoPonto.y) {
                [pontoAtual, proximoPonto] = [proximoPonto, pontoAtual];
        }

        let deltaX = (proximoPonto.x - pontoAtual.x) / (proximoPonto.y - pontoAtual.y); // Coeficiente angular
        let xInterseccao = pontoAtual.x;

        // Calcular as interseções de ymin até ymax
        for (let y = pontoAtual.y; y < proximoPonto.y; y++) {
            let scanlineIndex = y - yMin;
            scanlines[scanlineIndex].push(xInterseccao);
            xInterseccao += deltaX; // Incrementar a interseção usando Δx
        }
    }

    // Desenhar os intervalos de preenchimento para cada scanline
    for (let y = yMin; y <= yMax - 1; y++) {
        let intersecoes = scanlines[y - yMin];

        // Ordenar as interseções
        intersecoes.sort((a, b) => a - b);

        // Desenhar as linhas horizontais entre pares de interseções
        for (let i = 0; i < intersecoes.length; i += 2) {
            let xIni = Math.ceil(intersecoes[i]);
            let xFim = Math.floor(intersecoes[i + 1]);

            let linha = document.createElement("div");
            linha.setAttribute("id", "paintedline");
            linha.setAttribute("class", `paintedline${id}`);
            linha.style.position = "absolute";
            linha.style.backgroundColor = pinturaCor;
            linha.style.height = "1px";
            linha.style.left = xIni + "px";
            linha.style.width = (xFim - xIni) + "px";
            linha.style.top = y + "px";

            document.body.appendChild(linha);
        }
    }
}

function handleAddLine(ponto1, ponto2, nomeAresta){
    let x1 = ponto1.x;
    let y1 = ponto1.y;
    let x2 = ponto2.x;
    let y2 = ponto2.y;

    let line = document.createElement("div");
    line.setAttribute("id", "line");
    line.style.position = "absolute";
    line.style.backgroundColor = bPintarArestas ? pinturaCor : "yellow";

    let width = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)); // Fórmula de distancia entre pontos

    line.style.width = width + "px"; // Comprimento da linha
    line.style.height = "2px"; // Espessura da linha

    let angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI; // Ângulo da linha
    line.style.transformOrigin = "0 75%"; // Origem da transformação
    line.style.transform = `rotate(${angle}deg)`;
    line.style.left = x1 + "px";
    line.style.top = y1 + "px";

    arestas.push({ nome: nomeAresta, x1: x1, y1: y1, x2: x2, y2: y2, elemento: line});
    line.setAttribute("title", "Aresta " + nomeAresta);
    line.setAttribute("class", id.toString());
    document.body.appendChild(line);
}

function handleAddPoint(){
    document.onmousedown = function(e){
        let xDaTela = e.pageX - xMin;
        let yDaTela = e.pageY - yMin;

        if(xDaTela >= 0 && yDaTela >= 0 && e.pageX < xMax && e.pageY < yMax){ // O ponto está na tela
            console.log(xDaTela + ", " + yDaTela);

            let point = document.createElement("div");
            point.style.position = "absolute";
            point.style.left = e.pageX + 'px';
            point.style.top = e.pageY + 'px';
            point.style.backgroundColor = "black";
            point.setAttribute("id", "point");
            point.setAttribute("class", (id).toString());
            point.setAttribute("title", "Ponto " + alfabeto[pontos.length]);
            pontos.push({ x: e.pageX, y: e.pageY })

            console.log(pontos);
            
            document.body.appendChild(point);

            if(pontos.length >= 2){
                handleAddLine(pontos[pontos.length - 2], pontos[pontos.length - 1], alfabeto[pontos.length - 2] + alfabeto[pontos.length - 1]);
            }
        }
    }
} 

function handleFill(){
    handleAddLine(pontos[pontos.length - 1], pontos[0], alfabeto[pontos.length - 1] + alfabeto[0]);

    poligonos.push({ id: id, pontos: pontos, arestas: arestas, cor: pinturaCor });

    fillPoly(id, pontos, pinturaCor);

    tabelaPoligonos.innerHTML += `<tr class="${id}">
        <th>${poligonos.length}</th>
        <th><input type="color" value="${pinturaCor}" onChange="handleChangePolyColor(${id}, this.value)"/></th>
        <th><i class="bi bi-trash-fill" onclick="handleDeletePolygon(${id})" style="cursor: pointer; color: #f00"/></th>
    </tr>`;
    pontos = [];
    arestas = [];
    id += 1;
}