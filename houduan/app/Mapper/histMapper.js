// 1．导入mysql模块
const mysql = require('mysql')
const config = require('../../config/setting')

const db = mysql.createPool({
    host: config.database.HOST,
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    port: config.database.PORT
})
// 查询hist表中的所有记录
function findAll(){
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM hist' // 查询所有列
        db.query( sql, (err, results) =>{ // 执行SQL查询
            if (err){
                reject(err)
                throw err
            }
            resolve(results)
        })
    })
}
// 根据ID查询hist表中的一条记录
function findOne(id){
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM hist where id = ' + id
        db.query( sql, (err, results) =>{
            if (err){
                reject(err)
                throw err
            }
            resolve(results)
        })
    })
}
// 向hist表中添加一条记录
function add(name, num) {
    if (name == undefined) {
        name = "";
    }
    if (num == undefined) {
        num = 0;
    }
    return new Promise((resolve, reject) => {
        let sql = 'INSERT INTO hist (name, num, state) VALUES (?, ?, ?)'
        db.query(sql, [name, num, 0], (err, results) => {
            if (err) {
                reject(err);
                throw err;
            }
            resolve(results);
        });
    });
}
// 删除hist表中的一条记录
function deletes(id) {
    return new Promise((resolve, reject) => {
        let sql = 'DELETE FROM hist WHERE id = ' + id
        db.query( sql, (err, results) =>{
            if (err){
                reject(err)
                throw err
            }
            resolve(results)
        })
    })
}
// 更新hist表中的一条记录
function update(id, name, num, state) {
    return new Promise((resolve, reject) => {
        let sql = 'UPDATE hist SET';
        const updates = [];
        const params = [];
        // 动态构建更新字段和参数
        if (name !== undefined) {
            updates.push(' name = ?');
            params.push(name);
        }
        if (num !== undefined) {
            updates.push(' num = ?');
            params.push(num);
        }
        if (state !== undefined) {
            updates.push(' state = ?');
            params.push(state);
        }
         // 没有有效的更新条件则拒绝Promise
        if (updates.length === 0) {
            reject(new Error("No valid parameters provided"));
            return;
        }
        sql += updates.join(',') + ' WHERE id = ?';
        params.push(id);

        db.query(sql, params, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}
// 取消hist表中的某条记录，这里假设通过修改enable字段实现
function cancel(id) {
    return new Promise((resolve, reject) => {
        let sql = 'UPDATE hist SET';
        const updates = [];
        const params = [];
        updates.push(' enable = ?');
        params.push(0);
        sql += updates.join(',') + ' WHERE id = ?';
        params.push(id);

        db.query(sql, params, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}


module.exports = {
    findAll,
    findOne,
    add,
    update,
    cancel,
    deletes
}