const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const router = new Router();

const invenMapper = require('../Mapper/InvenMapper');

const result = {
    code: 200,
    msg: null,
    data: [],
};

const errorResult = {
    code: 500,
    msg: 'cause of error',
    data: null,
};
// GET 请求，获取所有库存信息
router.get('/', async (ctx, next) => {
    let data = await invenMapper.findAll();
    result.data = data;
    ctx.body = result;
});
// POST 请求，添加库存信息
router.post('/add', bodyParser(), async (ctx, next) => {
    const pp = ctx.request.body// 从请求体中获取新增的库存信息
    if (pp.name) { // 确保库存名称存在
        let data = await invenMapper.add(pp.name, pp.new)// 调用 add 方法添加库存
        result.data = data// 将操作结果赋值给响应结构的 data 属性
        ctx.body = result
    } else {
        errorResult.msg = "输入异常"
        ctx.body = errorResult
    }
});
// POST 请求，更新库存信息
router.post('/update', bodyParser(), async (ctx, next) => {
    const pp = ctx.request.body
    if (pp.id && pp.name) {
        let data = await invenMapper.update(pp.id, pp.name, pp.new, pp.old)
        result.data = data
        ctx.body = result
    } else {
        errorResult.msg = "输入异常"
        ctx.body = errorResult
    }
});
// POST 请求，删除库存信息
router.post('/delete', bodyParser(), async (ctx, next) => {
    const pp = ctx.request.body
    if (pp.id) {
        let data = await invenMapper.deletes(pp.id)
        result.data = data
        ctx.body = result
    } else {
        errorResult.msg = "输入异常"
        ctx.body = errorResult
    }
});
// POST 请求，更新单个库存数量（特定逻辑）
router.post('/updateOne', bodyParser(), async (ctx, next) => {
    const pp = ctx.request.body
    try {
        let data = await invenMapper.findByName(pp.name)
        if (data.length == 0) {
            errorResult.msg = "暂无该配件";
            ctx.body = errorResult
        } else {
            if (data[0].new == 0) {
                errorResult.msg = "该配件已用完";
                ctx.body = errorResult
            } else {
                await invenMapper.update(data[0].id, data[0].name, data[0].new - 1, data[0].old + 1)
                result.data = "成功"
                ctx.body = result
            }
        }
    } catch (error) {
        errorResult.msg = error;
        ctx.body = errorResult
    }
});

module.exports = router;
