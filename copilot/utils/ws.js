const ws = new WebSocket('wss://websocket-echo.com/')

let timeout = null
function heartbeat() {
  clearTimeout(timeout)

  timeout = setTimeout(() => {
    ws.close()
  }, 30000 + 1000)
}

ws.addEventListener('error', console.error)
ws.addEventListener('open', heartbeat)
ws.addEventListener('ping', heartbeat)
ws.addEventListener('close', () => {
  clearTimeout(timeout)
})

export default ws
