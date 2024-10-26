const evaluateMapper = require("../Mapper/evaluateMapper")
const orderMapper = require("../Mapper/OrderMapper");
/**
 * 开始自动处理超时评价的定时任务
 * 此函数设定一个定时器，定时检查是否有超过24小时未处理的评价，
 * 并对超时的评价进行自动处理：更新评价状态为自动评价，同时更新关联订单状态为已完成。
 */
function begin() {
    // 设置定时器，每隔1秒执行一次检查任务
    setInterval(async function () {
        // 查询状态为0（待处理）的评价数据
        let data = await evaluateMapper.findByState(0);
        const currentTime = new Date(); // 获取当前时间
        // 遍历待处理的评价
        for (let i = 0;i<data.length;i++) {
            // 计算评价的更新时间与当前时间的差值（单位：小时）
            var time2 = new Date(data[i].updatetime);
            var diff = Math.abs(currentTime - time2);
            var diffHours = diff / (1000 * 60 * 60);
            // 判断是否超过24小时未处理
            if (diffHours >= 24) {
                // 更新评价状态为自动评价（状态代码100），评价内容为"自动评价"，评价等级为1
                evaluateMapper.updateById(data[i].id, 100, "自动评价", 1)
                // 更新关联的订单状态为已完成（状态代码5）
                orderMapper.updateById(data[i].orderid,undefined, undefined, 5, undefined, undefined, undefined, undefined);
            }
        }
    }, 1000)
}

module.exports = {
    begin
}