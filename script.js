var rect = document.getElementById("drawing-area").getBoundingClientRect();

if(!rect){
    console.log("Erro!");
} else {
    console.log("Certo");
}

var xMin = rect.left;
var xMax = rect.right;
var yMin = rect.top;
var yMax = rect.bottom;

var pontos = [{}]

function handleClean() {
    let pontosExistentes = document.querySelectorAll("#point");

    if(pontosExistentes){
        pontosExistentes.forEach(ponto => {
            ponto.remove();
        });
    }
}

function handleAddPoint(){

    document.onmousedown = function(e){
        let xDaTela = e.pageX - xMin;
        let yDaTela = e.pageY - yMin;

        if(xDaTela >= 0 && yDaTela >= 0){
            console.log(xDaTela + ", " + yDaTela);

            let point = document.createElement("div");
            point.style.position = "absolute";
            point.style.left = e.pageX + 'px';
            point.style.top = e.pageY + 'px';
            point.setAttribute("id", "point");

            document.body.appendChild(point);
            pontos.push({ x: point.style.left, y: point.style.top })

            if(pontos.length > 2){
                // handleConnectPoints(ponto1, ponto2);
                console.log("E então no quinto dia Deus fez as arestas");
            }
        }

    }

} 