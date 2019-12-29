import redisClient from './services/cache'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import './models/MockEvent'
import './models/Project'
import mongoose from 'mongoose'
import './wsServer'

const Project = mongoose.model('Project')
const MockEvent = mongoose.model('MockEvent')

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }, async function (err) {
  let projectIds = await Project.find().populate({
    path: 'mockEvents',
    match: { enabled: { $eq: true}}
  })

  await redisClient.keys('*').then(function (keys) {
    // Use pipeline instead of sending
    // one command each time to improve the
    // performance.
    var pipeline = redisClient.pipeline();
    keys.forEach(function (key) {
      pipeline.del(key);
    });
    return pipeline.exec();
  });

  const pipeline = redisClient.pipeline()
  projectIds.forEach(p => {
    pipeline.sadd('project', p._id)
    p.mockEvents.forEach(e => {
      pipeline.sadd(`project${p._id}`, e._id)
      pipeline.hset('mockEvent', e._id, e.content)
    })
  })
  pipeline.exec()
  // projectIds = projectIds.map(o => o._id)
  // let events = await MockEvent.find({ pro})
})

const app = express()

app.use(cors())
app.use(bodyParser.json())

require('./routes')(app)
// require('./routes/blogRoutes')(app);

if (['production'].includes(process.env.NODE_ENV)) {
  app.use(express.static('client/build'))

  const path = require('path')
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('client', 'build', 'index.html'))
  })
}

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log('Listening on port', PORT)
})
