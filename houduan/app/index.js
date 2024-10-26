const Router = require("koa-router")
const router = new Router()

// 引入两个路由子类
const user = require('./Controller/UserControl.js')
const order = require('./Controller/OrderControl.js')
const parts = require('./Controller/PartsControl.js')
const inven = require('./Controller/InvenControl.js')
const hist = require('./Controller/histControl.js')
const evaluate = require('./Controller/EvaluateController')
// 先注册成路由级组件
router.use("/user",user.routes(), user.allowedMethods())
router.use("/order",order.routes(), order.allowedMethods())
router.use("/parts",parts.routes(), parts.allowedMethods())
router.use("/inven",inven.routes(), inven.allowedMethods())
router.use("/hist",hist.routes(), hist.allowedMethods())
router.use("/evaluate",evaluate.routes(), evaluate.allowedMethods())
module.exports = router