import mongoose from 'mongoose'
import redisClient from '../services/cache'
const MockEvent = mongoose.model('MockEvent')
const { Schema } = mongoose


const projectSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true,
    unique: true,
    maxlength: 15,
    trim: true
  },
  description: {
    type: String,
    maxlength: 100
  },
  createdAt: { type: Date, default: Date.now },
  mockEvents: [{type: Schema.Types.ObjectId, ref: 'MockEvent'}]
})

projectSchema.pre('remove', function(next) {
  let projectId = this._id
  MockEvent.remove({project_id: projectId}).exec()
  var pipeline = redisClient.pipeline()
  pipeline.srem('project', projectId)
  pipeline.del(`project${projectId}`)
  pipeline.exec()
  next()
})

mongoose.model('Project', projectSchema)
