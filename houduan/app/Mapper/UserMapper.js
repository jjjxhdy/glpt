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
// 查询user表中的所有记录
function findAll() {
  return new Promise((resolve, reject) => {
    let sql = 'SELECT * FROM user';
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
// 统计不同functions值的数量
function findNum() {
  return new Promise((resolve, reject) => {
    let sql =
      'SELECT functions, COUNT(*) AS count\n' +
      'FROM user\n' +
      'WHERE functions IN (0, 1, 2)\n' +
      'GROUP BY functions\n' +
      'order by functions;';
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
// 统计特定functions下的不同power值的数量
function findENum() {
  return new Promise((resolve, reject) => {
    let sql =
      'SELECT power, COUNT(*) AS count\n' +
      'FROM user\n' +
      'WHERE power IN (0, 1, 2) and functions = 1\n' +
      'GROUP BY power\n' +
      'order by power;';
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
// 查询具有特定functions和power值的所有用户
function findE() {
  return new Promise((resolve, reject) => {
    let sql =
        'SELECT * FROM user WHERE power IN (0, 1, 2) and functions = 1';
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
// 根据USERNAME查询单个用户
function findOne(username) {
  return new Promise((resolve, reject) => {
    let sql = 'SELECT * FROM user where USERNAME = "' + username + '"';
    db.query(sql, (err, results) => {
      if (err) {
        reject(err);
        throw err;
      }
      resolve(results);
    });
  });
}
// 模糊搜索USERNAME匹配的用户
function findByU(username) {
  username = '%' + username + '%';
  return new Promise((resolve, reject) => {
    let sql = 'SELECT * FROM user where USERNAME like "' + username + '"';
    db.query(sql, (err, results) => {
      if (err) {
        reject(err);
        throw err;
      }
      resolve(results);
    });
  });
}
// 登录验证
function login(username, password) {
  return new Promise((resolve, reject) => {
    let sql =
      'SELECT * FROM user where USERNAME = "' + username + '" and PASSWORD = "' + password + '"';
    db.query(sql, (err, results) => {
      if (err) {
        reject(err);
        throw err;
      }
      resolve(results);
    });
  });
}
// 插入新用户
function insert(name, username, password, phone, city, area, power, functions) {
  return new Promise((resolve, reject) => {
    let sql =
      'insert into user(NAME, USERNAME, PASSWORD, PHONE, CITY, AREA, POWER, FUNCTIONS, STATE,BEGIN) values ("' +
      name +
      '","' +
      username +
      '","' +
      password +
      '","' +
      phone +
      '","' +
      city +
      '","' +
      area +
      '",' +
      power +
      ',' +
      functions +
      ',' +
      '0' +
      ',' +
      '0)';
    db.query(sql, (err, results) => {
      if (err) {
        reject(err);
        throw err;
      }
      resolve(results);
    });
  });
}
// 更新用户信息
function update(id, name, username, password, phone, city, area, power, functions, state, begin) {
  return new Promise((resolve, reject) => {
    if (!id) {
      reject('Missing required parameters');
    } else {
      let sql = 'update user set ';
      let updateFields = [];
      if (name != undefined) updateFields.push(`NAME = "${name}"`);
      if (username != undefined) updateFields.push(`USERNAME = "${username}"`);
      if (password != undefined) updateFields.push(`PASSWORD = "${password}"`);
      if (phone != undefined) updateFields.push(`PHONE = "${phone}"`);
      if (city != undefined) updateFields.push(`CITY = "${city}"`);
      if (area != undefined) updateFields.push(`AREA = "${area}"`);
      if (power != undefined) updateFields.push(`POWER = ${power}`);
      if (functions != undefined) updateFields.push(`FUNCTIONS = ${functions}`);
      if (state != undefined) updateFields.push(`STATE = ${state}`);
      if (begin != undefined) updateFields.push(`begin = ${begin}`);
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
// 删除用户
function deletes(id) {
  return new Promise((resolve, reject) => {
    if (!id) {
      reject('Missing required parameter');
    } else {
      let sql = `DELETE FROM user WHERE ID = ${id}`;

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
// 根据城市和functions级别查询用户
function findByCityALevel(city, level) {
  return new Promise((resolve, reject) => {
    let sql =
      'SELECT * FROM user where state = 0 and functions = 1 and city = "' +
      city +
      '" and functions >= ' +
      level;
    db.query(sql, (err, results) => {
      if (err) {
        reject(err);
        throw err;
      }
      resolve(results);
    });
  });
}
// 根据城市查询用户
function findByCity(city) {
  return new Promise((resolve, reject) => {
    let sql = 'SELECT * FROM user where state = 0 and functions = 1 and city = "' + city + '"';
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
  findNum,
  findE,
  findENum,
  findByU,
  findOne,
  deletes,
  login,
  insert,
  findByCity,
  findByCityALevel,
  update,
};
