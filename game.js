//cada subarray é um linha
var arr_table = [[0,0,0],[0,0,0],[0,0,0]];
//array com caminho das imagens
var name_images = ["images/hand.png","images/block.png",
                    "images/table.png","images/player1.png",
                    "images/player2.png"];
//array que armazena as imagens
var images = [];

//para todos os caminhos, carregue no array imagens
name_images.forEach(function(name){
    var image = new Image();
    image.onload = countLoad;
    image.src = name;
    images.push(image);
});

//função que exibe uma mensagem na tela
var msg = null;
function showMsg(message){
    if( msg == null)
        msg = document.getElementById("msg");
    msg.innerHTML = message;
}
//função configura o jogador do cliente atual
function setPlayer(value){
    showMsg("Você é o Player "+value)
    if(value == 1)
        player = images[3];
    else
        player = images[4];

    current_player = parseInt(value);
}
//contador de arquivos (imagens) carregados
var count_file = 0;
function countLoad(){
    count_file++;
    if(count_file == 5)
        startGame();
}

//função para iniciar o jogo, chama o loopgame 
function startGame(){
    window.requestAnimationFrame(loopGame);
}
//canvas e contexto 2d
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//função imprime o tabuleiro
function printTable(){
    ctx.drawImage(images[2],0,0,500,500);
}
//margens para imprimir as peças
var marginx= 20;
var marginy= 25;

//função imprime as peças
function printCircle(x, y, value){
    if(value==0)
        return;
    var p = value==1?images[3]:images[4];
    ctx.drawImage(p, marginx+x*185, marginy+y*187, 80, 80)
}
//função imprime o mouse
function printMouse(){
    ctx.globalAlpha = 0.4;
    var image = player;
    if(turn!=current_player)
        image = images[1];
    else if(mode=="move")
        image = images[0];
    ctx.drawImage(image, mouseX-30, mouseY-90,60,60);
    ctx.globalAlpha = 1;
}

//função loop game (coração do jogo). Imprime o tabuleiro, as peças o mouse
function loopGame(){
    printTable();
    for( i = 0; i < 3; i++)
        for (j = 0; j < 3; j++)
            printCircle(i, j, arr_table[i][j]);

    printMouse();

    window.requestAnimationFrame(loopGame);
}

//cadastrando um evento de cline no tabuleiro
canvas.addEventListener("click", function(e){
    x = parseInt( (e.clientX - marginx)/185);
    y = parseInt( (e.clientY - marginy)/185);
    setTurn(x, y);
});

var step;
var mode = "new";
var count_piece = 0;
var current_player = null;
var player = null;
var turn = 1;
var endgame= false;

function setTurn(x, y){
    if((turn != current_player) || (endgame) ) {
        return;
    }

    showMsg("");
    if(mode == "new"){ 
        if(arr_table[x][y] == 0){
            showMsg("Jogada realizada, aguarde o oponente!");
            count_piece++;
            shiftTurn();
            setPlay(x, y)
            if(count_piece == 4){
                mode = "move";
                step = 1;
                showMsg("Suas peças terminaram! Agora você só poderá movê-las.");
            }
        }else{
            showMsg("Ops! já existe uma peça ai");
        }
    }else if(mode == "move"){
        if(step == 1){
            if(arr_table[x][y] == current_player){
                movex = x;
                movey = y;
                step = 2;
                showMsg("Escolha o local de destino.");
            }else
                showMsg("Selecione a peça corretamente");
        }else if(step == 2){
            if(
                (arr_table[movex][movey] == current_player)
                 && (arr_table[x][y] == 0)
                 && (isAdjacent(movex,movey,x,y)))
            {
                showMsg("Movimentando...");
                showMsg("Jogado realizada, aguarde o oponente!");
                removePiece(movex,movey);
                step = 1;
                shiftTurn();
                setPlay(x, y);
            }else{
                showMsg("Erro no movimento...");
                step = 1;
            }
        }
    }
}

//função remove uma peça do tabuleiro
function removePiece(x,y){
    arr_table[x][y] = 0;
    arr = {};
   sendRemove(x,y);
    if(checkVictory()){
        sendVictory();
    }
}

//função verifica se é adjacente
function isAdjacent(x1,y1,x2,y2){
    adjacents = [];
    adjacents[0] = [ [0,1], [1,1], [1,0]]
    adjacents[1] = [ [0,0], [1,1], [2,0] ]
    adjacents[2] = [ [1,0], [1,1], [2,1]]
    adjacents[3] = [ [0,0], [1,1], [0,2]]
    adjacents[4] = [ [0,0], [0,1],[0,2], [1,0], [1,1],[1,2], [2,0], [2,1],[2,2]]
    adjacents[5] = [ [2,0], [1,1],[2,2] ]
    adjacents[6] = [ [0,1], [1,1],[1,2] ]
    adjacents[7] = [ [0,2], [1,1],[2,2] ]
    adjacents[8] = [ [1,2], [1,1],[2,1] ]
    pos = x1+y1 + y1*2;

    if(pos == 4)
        return true;
    else
        for( var i = 0; i < 3; i++){
    console.log(adjacents[pos][i], x2, y2)
            if((adjacents[pos][i][0] == x2) && (adjacents[pos][i][1] == y2))
                return true;
        }
  
    return false;
}
//atributos do mouse (x e y)
var mouseX;
var mouseY;
//cadastrando evento de movimento do mouse e atualizando as posições.
canvas.addEventListener("mousemove", function(e){
    mouseX =  e.clientX;
    mouseY =  e.clientY;
});

//função que realiza a jogada do jogador
function setPlay(x, y){
    arr_table[x][y] = current_player;
    sendPlay(x,y);
    if(checkVictory()){
        endgame = true;
        showMsg("Você ganhou!");
        sendVictory();
    }
}
//função que realiza a jogada do oponente chama a mudança de jogador 
function setOpponent(x, y){
    arr_table[x][y] = current_player==1?2:1;
    showMsg("Oponente realizou a jogada!");
    shiftTurn();
}
//função muda de jogador
function shiftTurn(){
    turn = turn==1?2:1;
}


//função de vitória
function sendVictory(){
    arr.msg = "victory";
    arr.sender = current_player;
    ws.send( JSON.stringify(arr) ); 
}
//função para envio da remoção
function sendRemove(x,y){
    arr.msg = "remove";
    arr.x = x;
    arr.y = y;
    arr.sender = current_player;
    ws.send( JSON.stringify(arr) ); 
}
//função para envio da jogada
function sendPlay(x, y){
    arr = {};
    arr.msg = "play";
    arr.x = x;
    arr.y = y;
    arr.sender = current_player;
    ws.send( JSON.stringify(arr) ); 
}

//função que verifica a vitória
function checkVictory(){
    if (((arr_table[0][0] == current_player) && (arr_table[0][1] == current_player) && (arr_table[0][2] == current_player))
    || ((arr_table[1][0] == current_player) && (arr_table[1][1] == current_player) && (arr_table[1][2] == current_player))
    || ((arr_table[2][0] == current_player) && (arr_table[2][1] == current_player) && (arr_table[2][2] == current_player))
    || ((arr_table[0][0] == current_player) && (arr_table[1][0] == current_player) && (arr_table[2][0] == current_player))
    || ((arr_table[0][1] == current_player) && (arr_table[1][1] == current_player) && (arr_table[2][1] == current_player))
    || ((arr_table[0][2] == current_player) && (arr_table[1][2] == current_player) && (arr_table[2][2] == current_player))
    || ((arr_table[0][0] == current_player) && (arr_table[1][1] == current_player) && (arr_table[2][2] == current_player))
    || ((arr_table[0][2] == current_player) && (arr_table[1][2] == current_player) && (arr_table[2][2] == current_player))
    || ((arr_table[0][2] == current_player) && (arr_table[1][1] == current_player) && (arr_table[2][0] == current_player)) )
        return true;

    return false;

}