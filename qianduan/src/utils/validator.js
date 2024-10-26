//手机号
const phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
// 中文
const cnReg = /^[\u4e00-\u9fa5]+$/;
export default {
  // 数字验证
  validateNumber: function (rule, value, callback) {
    if (!numberReg.test(value)) {
      callback(new Error('请输入数字'));
    } else {
      callback();
    }
  },
  // 中文验证
  validateCn: function (rule, value, callback) {
    if (!cnReg.test(value)) {
      callback(new Error('请输入中文'));
    } else {
      callback();
    }
  },
  // 电话验证
  validatePhone: function (rule, value, callback) {
    if (!phoneReg.test(value)) {
      callback(new Error('请输入正确的手机号码'));
    } else {
      callback();
    }
  },

};
