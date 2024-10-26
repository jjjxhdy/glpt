const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const router = new Router();

const evaluateMapper = require('../Mapper/evaluateMapper');
const orderMapper = require('../Mapper/OrderMapper');
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
// 定义GET路由，用于获取所有评价信息
router.get('/', async (ctx, next) => {
  let data = await evaluateMapper.findAll();
  result.data = data;
  ctx.body = result;
});
// 定义POST路由，根据订单ID查找评价
router.post('/findByOrder', bodyParser(), async (ctx, next) => {
  const ssss = ctx.request.body;
  
  if (ssss.orderid) {
    let data = await evaluateMapper.findByOrderId(ssss.orderid);
    result.data = data;
    ctx.body = result;
  } else {
    errorResult.msg = '请输入orderid';
    ctx.body = errorResult;
  }
});
// 定义POST路由，用于更新或插入评价信息
router.post('/update', bodyParser(), async (ctx, next) => {
  const ssss = ctx.request.body;
  let data = await evaluateMapper.findByOrderId(ssss.orderid);
  // 如果没有找到对应评价记录
  if (data.length === 0) {
    // 创建当前时间对象
    const currentTime = new Date();
    // 插入新的评价记录
    await evaluateMapper.insert(ssss.grade, ssss.ms, ssss.orderid, 1, currentTime);
  } else {
    // 否则，更新现有评价记录
    await evaluateMapper.updateById(data[0].id, ssss.grade, ssss.ms, 1);
  }
  // 更新订单状态为已评价（假设状态码为5）
  await orderMapper.updateById(
    ssss.orderid,
    undefined,
    undefined,
    5,// 更新状态字段
    undefined,
    undefined,
    undefined,
    undefined
  );
  result.data = data;
  ctx.body = result;
});

module.exports = router;
