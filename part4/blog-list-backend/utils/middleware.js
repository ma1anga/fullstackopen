const logger = require('./logger')

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'CastError') {
    return response.status(400).json({ error: 'Malformatted ID' })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    const fields = Object.keys(error.keyPattern || {})

    return response.status(400).json({ error: `expected "${fields.join(', ')}" to be unique` })
  }

  next(error)
}

module.exports = {
  errorHandler
}