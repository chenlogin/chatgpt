const handleResponse = async (ctx, next) => {
  ctx.type = 'application/json'
  ctx.body = {
    success: true,
    code: 200,
    message: ctx.msg || 'success',
    data: ctx.result || null,
  }

  await next()
}

module.exports = handleResponse