// 1．导入mysql模块
const mysql = require('mysql')
const config = require('../../config/setting')
// 创建数据库连接池，预设MySQL数据库连接参数
const db = mysql.createPool({
    host: config.database.HOST,
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    port: config.database.PORT
})
// 查询evaluate表中的所有记录
function findAll(){
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM evaluate;'
        db.query( sql, (err, results) =>{
            if (err){
                reject(err)
                throw err
            }
            resolve(results)
        })
    })
}
// 根据orderid查询evaluate表中的记录
function findByOrderId(id){
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM evaluate WHERE orderid = ' + id
        db.query( sql, (err, results) =>{
            if (err){
                reject(err)
                throw err
            }
            resolve(results)
        })
    })
}
// 插入新记录到evaluate表
function insert(grade, ms, orderid, state, uodatetime){
    return new Promise((resolve, reject) => {
        let sql = 'insert into evaluate (grade, ms, orderid, state, updatetime) values (' +
            grade + ',"' + ms + '",' + orderid + ',' + state + ',"' + uodatetime + '")'
        db.query( sql, (err, results) =>{
            if (err){
                reject(err)
                throw err
            }
            resolve(results)
        })
    })
}
// 根据id更新evaluate表中的记录
function updateById(id, grade, ms, state) {
    return new Promise((resolve, reject) => {
        let sql = 'update evaluate set '
        let updateFields = [] // 用于存放需要更新的字段
         // 动态构造SET子句，根据传入的参数
        if (grade !== undefined) {
            updateFields.push(`grade = ${grade}`)
        }
        if (ms !== undefined) {
            updateFields.push(`ms = "${ms}"`)
        }
        if (state !== undefined) {
            updateFields.push(`state = ${state}`)
        }
         // 如果有字段需要更新
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
            reject("No valid fields to update")// 没有有效的字段需要更新
        }
    })
}
// 根据state查询evaluate表中的记录
function findByState(state) {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM evaluate WHERE state = ' + state
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
    findByState,
    findByOrderId,
    insert,
    updateById
}