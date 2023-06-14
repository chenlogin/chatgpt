const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const router = require('./router')
const handleResponse = require('./middleware/res')

const app = new Koa()
const PORT = 3010

app.use(bodyParser())
app.use(router.routes(), router.allowedMethods())
app.use(handleResponse) // 这个中间件放在最后，对用户请求的响应处理

app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`)
})