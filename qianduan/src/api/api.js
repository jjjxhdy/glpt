import Vue from 'vue';
const baseurl = 'http://127.0.0.1:3007/';
const httpPost = (url, data) => {
  return new Promise((resolve, reject) => {
    Vue.axios({
      method: 'post',
      url: baseurl + url,
      data: data,
      // headers: {
      //   'Access-Control-Allow-Origin': '*',
      //   'Content-Type': 'application/json;charset=utf-8',
      // },
    })
      .then((res) => {
        // console.log(res);

        if (res.data.code == 200) {
          resolve(res.data);
        } else {
          Vue.prototype.$message({
            message: res.data.msg,
            type: 'error',
          });
        }
      })
      .catch((err) => {
        reject(err);
        Vue.prototype.$message({
          message: err.message,
          type: 'error',
        });
        // console.log(err);
      });
  });
};
const httpGet = (url) => {
  return new Promise((resolve, reject) => {
    Vue.axios({
      method: 'get',
      url: baseurl + url,
      // headers: {
      //   'Access-Control-Allow-Origin': '*',
      //   'Content-Type': 'application/json;charset=utf-8',
      // },
    })
      .then((res) => {
        // console.log(res);
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
        Vue.prototype.$message({
          message: err.message,
          type: 'error',
        });
        // console.log(err);
      });
  });
};
/** ----------登录页面接口----------- **/
// 登录
const signin = (data) => {
  return httpPost('user/login', data);
};
const register = (data) => {
  return httpPost('user/register', data);
};
// 登出
const signout = (data) => {
  return httpPost('/user/signout', data);
};
/** ---------用户管理页面接口-------- **/
// 获取用户列表
const getalluser = (data) => {
  return httpGet('user', data);
};
// 修改用户信息
const updateuser = (data) => {
  return httpPost('user/update', data);
};
// 查询用户信息
const finduser = (data) => {
  return httpPost('user/findByU', data);
};
// 删除用户信息
const deleteuser = (data) => {
  return httpPost('user/delete', data);
};
// 查询所有工程师信息
const findallpro = (data) => {
  return httpGet('user/e', data);
};
/** ---------工单相关接口---------- **/
// 获取工单列表
const getallorders = (data) => {
  return httpGet('order', data);
};

//撤销工单
const cancelorders = (data) => {
  return httpPost('order/cancel', data);
};
// 新增工单信息
const addorder = (data) => {
  return httpPost('order/add', data);
};
// 修改工单信息
const updateorder = (data) => {
  return httpPost('order/updateById', data);
};
//搜索工单信息：id查询
const findOneorder = (data) => {
  return httpPost('order/findOne', data);
};
//搜索工单信息：根据工程师id查询工单
const findByEorder = (data) => {
  return httpPost('order/findByE', data);
};
//搜索工单信息：条件查询工单
const findBySomtingorder = (data) => {
  return httpPost('order/findBySomting', data);
};
/** --------换件相关接口--------- **/

//查询所有换件信息
const allparts = (data) => {
  return httpGet('parts', data);
};
//新增换件信息
const addparts = (data) => {
  return httpPost('parts/add', data);
};
//查询换件id信息：id查询
const findByOrIdparts = (data) => {
  return httpPost('parts/findByOrId', data);
};
//用户查询换件信息：id查询
const findByUidparts = (data) => {
  return httpPost('parts/findByUid', data);
};
//工程师查询换件信息：id查询
const findByEnIdparts = (data) => {
  return httpPost('parts/findByEnId', data);
};
//修改换件信息
const updateparts = (data) => {
  return httpPost('parts/update', data);
};
/** --------数据展示相关接口------- **/
// 用户数量查询
const usernumber = (data) => {
  return httpGet('user/number', data);
};
// 换件数量查询
const partsnumber = (data) => {
  return httpGet('parts/number', data);
};
//每种等级工程师数量
const usere_number = (data) => {
  return httpGet('user/e_number', data);
};
//每种等级工单数量
const orderlevel = (data) => {
  return httpGet('order/level', data);
};
//每种工单状态数量
const orderstate = (data) => {
  return httpGet('order/state', data);
};
/**----- 配件库存相关接口 ---------**/
//获取所有配件库存
const partalllist = (data) => {
  return httpGet('inven', data);
};
//添加配件库存
const addpartlist = (data) => {
  return httpPost('inven/add', data);
};
//修改配件库存
const updatepartlist = (data) => {
  return httpPost('inven/update', data);
};
//删除配件库存
const deletepartlist = (data) => {
  return httpPost('inven/delete', data);
};
//获取所有库存记录
const histparts = (data) => {
  return httpGet('hist', data);
};
//添加库存记录
const addhist = (data) => {
  return httpPost('hist/add', data);
};
//撤销库存修改
const cancelhist = (data) => {
  return httpPost('hist/cancel', data);
};
//修改库存记录
const updatehist = (data) => {
  return httpPost('hist/update', data);
};
//删除库存记录
const deletehist = (data) => {
  return httpPost('hist/delete', data);
};
//添加工单评价/evaluate/update
const evaluateupdate = (data) => {
  return httpPost('evaluate/update', data);
};
//根据工单id查询工单评价
const evaluatefindByOrder = (data) => {
  return httpPost('evaluate/findByOrder', data);
};
export default {
  signin,
  signout,
  register,
  getalluser,
  updateuser,
  deleteuser,
  finduser,
  getallorders,
  addorder,
  cancelorders,
  updateorder,
  findOneorder,
  addparts,
  findByEnIdparts,
  findByOrIdparts,
  findByUidparts,
  updateparts,
  usernumber,
  allparts,
  partsnumber,
  usere_number,
  orderlevel,
  orderstate,
  findByEorder,
  findBySomtingorder,
  findallpro,
  partalllist,
  addpartlist,
  updatepartlist,
  deletepartlist,
  histparts,
  addhist,
  cancelhist,
  updatehist,
  deletehist,
  evaluateupdate,
  evaluatefindByOrder,
};
