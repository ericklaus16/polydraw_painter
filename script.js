var quadro = document.getElementById("drawing-area");
var verticeCor = "black";
var pinturaCor = "black";

var polygonTable = document.querySelector("#polygon-table");

var id = 0;

quadro.addEventListener("mousedown", function(){
    handleAddPoint();
});

document.getElementById("vertex-color").addEventListener("change", function(e){
    verticeCor = e.target.value;

    let pontosExistentes = document.querySelectorAll("#point");
    pontosExistentes.forEach(ponto => {
        ponto.style.backgroundColor = verticeCor;
    });
});

document.getElementById("fill-color").addEventListener("change", function(e){
    pinturaCor = e.target.value;
});

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

    if(pontosExistentes){
        pontosExistentes.forEach(ponto => {
            ponto.remove();
        });
        
        if(arestas){
            arestasExistentes.forEach(aresta => {
                aresta.remove();
            });
            arestas = [];
        }

        if(poligonos){
            poligonos = []
        }
    }
}

function handleDeletePolygon(id) {
    console.log(`Deletando polígono ${id}`);
    
    let pontosExistentes = Array.from(document.getElementsByClassName((id).toString()));
    console.log(pontosExistentes);
    
    pontosExistentes.forEach(elemento => {
        elemento.remove();
    });
    
    poligonos = poligonos.filter(p => p.id !== id);
}


function handleAddLine(ponto1, ponto2, nomeAresta){
    let x1 = ponto1.x;
    let y1 = ponto1.y;
    let x2 = ponto2.x;
    let y2 = ponto2.y;

    // Criar um elemento para a linha
    let line = document.createElement("div");
    line.setAttribute("id", "line");
    line.style.position = "absolute";
    line.style.backgroundColor = "black";

    let width = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)); // Fórmula de distancia entre pontos

    line.style.width = width + "px"; // Comprimento da linha
    line.style.height = "2px"; // Espessura da linha

    // Posicionar a linha
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
            point.style.backgroundColor = verticeCor;
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
    polygonTable.innerHTML += `<tr class="${id}">
        <th>${poligonos.length}</th>
        <th>${pinturaCor}</th>
        <th><button onclick="handleDeletePolygon(${id})">Deletar</button></th>
    </tr>`;
    pontos = [];
    arestas = [];
    id += 1;
}