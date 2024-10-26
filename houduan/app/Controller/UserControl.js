const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const router = new Router();

const userMapper = require('../Mapper/UserMapper');

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
// GET 请求，获取所有用户信息
router.get('/', async (ctx, next) => {
  let data = await userMapper.findAll();
  result.data = data;
  ctx.body = result;
});
// POST 请求，根据用户名查找用户
router.post('/findByU', bodyParser(), async (ctx, next) => {
  const postData = ctx.request.body;
  if (postData.username) {
    let data = await userMapper.findByU(postData.username);
    result.data = data;
    ctx.body = result;
  } else {
    errorResult.msg = '请输入username';
    ctx.body = errorResult;
  }
});
// POST 请求，用户登录验证
router.post('/login', bodyParser(), async (ctx, next) => {
  const postData = ctx.request.body;
  let data = await userMapper.login(postData.username, postData.password);
  if (data.length > 0) {
    result.data = data;
    ctx.body = result;
  } else {
    errorResult.msg = '登录失败';
    ctx.body = errorResult;
  }
});
// POST 请求，用户注册
router.post('/register', bodyParser(), async (ctx, next) => {
  const postData = ctx.request.body;
  let data = await userMapper.findOne(postData.username);
  if (data.length > 0) {
    errorResult.msg = '用户名重复，请重新设置用户名';
    ctx.body = errorResult;
    return;
  }
  try {
    await userMapper.insert(
      postData.name,
      postData.username,
      postData.password,
      postData.phone,
      postData.city,
      postData.area,
      postData.power,
      postData.functions
    );
  } catch (err) {
    errorResult.msg = '添加失败';
    ctx.body = errorResult;
    return;
  }
  result.data = '添加成功';
  ctx.body = result;
});
// 定义一个GET类型的路由，用于获取用户总数
router.get('/number', async (ctx, next) => {
  let data = await userMapper.findNum();
  result.data = data;
  ctx.body = result;
});
// 定义一个GET类型的路由，用于获取工程师总数
router.get('/e_number', async (ctx, next) => {
  let data = await userMapper.findENum();
  result.data = data;
  ctx.body = result;
});
// 定义一个GET类型的路由，用于获取工程师列表
router.get('/e', async (ctx, next) => {
  let data = await userMapper.findE();
  result.data = data;
  ctx.body = result;
});

// 定义一个POST类型的路由，用于根据ID删除用户
router.post('/delete', bodyParser(), async (ctx, next) => {
  const postData = ctx.request.body;
  if (postData.id) {
    let data = await userMapper.deletes(postData.id);
    result.data = data;
    ctx.body = result;
  } else {
    errorResult.msg = '删除失败，请传入id删除';
    ctx.body = errorResult;
    return;
  }
});
// 定义一个POST类型的路由，用于更新用户信息

router.post('/update', bodyParser(), async (ctx, next) => {
  const postData = ctx.request.body;
  if (postData.username) {
    let data = await userMapper.findOne(postData.username);
    if (data.length > 0 && data[0].id != postData.id) {
      errorResult.msg = '用户名重复，请重新设置用户名';
      ctx.body = errorResult;
      return;
    }
  }
  try {
    result.data = await userMapper.update(
      postData.id,
      postData.name,
      postData.username,
      postData.password,
      postData.phone,
      postData.city,
      postData.area,
      postData.power,
      postData.functions,
      postData.state,
      postData.begin
    );
    ctx.body = result;
  } catch (err) {
    errorResult.msg = '修改失败';
    ctx.body = errorResult;
    return;
  }
});

module.exports = router;
