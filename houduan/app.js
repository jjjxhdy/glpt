const Koa = require("koa")
const app = new Koa()
// 导入并配置cors中间件
const cors = require('koa2-cors')

app.use(cors())
const router = require('./app/index.js')
const config = require('./config/setting.js')

// 直接注册成应用级组件
app.use(router.routes()).use(router.allowedMethods())
app.listen(config.port)
console.log("请访问", config.port)

const timer = require("./app/Controller/timer")
timer.begin()