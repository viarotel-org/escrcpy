import { WebSocketServer } from 'ws'

function createWebSocketServer() {
  const wss = new WebSocketServer({ port: 8080 })

  function heartbeat(value = true) {
    this.isAlive = value
  }

  wss.on('connection', (ws) => {
    heartbeat.call(ws)
    ws.on('error', console.error)
    ws.on('pong', heartbeat)
  })

  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        return ws.terminate()
      }

      heartbeat.call(ws, false)
      ws.ping()
    })
  }, 30000)

  wss.on('close', () => {
    clearInterval(interval)
  })

  return wss
}

export default createWebSocketServer
