const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const router = new Router();

const histMapper = require('../Mapper/histMapper');
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
// GET 请求，获取所有历史记录
router.get('/', async (ctx, next) => {
    let data = await histMapper.findAll();
    result.data = data;
    ctx.body = result;
});
// POST 请求，添加新的历史记录
router.post('/add', bodyParser(), async (ctx, next) => {
    const pp = ctx.request.body
    if (pp.name) {
        let data = await histMapper.add(pp.name, pp.num)
        result.data = data
        ctx.body = result
    } else {
        errorResult.msg = "输入异常"
        ctx.body = errorResult
    }
});
// POST 请求，更新历史记录
router.post('/update', bodyParser(), async (ctx, next) => {
    const pp = ctx.request.body
    if (pp.id) {
        let data = await histMapper.findOne(pp.id)
        await histMapper.update(pp.id, pp.name, pp.num, pp.state);
        // 如果状态变为已处理（假设1为已处理），且之前状态不是已处理，则增加库存
        if (pp.state == 1 && data.length > 0) {
            if(data[0].state != 1) {
                await invenMapper.add(data[0].name, data[0].num)
            }
        }
        result.data = data
        ctx.body = result
    } else {
        errorResult.msg = "输入异常"
        ctx.body = errorResult
    }
});
// POST 请求，取消历史记录修改
router.post('/cancel', bodyParser(), async (ctx, next) => {
    const pp = ctx.request.body
    if (pp.id) {
        let data = await histMapper.findOne(pp.id)
        if(data[0].state == 0) {// 如果状态为未处理（假设0为未处理）
            let datas = await histMapper.cancel(pp.id)// 取消修改
            result.data = datas
            ctx.body = result
        } else {
            errorResult.msg = "当前零件修改已被管理员处理"
            ctx.body = errorResult
        }
    } else {
        errorResult.msg = "输入异常"
        ctx.body = errorResult
    }
});
// POST 请求，删除历史记录
router.post('/delete', bodyParser(), async (ctx, next) => {
    const pp = ctx.request.body
    if (pp.id) {
        let data = await histMapper.deletes(pp.id)
        result.data = data
        ctx.body = result
    } else {
        errorResult.msg = "输入异常"
        ctx.body = errorResult
    }
});

module.exports = router;
