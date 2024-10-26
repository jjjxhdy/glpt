const Router = require("koa-router")
const bodyParser = require('koa-bodyparser')
const router = new Router()


const orderMapper = require('../Mapper/OrderMapper')
const userMapper = require('../Mapper/UserMapper')

const algorithm = require('../Algorithm/Algorithm')
const evaluateMapper = require("../Mapper/evaluateMapper");

const result = {
    code: 200,
    msg: null,
    data: []
}
const errorResult = {
    code: 500,
    msg: "cause of error",
    data: null
}
// GET 请求，获取所有订单
router.get("/",async (ctx,next)=>{
    let data = await orderMapper.findAll()
    result.data = data
    ctx.body = result
})
// GET 请求，获取订单级别分布
router.get("/level",async (ctx,next)=>{
    let data = await orderMapper.findLevel()
    result.data = data
    ctx.body = result
})
// POST 请求，取消订单
router.post('/cancel', bodyParser(), async (ctx, next) => {
    const pp = ctx.request.body
    if (pp.id) {
        let data = await orderMapper.findOne(pp.id)
        if(data[0].state == 0) {
            result.data = await orderMapper.cancel(pp.id)
            ctx.body = result
        } else {
            errorResult.msg = "当前订单已被接单"
            ctx.body = errorResult
        }
    } else {
        errorResult.msg = "输入异常"
        ctx.body = errorResult
    }
});
// GET 请求，获取订单状态分布
router.get("/state",async (ctx,next)=>{
    let data = await orderMapper.findState()
    result.data = data
    ctx.body = result
})
// POST 请求，添加新订单
router.post("/add", bodyParser(), async (ctx,next)=>{
    const orderD = ctx.request.body
    orderD.state = 0 // 初始化订单状态为未处理
    try {
        // 步骤1: 确认工程师资源是否充足
        // 根据订单所在城市查找该城市的订单总数
        let orderT = await orderMapper.findByCity(orderD.city)
         // 同样根据城市查找该城市的工程师总数
        let workerT = await userMapper.findByCity(orderD.city)
        // 如果工程师数量小于等于已有订单数量，说明资源不足
        if(workerT.length <= orderT.length) {
            errorResult.msg = "该城市所有工程师均以分配，请稍后再提交工单"
            ctx.body = errorResult
            return// 结束此请求处理，不执行后续逻辑
        }
        // 步骤2: 插入新订单
        // 使用订单详情调用insert方法将新订单插入数据库
        await orderMapper.insert(orderD.type, orderD.level, orderD.city, orderD.area, orderD.userid)
        // 步骤3: 优化工程师分配（假定采用了匈牙利算法进行最优分配）
        // 再次根据城市获取所有工程师和订单列表，准备进行分配计算
        let workers = await userMapper.findByCity(orderD.city)
        let orders = await orderMapper.findByCity(orderD.city)
        // 构建成本矩阵，准备进行分配计算
        let costMatrix = [];
        workerIndex = {}; // 工程师索引
        orderIndex = {}; // 订单索引
        for(let i=0;i<workers.length;i++) {
            workerIndex[i] = workers[i].id;
            let oneCost = [];// 某工程师对应所有订单的成本
            for(let j=0;j<orders.length;j++) {
                if(i == 0) {
                    orderIndex[j] = orders[j].id;// 第一次迭代时初始化订单索引
                }
                oneCost.push(algorithm.getCost(workers[i], orders[j]))// 计算成本并加入数组
            }
            costMatrix.push(oneCost)
        }
        // 使用匈牙利算法求解最优分配
        let results = algorithm.hungarianS(costMatrix)
        // 根据分配结果更新数据库中的工程师与订单关联
        for (const [key, value] of Object.entries(results)) {
            await orderMapper.updateEngineersById(orderIndex[value], workerIndex[key])
        }
        result.data = "添加成功"
        ctx.body = result
    }catch(err) {
        errorResult.msg = "添加失败"
        ctx.body = errorResult
        return
    }
})
// POST 请求，根据ID更新订单
router.post("/updateById", bodyParser(), async (ctx,next)=>{
    const orderD = ctx.request.body
    try {
        if (orderD.id) {
            if(orderD.state == 2) {
                let orderss =  await orderMapper.findOne(orderD.id)
                if(orderss[0].state != 2) {
                    const currentTime = new Date();
                    await evaluateMapper.insert(0, "", orderD.id, 0, currentTime)
                }
            }
            await orderMapper.updateById(orderD.id, orderD.type, orderD.level, orderD.state, orderD.city, orderD.area, orderD.userid, orderD.engineers)
            result.data = "修改成功"
            ctx.body = result
        } else {
            errorResult.msg = "修改失败，缺少id"
            ctx.body = errorResult
            return
        }
    }catch(err) {
        errorResult.msg = "修改失败"
        ctx.body = errorResult
        return
    }
})
// POST 请求，根据ID查找单个订单
router.post("/findOne", bodyParser(), async (ctx,next)=>{
    const orderD = ctx.request.body
    if(orderD.id) {
        let data = await orderMapper.findById(orderD.id)
        result.data = data
        ctx.body = result
    } else {
        errorResult.msg = "请输入用户id或者工程师id进行查询"
        ctx.body = errorResult
    }
})
// POST 请求，根据工程师ID查找
router.post("/findByE", bodyParser(), async (ctx,next)=>{
    const orderD = ctx.request.body
    if(orderD.id) {
        let data = await orderMapper.findByE(orderD.id)
        result.data = data
        ctx.body = result
    } else {
        errorResult.msg = "请输入用户id或者工程师id进行查询"
        ctx.body = errorResult
    }
})
// POST 请求，根据条件查找订单
router.post("/findBySomting", bodyParser(), async (ctx,next)=>{
    const orderD = ctx.request.body
    if(orderD.id) {
        if(orderD.type){
            let data = await orderMapper.findByIdType(orderD.id, orderD.type)
            result.data = data
            ctx.body = result
        } else {
            let data = await orderMapper.findByE(orderD.id)
            result.data = data
            ctx.body = result
        }
    } else if(orderD.type){
        let data = await orderMapper.findByType(orderD.type)
        result.data = data
        ctx.body = result
    } else {
        let data = await orderMapper.findAll()
        result.data = data
        ctx.body = result
    }
})

module.exports = router
