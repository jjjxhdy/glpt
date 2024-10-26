import CryptoJS from 'crypto-js';
// 数据处理以及格式化方法合集
export default {
  //找出哪个城市
  findGroupByValue: function (value, options) {
    for (let i = 0; i < options.length; i++) {
      const group = options[i];
      for (let j = 0; j < group.options.length; j++) {
        if (group.options[j].value === value) {
          return group.label;
        }
      }
    }
    return null;
  },
  //状态
  statefunctions(state) {
    let powerx;
    switch (state) {
      case 0:
        powerx = {
          type: 'info',
          label: '待审核',
        };
        break;
      case 1:
        powerx = {
          type: 'success',
          label: '同意',
        };
        break;
      case 2:
        powerx = {
          type: 'warning',
          label: '驳回',
        };
        break;
      case 3:
        powerx = {
          type: 'danger',
          label: '已撤销',
        };
        break;
    }
    return powerx;
  },
  //工程师等级
  formatpower(power) {
    let powerx;
    switch (power) {
      case 3:
        powerx = {
          type: 'info',
          label: '无',
        };
        break;
      case 0:
        powerx = {
          type: 'success',
          label: '初级',
        };
        break;
      case 1:
        powerx = {
          type: 'warning',
          label: '中级',
        };
        break;
      default:
        powerx = {
          type: 'danger',
          label: '高级',
        };
    }
    return powerx;
  },
  //角色区别
  formatfunctions(functions) {
    let functionsx;
    switch (functions) {
      case 2:
        functionsx = {
          type: '',
          label: '管理员',
        };
        break;
      case 1:
        functionsx = {
          type: 'success',
          label: '工程师',
        };
        break;
      case 0:
        functionsx = {
          type: 'warning',
          label: '客户',
        };
        break;
    }
    return functionsx;
  },
  //故障等级
  formatlevel(level) {
    let levelx;
    switch (level) {
      case 0:
        levelx = {
          type: '',
          label: '一级',
        };
        break;
      case 1:
        levelx = {
          type: 'success',
          label: '二级',
        };
        break;
      case 2:
        levelx = {
          type: 'warning',
          label: '三级',
        };
        break;
    }
    return levelx;
  },
  //工单状态
  orderstatetools(state) {
    let statex;
    switch (state) {
      case 0:
        statex = {
          type: '',
          label: '未接单',
        };
        break;
      case 1:
        statex = {
          type: 'success',
          label: '已接单',
        };
        break;
      case 2:
        statex = {
          type: 'warning',
          label: '待评价',
        };
        break;
      case 3:
        statex = {
          type: 'danger',
          label: '管理员驳回换件申请',
        };
        break;
      case 4:
        statex = {
          type: 'danger',
          label: '已经撤销',
        };
        break;
      default:
        statex = {
          type: 'success',
          label: '已评价',
        };
    }
    return statex;
  },
  huanjianstatetools(state) {
    let statex;
    switch (state) {
      case 0:
        statex = {
          type: '',
          label: '未审核',
        };
        break;
      case 1:
        statex = {
          type: 'success',
          label: '待出库',
        };
        break;
      case 2:
        statex = {
          type: 'warning',
          label: '待入库',
        };
        break;
      case 3:
        statex = {
          type: 'warning',
          label: '结束',
        };
        break;
      default:
        statex = {
          type: 'danger',
          label: '已驳回',
        };
    }
    return statex;
  },
  //密码加密
  encrypt(password) {
    const key = CryptoJS.enc.Utf8.parse('1234567812345678');
    const encrypted = CryptoJS.AES.encrypt(password, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  },
  //密码解密
  decrypt(encryptedPassword) {
    const key = CryptoJS.enc.Utf8.parse('1234567812345678');
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedPassword, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decryptedBytes.toString(CryptoJS.enc.Utf8);
  },
};
