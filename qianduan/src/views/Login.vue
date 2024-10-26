<template>
  <div class="login-page">
    <!-- 登录/忘记密码框 -->
    <div class="login-box">
      <el-col :class="translateLeft" :span="10">
        <!-- 登录 -->
        <div v-if="notforget">
          <div class="logo">
            <!-- <icon name="logo" :scale="8"></icon> -->
            <div class="title">
              <a>
                <img style="height: 60px" src="../assets/img/logo.jpg" alt="" /><span
                  class="subtitle"
                  >专业 负责</span
                >
              </a>
            </div>
          </div>
          <!-- 表单 -->
          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            :hide-required-asterisk="true"
          >
            <!-- 用户登录账号 -->
            <el-form-item prop="username">
              <el-input
                ref="username"
                v-model="loginForm.username"
                placeholder="Username"
                name="username"
                type="text"
                tabindex="1"
                auto-complete="on"
              >
                <i slot="prefix" class="el-icon-user"></i
              ></el-input>
            </el-form-item>
            <!-- 用户登录密码 -->
            <el-form-item prop="password">
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="Password"
                name="password"
                tabindex="2"
                auto-complete="on"
                @keyup.enter.native="handleLogin"
                :show-password="true"
                ><i slot="prefix" class="el-icon-lock"></i
              ></el-input>
            </el-form-item>
            <!-- 登录按钮 -->
            <el-form-item class="btn">
              <el-button :loading="loading" type="primary" @click="handleLogin">Login</el-button>
            </el-form-item>
          </el-form>
          <!-- 表单底部 -->
          <div class="login-footer">
            <el-col :span="12">
              <el-checkbox v-model="remember" name="type">记住密码</el-checkbox>
            </el-col>
            <el-col class="forgetpwd" :span="12">
              <el-link @click="wrapSwitch(false)">没有账号？立即注册</el-link>
            </el-col>
          </div>
        </div>
        <!-- 注册账号 -->
        <div v-else>
          <div class="title forgetwrap-title">
            <a> <span>@</span><span class="subtitle">欢迎加入</span> </a>
          </div>
          <div class="forget-form">
            <el-form
              :model="registerForm"
              :rules="forgetRules"
              ref="registerForm"
              :inline="false"
              label-width="100px"
              :hide-required-asterisk="true"
            >
              <el-form-item label="用户账号" prop="forgetusername">
                <el-input
                  v-model="registerForm.forgetusername"
                  placeholder="Username由数字以及字母组成"
                ></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="pass">
                <el-input
                  type="password"
                  v-model="registerForm.pass"
                  autocomplete="off"
                  placeholder="Password由数字以及字母组成"
                  :show-password="true"
                ></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="checkPass">
                <el-input
                  type="password"
                  v-model="registerForm.checkPass"
                  autocomplete="off"
                  placeholder="请再次输入密码"
                  :show-password="true"
                ></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="registerForm.phone" placeholder="phone"></el-input>
              </el-form-item>
              <el-form-item label="姓名" prop="realName">
                <el-input v-model="registerForm.realName" placeholder="Name"></el-input>
              </el-form-item>
              <el-form-item label="地区" prop="region">
                <el-select v-model="registerForm.region" placeholder="请选择所在地区">
                  <el-option-group v-for="group in options" :key="group.label" :label="group.label">
                    <el-option
                      v-for="item in group.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>
              <el-form-item label="账户类型">
                <el-radio-group v-model="registerForm.count" prop="count">
                  <el-radio label="客户"></el-radio>
                  <el-radio label="工程师"></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="工程师等级" v-show="registerForm.count == '工程师'">
                <el-radio-group v-model="registerForm.engineer" prop="count">
                  <el-radio label="初级"></el-radio>
                  <el-radio label="中级"></el-radio>
                  <el-radio label="高级"></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item class="btn">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-button @click="wrapSwitch(true)" type="primary">返回</el-button>
                  </el-col>
                  <el-col :span="12">
                    <el-button @click="forgetHandle" type="primary">立即注册</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-col>
      <el-col :class="translateRight" :span="14">
        <div class="wallpaper"></div>
      </el-col>
    </div>
  </div>
</template>

<script>
import options from '../utils/selectdata.js';

export default {
  name: 'Login',
  data() {
    const validateConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.registerForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        // username: 'admin001',
        // password: '123456',
      },
      loginRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [
          { required: true, message: '用户密码不能为空', trigger: 'blur' },
          { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' },
        ],
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      remember: true,
      loading: false,
      switchLeft: false,
      switchRight: false,
      notforget: true,
      options,
      // 注册列表
      registerForm: {
        forgetusername: '', //用户登录名
        phone: '',
        pass: '',
        checkPass: '',
        realName: '', //用户姓名
        confirmPassword: '',
        region: '',
        count: '客户',
        engineer: '',
      },
      forgetRules: {
        forgetusername: [
          {
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{4,20}$/,
            message: '账号必须是由4-20位字母+数字组合',
            trigger: 'blur',
            required: true,
          },
        ],
        phone: [
          {
            message: '请输入正确的手机号码',
            pattern: /^1[3456789]\d{9}$/,
            trigger: 'blur',
            required: true,
            validator: this.$validator.validatePhone,
          },
        ],
        pass: [
          { required: true, message: '用户密码不能为空', trigger: 'blur' },
          { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' },
        ],
        checkPass: [
          {
            required: true,
            validator: validateConfirmPassword,
          },
        ],
        realName: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
        region: [{ required: true, message: '请选择所在地区', trigger: 'change' }],
        count: [{ required: true, message: '请选择账号类型', trigger: 'change' }],
        // engineer: [{ required: true, message: '请选择账号类型', trigger: 'change' }],
      },
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  //登录注册切换动画计算属性
  computed: {
    translateLeft() {
      return {
        'translate-left': true,
        'switch-left': this.switchLeft,
      };
    },
    translateRight() {
      return {
        'translate-right': true,
        'switch-right': this.switchLeft,
      };
    },
  },
  methods: {
    //登录注册切换动画计算属性
    wrapSwitch(state) {
      this.switchLeft = !this.switchLeft;
      this.switchRight = !this.switchRight;
      setTimeout(() => {
        this.notforget = state;
        this.$refs[state ? 'registerForm' : 'loginForm'].resetFields();
      }, 300);
    },
    // 密码加密
    encryptPassword(password) {
      return this.$tools.encrypt(password);
    },
    //密码解密
    decryptPassword(password) {
      return this.$tools.decrypt(password);
    },
    forgetHandle() {
      // this.$message.success(this.$t('login.pwdChanged'));
      // console.log(this.$refs.registerForm);
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let city = this.$tools.findGroupByValue(this.registerForm.region, this.options);
          let functions = this.registerForm.count == '客户' ? 0 : 1;
          let power;
          switch (this.registerForm.engineer) {
            case '初级':
              power = 0;
              break;
            case '中级':
              power = 1;
              break;
            case '高级':
              power = 2;
              break;
            default:
              power = 3;
          }
          let canshu = {
            name: this.registerForm.realName,
            username: this.registerForm.forgetusername,
            password: this.encryptPassword(this.registerForm.pass),
            phone: this.registerForm.phone,
            city: city,
            area: this.registerForm.region,
            power: power,
            functions: functions,
          };
          this.apijs
            .register(canshu)
            .then((resx) => {
              // console.log(res);
              let res = resx;
              // console.log(res);
              this.$message({
                message: '注册成功！',
                type: 'success',
              });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
          this.wrapSwitch(true);
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = '';
      } else {
        this.passwordType = 'password';
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let canshu = {
            username: this.loginForm.username,
            password: this.encryptPassword(this.loginForm.password),
          };
          this.apijs
            .signin(canshu)
            .then((resx) => {
              // console.log(res);
              let res = resx.data[0];
              sessionStorage.setItem('roletype', res.functions);
              sessionStorage.setItem('userid', res.id);
              sessionStorage.setItem('username', res.username);
              sessionStorage.setItem('loginstatus', true);
              if (res.begin == 0 && res.fuctions !== 2) {
                this.$message({
                  message: '请联系管理员审核！',
                  type: 'warning',
                });
              } else {
                if (res.functions == 2) {
                  //管理员
                  this.$router.push({ path: '/home' });
                } else if (res.functions == 1) {
                  //工程师
                  this.$router.push({ path: '/order' });
                } else {
                  //用户
                  this.$router.push({ path: '/transaction' });
                }
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log('error submit!!');
          this.loading = false;

          return false;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 100%;

  .translate-left,
  .translate-right {
    will-change: auto;
    transform: translateX(0px);
    transition: transform 0.6s ease-in-out;
  }

  .switch-left {
    transform: translateX(575px);
  }

  .switch-right {
    transform: translateX(-425px);
  }
}

.login-box {
  width: 1000px;
  height: 630px;
  background: white;
  border-radius: 4px;
  transform: translateY(-10px);
  box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.12), 0 0 5px 0 rgba(0, 0, 0, 0.04);

  .el-col {
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  // 右侧背景图
  .wallpaper {
    width: 100%;
    height: 100%;
    background: url('../assets/img/loginwallpaper.jpg');
    background-size: cover;
  }

  .logo {
    padding-top: 0px;
  }

  .title {
    font-weight: bold;
    color: #42b983;
    padding-top: 8px;
    font-size: 22px;

    a {
      cursor: cell;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px 0;
    }

    a:before {
      content: '[';
      opacity: 0;
      margin-right: 10px;
      transform: translateX(-10px);
      transition: transform 0.2s, opacity 0.2s;
    }

    a:after {
      content: ']';
      opacity: 0;
      margin-left: 10px;
      transform: translateX(10px);
      transition: transform 0.2s, opacity 0.2s;
    }

    a:hover:before,
    a:hover:after {
      opacity: 1;
      transform: translateX(0);
    }

    .subtitle {
      color: #2e5273;
    }
  }

  .forgetwrap-title {
    padding-top: 10px;
    padding-left: 15px;
  }

  .forget-form {
    padding: 0px 40px 0 10px;
    padding-bottom: 0;
  }

  .login-form {
    position: relative;
    // width: 300px;
    max-width: 100%;
    padding: 50px 35px 0;
    margin: 0 auto;
    overflow: hidden;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  .forget-form,
  .login-form {
    .el-form-item__content {
      line-height: 40px;
    }

    .el-input__inner {
      padding-top: 2px;
      height: 40px;
      line-height: 40px;
    }

    .btn button {
      width: 100%;
      padding: 12px 20px;
    }
  }

  .login-footer {
    padding: 10px 30px;

    .forgetpwd {
      text-align: right;

      span {
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        color: #606266;
      }
    }
  }
}
</style>
