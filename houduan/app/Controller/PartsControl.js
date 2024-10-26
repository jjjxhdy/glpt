const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const router = new Router();

const partsMapper = require('../Mapper/PartsMapper');
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
// GET 请求，获取所有零件信息
router.get('/', async (ctx, next) => {
  let data = await partsMapper.findAll();
  result.data = data;
  ctx.body = result;
});
// GET 请求，获取零件总数
router.get('/number', async (ctx, next) => {
  let data = await partsMapper.findAll();
  result.data = data.length;
  ctx.body = result;
});
// POST 请求，根据用户ID查找零件
router.post('/findByUid', bodyParser(), async (ctx, next) => {
  const parts = ctx.request.body;
  if (parts.id) {
    let data = await partsMapper.findByU(parts.id);// 根据用户ID查询零件
    result.data = data;
    ctx.body = result;
  } else {
    errorResult.msg = '请输入用户id进行查询';
    ctx.body = errorResult;
  }
});
// POST 请求，根据工程师ID查找零件
router.post('/findByEnId', bodyParser(), async (ctx, next) => {
  const parts = ctx.request.body;
  if (parts.id) {
    let data = await partsMapper.findByEnId(parts.id);
    result.data = data;
    ctx.body = result;
  } else {
    errorResult.msg = '请输入工程师id进行查询';
    ctx.body = errorResult;
  }
});
// POST 请求，根据订单ID查找零件
router.post('/findByOrId', bodyParser(), async (ctx, next) => {
  const parts = ctx.request.body;
  if (parts.id) {
    let data = await partsMapper.findByOrId(parts.id);
    result.data = data;
    ctx.body = result;
  } else {
    errorResult.msg = '请输入订单id进行查询';
    ctx.body = errorResult;
  }
});
// POST 请求，添加零件信息
router.post('/add', bodyParser(), async (ctx, next) => {
  const pp = ctx.request.body;
  if (pp.orderid && pp.engineersid && pp.name) {
    let data = await partsMapper.add(pp.orderid, pp.engineersid, pp.name, pp.ms);
    result.data = data;
    ctx.body = result;
  } else {
    errorResult.msg = '输入异常';
    ctx.body = errorResult;
  }
});
// POST 请求，更新零件信息
router.post('/update', bodyParser(), async (ctx, next) => {
  const parts = ctx.request.body;
  if (parts.id) {
     // 检查是否需要更新库存
    let partLinshi = (await partsMapper.findById(parts.id))[0];
    console.log(partLinshi);
    if (parts.state == 2 && partLinshi.state != 2) {
      let datasI = await invenMapper.findByName(partLinshi.name);
      if (datasI.length == 0) {
        errorResult.msg = '暂无该配件';
        ctx.body = errorResult;
        return;
      } else {
        if (datasI[0].new == 0) {
          console.log('该配件已用完');
          errorResult.msg = '该配件已用完';
          ctx.body = errorResult;
          return;
        } else {
          console.log(datasI[0].new - 1, datasI[0].old + 1);
          await invenMapper.update(
            datasI[0].id,
            datasI[0].name,
            datasI[0].new - 1,
            datasI[0].old + 1
          );
        }
      }
    }
    // 更新零件信息
    let data = await partsMapper.uopdateById(parts.id, parts.name, parts.ms, parts.state);
    result.data = data;
    ctx.body = result;
  } else {
    errorResult.msg = '请输入id和需要修改的元素进行修改';
    ctx.body = errorResult;
  }
});
// POST 请求，删除零件信息
router.post('/delete', bodyParser(), async (ctx, next) => {
  const parts = ctx.request.body;
  if (parts.id) {
    let data = await partsMapper.deleteById(parts.id);
    result.data = data;
    ctx.body = result;
  } else {
    errorResult.msg = '请输入id进行删除';
    ctx.body = errorResult;
  }
});

module.exports = router;
