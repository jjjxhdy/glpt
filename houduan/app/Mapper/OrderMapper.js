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
/**
 * 查询所有订单信息，包括用户和工程师的电话号码
 */
function findAll(){
    return new Promise((resolve, reject) => {
        let sql = 'SELECT o.*, u1.phone AS user_phone, u2.phone AS engineer_phone FROM ' +
            'orders o LEFT JOIN user u1 ON o.userid = u1.id LEFT JOIN user u2 ON o.engineers = u2.id;'
        db.query( sql, (err, results) =>{
            if (err){
                reject(err)
                throw err
            }
            resolve(results)
        })
    })
}
/**
 * 统计不同等级的订单数量
 */
function findLevel(){
    return new Promise((resolve, reject) => {
        let sql = 'SELECT level, COUNT(*) AS count\n' +
            'FROM orders\n' +
            'WHERE level IN (0, 1, 2)\n' +
            'GROUP BY level\n' +
            'order by level;'
        db.query( sql, (err, results) =>{
            if (err){
                reject(err)
                throw err
            }
            resolve(results)
        })
    })
}
/**
 * 统计不同状态的订单数量
 */
function findState(){
    return new Promise((resolve, reject) => {
        let sql = 'SELECT state, COUNT(*) AS count\n' +
            'FROM orders\n' +
            'WHERE state IN (0, 1, 2, 3)\n' +
            'GROUP BY state\n' +
            'order by state;'
        db.query( sql, (err, results) =>{
            if (err){
                reject(err)
                throw err
            }
            resolve(results)
        })
    })
}
/**
 * 根据ID查询单一订单信息
 */
function findOne(id){
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM orders WHERE id = ' + id
        db.query( sql, (err, results) =>{
            if (err){
                reject(err)
                throw err
            }
            resolve(results)
        })
    })
}
/**
 * 根据城市和等级查询符合条件的订单
 */
function findByCityALevel(city, level){
    return new Promise((resolve, reject) => {
        let sql = 'SELECT o.*, u1.phone AS user_phone, u2.phone AS engineer_phone ' +
            'FROM orders o ' +
            'LEFT JOIN user u1 ON o.userid = u1.id ' +
            'LEFT JOIN user u2 ON o.engineers = u2.id ' +
            'WHERE o.state = 0 ' +
            'AND o.city = "' + city + '" ' +
            'AND o.level <= ' + level;
        db.query( sql, (err, results) =>{
            if (err){
                reject(err)
                throw err
            }
            resolve(results)
        })
    })
}
// 根据用户ID查找关联的订单
function findById(userid) {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT o.*, u1.phone AS user_phone, u2.phone AS engineer_phone ' +
            'FROM orders o ' +
            'LEFT JOIN user u1 ON o.userid = u1.id ' +
            'LEFT JOIN user u2 ON o.engineers = u2.id ' +
            'WHERE o.userid = ' + userid + ' OR o.engineers = ' + userid;
        db.query( sql, (err, results) =>{
            if (err){
                reject(err)
                throw err
            }
            resolve(results)
        })
    })
}
// 根据工程师ID查找订单
function findByE(userid) {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT o.*, u1.phone AS user_phone, u2.phone AS engineer_phone ' +
            'FROM orders o ' +
            'LEFT JOIN user u1 ON o.userid = u1.id ' +
            'LEFT JOIN user u2 ON o.engineers = u2.id ' +
            'WHERE o.engineers = ' + userid;
        db.query( sql, (err, results) =>{
            if (err){
                reject(err)
                throw err
            }
            resolve(results)
        })
    })
}
// 根据订单类型查找订单
function findByType(type) {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT o.*, u1.phone AS user_phone, u2.phone AS engineer_phone ' +
            'FROM orders o ' +
            'LEFT JOIN user u1 ON o.userid = u1.id ' +
            'LEFT JOIN user u2 ON o.engineers = u2.id ' +
            'WHERE o.type = "' + type + '"';
        db.query( sql, (err, results) =>{
            if (err){
                reject(err)
                throw err
            }
            resolve(results)
        })
    })
}
// 根据ID和类型查找订单
function findByIdType(id, type) {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT o.*, u1.phone AS user_phone, u2.phone AS engineer_phone ' +
            'FROM orders o ' +
            'LEFT JOIN user u1 ON o.userid = u1.id ' +
            'LEFT JOIN user u2 ON o.engineers = u2.id ' +
            'WHERE o.type = "' + type + '" and o.engineers = ' + id;
        db.query( sql, (err, results) =>{
            if (err){
                reject(err)
                throw err
            }
            resolve(results)
        })
    })
}
// 根据城市查找订单
function findByCity(city){
    return new Promise((resolve, reject) => {
        let sql = 'SELECT o.*, u1.phone AS user_phone, u2.phone AS engineer_phone ' +
            'FROM orders o ' +
            'LEFT JOIN user u1 ON o.userid = u1.id ' +
            'LEFT JOIN user u2 ON o.engineers = u2.id ' +
            'WHERE o.state = 0 ' +
            'AND o.city = "' + city + '"';
        db.query( sql, (err, results) =>{
            if (err){
                reject(err)
                throw err
            }
            resolve(results)
        })
    })
}
// 插入新的订单
function insert(type, level, city, area, userid){
    return new Promise((resolve, reject) => {
        let sql = 'insert into orders (type, level, city, area, userid, state) values ("' +
            type + '",' + level + ',"' + city + '","' + area + '",' + userid + ', 0)'
        db.query( sql, (err, results) =>{
            if (err){
                reject(err)
                throw err
            }
            resolve(results)
        })
    })
}
// 取消订单
function cancel(id) {
    return new Promise((resolve, reject) => {
        let sql = 'UPDATE orders SET';
        const updates = [];
        const params = [];
        updates.push(' enable = ?');
        params.push(0);
        updates.push(' state = ?');
        params.push(3);
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
// 更新指定ID的订单信息
function updateById(id, type, level, state, city, area, userid, engineers) {
    return new Promise((resolve, reject) => {
        let sql = 'update orders set '
        let updateFields = []

        if (type !== undefined) {
            updateFields.push(`type = "${type}"`)
        }

        if (level !== undefined) {
            updateFields.push(`level = ${level}`)
        }

        if (state !== undefined) {
            updateFields.push(`state = ${state}`)
        }

        if (city !== undefined) {
            updateFields.push(`city = "${city}"`)
        }

        if (area !== undefined) {
            updateFields.push(`area = "${area}"`)
        }

        if (userid !== undefined) {
            updateFields.push(`userid = ${userid}`)
        }

        if (engineers !== undefined) {
            updateFields.push(`engineers = ${engineers}`)
        }

        if (updateFields.length > 0) {
            sql += updateFields.join(', ') + ` where id = ${id}`
            db.query(sql, (err, results) => {
                if (err) {
                    reject(err)
                    throw err
                }
                resolve(results)
            })
        } else {
            reject("No valid fields to update")
        }
    })
}
// 通过ID更新工程师信息
function updateEngineersById(id, engineers) {
    return new Promise((resolve, reject) => {
        let sql = 'update orders set engineers = ' + engineers + ' where id = ' + id
        db.query(sql, (err, results) => {
            if (err) {
                reject(err)
                throw err
            }
            resolve(results)
        })
    })
}

module.exports = {
    findAll,
    findLevel,
    findState,
    findByCity,
    findByType,
    findByIdType,
    cancel,
    findOne,
    findByCityALevel,
    findById,
    findByE,
    updateById,
    updateEngineersById,
    insert
}