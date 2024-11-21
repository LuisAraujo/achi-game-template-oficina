var wsUrl  = null;
var ws = null;
window.onload = function() {

wsUrl = 'ws://192.168.101:50000';

ws = new WebSocket(wsUrl);

ws.onopen = function (event) {
    showMsg("Conectado! Aguardando um oponente!")
    arr = {msg:"player1", sender: "null"};
    ws.send( JSON.stringify(arr) ); 
};

ws.onmessage = function (event) {

    try {
        var temp = JSON.parse(event.data);

        if ((temp.msg == "player1") && (current_player == null)){
            setPlayer(1);
            arr = {msg:"player2", sender: current_player};
            ws.send( JSON.stringify(arr) );
        }else if(temp.msg == "player2"){
            setPlayer(2);
        }else if(temp.msg == "play"){
            setOpponent( parseInt(temp.x),  parseInt(temp.y))
        }else if(temp.msg == "remove"){
            removePiece( parseInt(temp.x),  parseInt(temp.y))
        }else if(temp.msg == "victory"){
           showMsg("Você perdeu!");
        }
    } catch(e) {
       showMsg("Ocorreu um erro!")
    }

}

ws.onclose = function (event) {
    showMsg("Conexão fechada!")
}



};