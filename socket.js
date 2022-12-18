const http = require('http')
const WebSocket = require('ws')

const port = 443
const host = '0.0.0.0'

// module.exports = {
    const createSocket = (() => {
        const server = http.createServer((req,res)=>{
            res.writeHead(202,{'Content-Type':'text/plain'})
            res.end('awesome!')
        })
        
        server.on('upgrade',(req,socket,head)=>{
            socket.write('socket running')
            socket.pipe(socket)
        })
        
        server.listen(port,host,()=> {
            http.request({
                port: port,
                host: host,
                headers: {
                    'Connection': 'Upgrade',
                    'Upgrade': 'websocket',
                }
            },(req,res)=>{
                req.on('upgrade', (res,socket,upgradeHead)=>{
                    console.log('upgraded')
                    socket.end()
                    process.exit(0)
                })
                req.end()
            })
        })
    // })
        const socket = new WebSocket('ws://0.0.0.0:443',{
            // protocol: 'websocket',
            // headers: {

            // }
        })
        socket.onopen = (e)=>{
            socket.send(e)
            console.log('here',e)
        }
        socket.onmessage = function(event) {
            alert(`[message] Data received from server: ${event.data}`);
          };
          
          socket.onclose = function(event) {
            if (event.wasClean) {
              alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
            } else {
              // e.g. server process killed or network down
              // event.code is usually 1006 in this case
              alert('[close] Connection died');
            }
          };
        socket.onerror = (err)=>console.log('there',err.message)
    })

    createSocket()
// }