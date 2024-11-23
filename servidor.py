import asyncio
import websockets
from websockets.exceptions import ConnectionClosed

MATCH = []

async def handle(websocket):
    async for message in websocket:
        isplayer = False
        isbreaked = False
        for matchs in MATCH:
            if(isbreaked):
                break
            if (matchs[0].remote_address == websocket.remote_address):
                isplayer = True
                print("jogador já cadastrado")
                try:
                    print("enviando...")
                    if(matchs[1] != 0):
                        await matchs[1].send(message)
                        isbreaked = True
                    else:
                        print("esperando jogador")
                        isbreaked = True
                except ConnectionClosed:
                    print("erro ao enviar...")
                    pass
            if (matchs[1]!=0):
                if (matchs[1].remote_address == websocket.remote_address):
                    isplayer = True
                    print("jogador já cadastrado")
                    try:
                        print("enviando...")
                        if(matchs[0] != 0):
                            await matchs[0].send(message)
                            isbreaked = True
                        else:
                            print("esperando jogador")
                    except ConnectionClosed:
                        print("erro ao enviar...2")
                        pass
        if(isplayer==False):
            print("novo jogador cadastrado")
            hasMatch = False
            for matchs in MATCH:
                if (matchs[1] == 0):
                    matchs[1] = websocket
                    print("Alocado em uma partida")
                    hasMatch = True
                    await matchs[1].send(message)
                    isbreaked = True 
            if(hasMatch == False):
                MATCH.append( [websocket , 0])
                print("Criada nova partida")
                breaisbreaked = True

start_server = websockets.serve(handle, "192.168.0.101", 50000)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()

#testando...