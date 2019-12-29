import redisClient from '../services/cache'
import mongoose from 'mongoose'
const { Schema } = mongoose

const mockEventSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 15,
    trim: true
  },
  enabled: {
    type: Boolean,
    default: false
  },
  content: {
    type: String,
    maxlength: 200
  },
  project_id: { type: Schema.Types.ObjectId, ref: 'Project' },
  createdAt: { type: Date, default: Date.now }
})

mockEventSchema.index({ name: 1, project_id: 1}, { unique: true });

mockEventSchema.pre('remove', function(next) {
  redisClient.hdel('mockEvent', this._id)
  next()
})

mongoose.model('MockEvent', mockEventSchema)
