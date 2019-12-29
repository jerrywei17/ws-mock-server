
import { Server as WebSocketServer } from 'ws'
import redisClient from './services/cache'
import Url from 'url'
import Qs from 'qs'

async function initWs () {
  const PORT = process.env.WS_PORT || 9000
  const wss = new WebSocketServer({
    port: PORT
  })
  console.log('ws Listening on port', PORT)


  const projectIds = await redisClient.smembers('project')
  // 连接池
  const clients = projectIds.reduce((acc, p) => {
    acc[p] = []
    return acc
  }, {})
  console.log(projectIds, 'projectIds')

  setInterval(async () => {
    const projectEvents = {}
    for(let i=0;i<projectIds.length;i++){
      let pId = projectIds[i]
      const events = await redisClient.smembers(`project${pId}`)
      const eventContents = []
      for (let j=0;j<events.length;j++) {
        let content = await redisClient.hget('mockEvent', events[j])
        eventContents.push(content)
      }
      console.log(eventContents)
      // 广播消息
      clients[pId].forEach(ws => {
        if (ws.readyState === 1) {
          eventContents.forEach(c => {
            ws.send(c)
          })
        }
      })
    }
  }, 8000)

  wss.on('connection', function (ws, request) {
    let projectId = Qs.parse(Url.parse(request.url).query).projectId
    if(projectId&&clients[projectId]){
      // 将该连接加入连接池
      clients[projectId].push(ws)
      ws.on('message', function (message) {
        const data = JSON.parse(message)
        if (data.command === 'ping') {
          const msg = JSON.stringify({
            type: 'pong',
            pong: 'pong'
          })
          ws.send(msg)
        }
      })

      ws.on('close', function (message) {
        // 连接关闭时，将其移出连接池
        clients[projectId].splice(clients[projectId].findIndex(function (ws1) {
          return ws1 === ws
        }), 1)
      })
    }
  })
}

initWs()
