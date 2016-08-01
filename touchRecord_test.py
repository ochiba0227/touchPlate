import json
from socketIO_client import SocketIO, BaseNamespace

class Namespace(BaseNamespace):

    def on_connect(self):
        socketIO.emit('boardConnected','boardConnected')

socketIO = SocketIO('localhost', 3000,Namespace)
socketIO.emit('touch','touched')
socketIO.wait(seconds=3)
