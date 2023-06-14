const load = () => {
  return new Promise(function (resolve) {
    import('./services.mjs').then(res => {
      resolve(res.default)
    })
  })
}

const models = async (ctx, next) => {
  const openai = await load()
  /** /node_modules/openai/api.ts */ 
  const result = await openai.listModels();
  
  ctx.result = result.data.data
  await next()
}

const chat = async (ctx, next) => {
  const openai = await load()
  // const { content } = ctx.request.body
  const messages = [{"role": "user", "content": "Hello!"}]
  
  /** /node_modules/openai/api.ts */ 
  const result = await openai.createChatCompletion({
    messages,
    model: "gpt-3.5-turbo",
    temperature: 0.5,
    // stream: true,
  })

  ctx.result = result.data
  console.log("result", ctx.result)
  await next()
}

// https://github.com/openai/openai-node/issues/18
const streamChat = async (ctx, next) => {
  const openai = await load()
  const messages = [{"role": "user", "content": "Hello!"}]

  try {
    const res = await openai.createChatCompletion({
      messages,
      model: "gpt-3.5-turbo",
      temperature: 0.5,
      stream: true,
    }, { responseType: 'stream' });
    
    res.data.on('data', data => {
        const lines = data.toString().split('\n').filter(line => line.trim() !== '');
        for (const line of lines) {
            const message = line.replace(/^data: /, '');
            if (message === '[DONE]') {
                return; // Stream finished
            }
            try {
                const parsed = JSON.parse(message);
                console.log(parsed.choices[0].delta.content)
                text.push(parsed.choices[0].delta.content)
            } catch(error) {
                console.error('Could not JSON parse stream message', message, error);
            }
        }
    });
  } catch (error) {
      if (error.response?.status) {
          console.error(error.response.status, error.message);
          error.response.data.on('data', data => {
              const message = data.toString();
              try {
                  const parsed = JSON.parse(message);
                  console.error('An error occurred during OpenAI request: ', parsed);
              } catch(error) {
                  console.error('An error occurred during OpenAI request: ', message);
              }
          });
      } else {
          console.error('An error occurred during OpenAI request', error);
      }
  }
}

module.exports = {
  models,
  chat,
  streamChat
}

