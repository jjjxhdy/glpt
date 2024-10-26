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
// 查询inven表中的所有记录，并计算总库存（新库存+旧库存）
function findAll(){
    return new Promise((resolve, reject) => {
        let sql = 'SELECT *, (new + old) AS all_inven FROM inven'
        db.query( sql, (err, results) =>{
            if (err){
                reject(err)
                throw err
            }
            resolve(results)
        })
    })
}
// 根据id查询inven表中的单个记录
function findById(id){
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM inven where id = ' + id
        db.query( sql, (err, results) =>{
            if (err){
                reject(err)
                throw err
            }
            resolve(results)
        })
    })
}
// 根据名称查询inven表中的记录
function findByName(name){
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM inven where name = "' + name + '"'
        db.query( sql, (err, results) =>{
            if (err){
                reject(err)
                throw err
            }
            resolve(results)
        })
    })
}
// 添加或更新库存，如果存在则增加新库存量，否则插入新记录
function add(name, newQ) {
    if (newQ == undefined) {
        newQ = 0;
    }
    return new Promise((resolve, reject) => {
        let checkSql = 'SELECT * FROM inven WHERE name = "' + name + '"';// 检查名称是否已存在
        db.query(checkSql, (err, results) => {
            if (err) {
                reject(err);
                throw err;
            }
            if (results.length > 0) { // 如果存在，则更新新库存量
                let currentNew = results[0].new;
                let updatedNew = currentNew + newQ;
                let updateSql = 'UPDATE inven SET new = ? WHERE id = ?';
                console.log(updateSql)
                db.query(updateSql, [updatedNew, results[0].id], (err, results) => {
                    if (err) {
                        reject(err);
                        throw err;
                    }
                    resolve(results);
                });
            } else {
                // 如果数据库中没有该 name，则插入新记录
                let insertSql = 'INSERT INTO inven (name, new) VALUES (?, ?)';
                db.query(insertSql, [name, newQ], (err, results) => {
                    if (err) {
                        reject(err);
                        throw err;
                    }
                    resolve(results);
                });
            }
        });
    });
}
// 更新inven表中的记录
function update(id, name, newQuantity, old) {
    return new Promise((resolve, reject) => {
        let checkSql = 'SELECT * FROM inven WHERE id = ?';
        db.query(checkSql, [id], (err, results) => {
            if (err) {
                reject(err);
                throw err;
            }
            if (results.length === 0) {
                reject(new Error('No inventory found with the given ID'));
            } else {
                let sql = 'UPDATE inven SET';
                let values = [];
                if (name !== undefined) {
                    sql += ' name = ?,';
                    values.push(name);
                }
                if (newQuantity !== undefined) {
                    sql += ' new = ?,';
                    values.push(newQuantity);
                }
                if (old !== undefined) {
                    sql += ' old = ?,';
                    values.push(old);
                }
                sql = sql.slice(0, -1);
                sql += ' WHERE id = ?';
                values.push(id);
                db.query(sql, values, (err, results) => {
                    if (err) {
                        reject(err);
                        throw err;
                    }
                    resolve(results);
                });
            }
        });
    });
}
// 根据id删除inven表中的记录
function deletes(id) {
    return new Promise((resolve, reject) => {
        let sql = 'DELETE FROM inven WHERE id = ' + id
        db.query( sql, (err, results) =>{
            if (err){
                reject(err)
                throw err
            }
            resolve(results)
        })
    })
}

module.exports = {
    findAll,
    findById,
    findByName,
    add,
    update,
    deletes
}