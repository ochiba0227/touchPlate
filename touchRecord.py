#!/usr/bin/env python

import spidev
import time
import json
from socketIO_client import SocketIO, BaseNamespace

## forsocket
class Namespace(BaseNamespace):
    def on_connect(self):
        socketIO.emit('boardConnected','boardConnected')

spi=spidev.SpiDev()
spi.open(0,0)
socketIO = SocketIO('192.168.24.53', 3000,Namespace)

while True:
	res=spi.xfer2([0x68,0x00])
	value=(res[0]*256+res[1]) & 0x3ff
	print value
	if(value>500):                
                socketIO.emit('touch','touched')
                socketIO.wait(seconds=1)
