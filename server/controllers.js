const axios = require('axios')
const MESSAGES = require('./messages')
const OPENAI_API_KEY = require('./code')

const CHAT = `https://api.openai.com/v1/chat/completions`;
const MODELS =`https://api.openai.com/v1/models`;

const models = async (ctx, next) => {
  const result = await axios.get(MODELS, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
  })
  
  ctx.result = result.data.data
  await next()
}

const chat = async (ctx, next) => {
  //const { content } = ctx.request.body
  const result = await axios.post(CHAT, {
    messages: MESSAGES.queryParameters,
    model: "gpt-3.5-turbo",
    // model: "gpt-4",
    temperature: 0.5,
    // stream: true,
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
  })
  ctx.result = result.data
  await next()
}

const streamChat = async () => {
  await next()
}
module.exports = {
  models,
  chat,
  streamChat
}
