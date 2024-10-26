// 1．导入mysql模块
const mysql = require('mysql');
const config = require('../../config/setting');

const db = mysql.createPool({
  host: config.database.HOST,
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE,
  port: config.database.PORT,
});
/**
 * 查询parts表中的所有记录
 */
function findAll() {
  return new Promise((resolve, reject) => {
    let sql = 'SELECT * FROM parts';
    db.query(sql, (err, results) => {
      //查询失败
      if (err) {
        reject(err);
        throw err;
      }
      resolve(results);
    });
  });
}
/**
 * 根据ID查询parts表中的单个记录
 * @param {number} id - 需要查询的记录ID
 */
function findById(id) {
  return new Promise((resolve, reject) => {
    let sql = 'SELECT * FROM parts where id = ' + id;
    db.query(sql, (err, results) => {
      if (err) {
        reject(err);
        throw err;
      }
      resolve(results);
    });
  });
}
/**
 * 根据工程师ID查询parts表中的记录
 * @param {number} engineersid - 工程师的ID
 */
function findByEnId(engineersid) {
  return new Promise((resolve, reject) => {
    let sql = 'SELECT * FROM parts where engineersid = ' + engineersid;
    db.query(sql, (err, results) => {
      if (err) {
        reject(err);
        throw err;
      }
      resolve(results);
    });
  });
}
/**
 * 根据订单ID查询parts表中的记录
 * @param {number} orderid - 订单ID
 */
function findByOrId(orderid) {
  return new Promise((resolve, reject) => {
    let sql = 'SELECT * FROM parts where orderid = ' + orderid;
    db.query(sql, (err, results) => {
      if (err) {
        reject(err);
        throw err;
      }
      resolve(results);
    });
  });
}
/**
 * 向parts表中添加一条新记录
 * @param {number} orderid - 订单ID
 * @param {number} engineersid - 工程师ID
 * @param {string} name - 零件名称
 * @param {string} ms - 描述信息
 */
function add(orderid, engineersid, name, ms) {
  return new Promise((resolve, reject) => {
    let sql = `insert into parts (orderid, engineersid, name, ms, state) values (${orderid}, ${engineersid}, "${name}", "${ms}", 0)`;
    db.query(sql, (err, results) => {
      if (err) {
        reject(err);
        throw err;
      }
      resolve(results);
    });
  });
}
/**
 * 更新parts表中指定ID的记录
 * @param {number} id - 需要更新的记录ID
 * @param {string} [name] - 新的零件名称
 * @param {number|string} [ms] - 新的描述信息
 * @param {number} [state] - 新的状态
 */
function uopdateById(id, name, ms, state) {
  return new Promise((resolve, reject) => {
    if (!id) {
      reject('Missing required parameters');
    } else {
      let sql = 'update parts set ';
      let updateFields = [];
      if (name != undefined) updateFields.push(`NAME = "${name}"`);
      if (state != undefined) updateFields.push(`STATE = ${state}`);
      if (ms != undefined) updateFields.push(`ms = ${ms}`);
      sql += updateFields.join(', ') + ` where ID = ${id}`;
      db.query(sql, (err, results) => {
        if (err) {
          reject(err);
          throw err;
        }
        resolve(results);
      });
    }
  });
}
/**
 * 删除parts表中指定ID的记录
 * @param {number} id - 需要删除的记录ID
 */
function deleteById(id) {
  return new Promise((resolve, reject) => {
    let sql = `delete from parts where ID = ${id}`;
    db.query(sql, (err, results) => {
      if (err) {
        reject(err);
        throw err;
      }
      resolve(results);
    });
  });
}
/**
 * 根据用户ID间接查询parts表中的记录，通过关联orders表
 * @param {number} userid - 用户ID
 */
function findByU(userid) {
  return new Promise((resolve, reject) => {
    let sql = `SELECT * FROM parts WHERE orderid IN (SELECT id FROM orders WHERE userid = ${userid})`;
    db.query(sql, (err, results) => {
      if (err) {
        reject(err);
        throw err;
      }
      resolve(results);
    });
  });
}

module.exports = {
  findAll,
  findById,
  findByEnId,
  findByOrId,
  add,
  uopdateById,
  deleteById,
  findByU,
};
