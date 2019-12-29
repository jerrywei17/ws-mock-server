import mongoose from 'mongoose'

import redisClient from '../services/cache'
const Project = mongoose.model('Project')
const MockEvent = mongoose.model('MockEvent')

module.exports = app => {
  app.get('/project', async (req, res) => {
    const Projects = await Project.find(null, '_id name createdAt description')
    res.send(Projects)
  })
  app.post('/project', async (req, res) => {
    const { name, description } = req.body

    const project = new Project({
      name,
      description
    })

    try {
      await project.save()
      res.send({
        _id: project._id,
        name: project.name,
        createdAt: project.createdAt,
        description: project.description
      })
    } catch (err) {
      res.send(400, err)
    }
  })
  app.patch('/project/:id', async (req, res) => {
    try {
      await Project.update({_id: req.params.id}, req.body)
      let project = await Project.findOne({_id: req.params.id})
      res.status(200).send(project)
    } catch (err) {
      res.send(400, err)
    }
  })
  app.delete('/project/:id', async (req, res) => {
    try {
      let project = await Project.findById(req.params.id)
      await project.remove()
      res.status(200).send('success')
    } catch (err) {
      res.send(400, err)
    }
  })
  app.get('/project/:id/event', async (req, res) => {
    const project = await Project.findById(req.params.id).populate({path: 'mockEvents'})
    res.send(project.mockEvents)
  })

  app.post('/project/:id/event', async (req, res) => {
    const { name, content } = req.body
    let projectId = req.params.id
    const event = new MockEvent({
      name,
      content,
      project_id: projectId
    });
    try {
      await event.save()
      await Project.findOneAndUpdate({_id: projectId}, { '$push': {mockEvents: event._id}})
      res.send(event)
    } catch (err) {
      res.status(400).send(err)
    }
  })
  app.get('/event/:id', async (req, res) => {
    res.send(events)
  })

  app.patch('/event/:id', async (req, res) => {
    try {
      await MockEvent.update({_id: req.params.id}, req.body)
      let event = await MockEvent.findOne({_id: req.params.id})
      if(event.enabled){
        redisClient.sadd(`project${event.project_id}`, event._id)
        redisClient.hset('mockEvent', event._id, event.content)
      } else {
        redisClient.srem(`project${event.project_id}`, event._id)
        redisClient.hdel('mockEvent', event._id)
      }
      res.send(event)
    } catch (err) {
      res.status(400).send(err)
    }
  })

  app.delete('/event/:id', async (req, res) => {
    try {
      let event = await MockEvent.findOne({_id: req.params.id})
      await MockEvent.deleteOne({_id: req.params.id})
      redisClient.srem(`project${event.project_id}`, event._id)
      redisClient.hdel('mockEvent', event._id)
      res.status(200).send('success')
    } catch (err) {
      console.log(err)
      res.send(400, err)
    }
  })
}
