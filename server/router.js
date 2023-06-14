const Router = require('koa-router')
const router = new Router()
const controllers = require('./controllers') //使用 axios 请求
//const controllers = require('./controller/index') //使用 openai 组件

router
  .get('/', async (ctx, next) => {
    ctx.result = 'hello world'
    await next()
  })
  .get('/v1/models', controllers.models)
  //.post('/v1/chat/completions', controllers.chat)
  .get('/v1/chat/completions', controllers.chat)
  .get('/v1/stream/completions', controllers.streamChat)

module.exports = router
