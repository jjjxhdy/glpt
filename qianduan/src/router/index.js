import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

//以下代码解决路由地址重复的报错问题(一劳永逸)
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

const routes = [
  {
    path: '/',
    name: 'Login',
    component: (resolve) => require(['../views/Login.vue'], resolve),
  },
  {
    path: '/Home',
    name: 'Home',
    component: (resolve) => require(['../views/Layout/index.vue'], resolve),
    redirect: { name: 'home' }, //输入路由home会重定向到Preferred页面(一进来显示的页面)
    children: [
      {
        path: '/Home',
        name: '首页',
        component: (resolve) => require(['../views/Home.vue'], resolve),
      },
      {
        path: '/order',
        name: 'order',
        component: (resolve) => require(['../views/order.vue'], resolve),
      },
      {
        path: '/transaction',
        name: 'transaction',
        component: (resolve) => require(['../views/transaction.vue'], resolve),
      },
      {
        path: '/Usermanagement',
        name: 'Usermanagement',
        component: (resolve) => require(['../views/Usermanagement.vue'], resolve),
      },
      {
        path: '/Replacmanagement',
        name: 'Replacmanagement',
        component: (resolve) => require(['../views/Replacmanagement.vue'], resolve),
      },
      {
        path: '/partmanage',
        name: 'partmanage',
        component: (resolve) => require(['../views/partmanage.vue'], resolve),
      },
      {
        path: '/allordernum',
        name: 'allordernum',
        component: (resolve) => require(['../views/allordernum.vue'], resolve),
      },
      {
        path: '/inventoryparts',
        name: 'inventoryparts',
        component: (resolve) => require(['../views/inventoryparts.vue'], resolve),
      },
      {
        path: '/histparts',
        name: 'histparts',
        component: (resolve) => require(['../views/histparts.vue'], resolve),
      },
    ],
  },
];

const router = new Router({
  // base: process.env.BASE_URL,
  // mode: "history",
  routes,
});
// 全局前置守卫，每次路由切换前被调用
router.beforeEach((to, from, next) => {
  // 判断当前要进入的路由是否为登录页面（'Login'）
  if (to.name != 'Login' && !sessionStorage.getItem('loginstatus')) {
    // 如果不是登录页面，则检查 sessionStorage 中是否存在登录状态标识 'loginstatus'
    next({ name: 'Login' });
  } else {
    next();
  }
});
// router.beforeEach((to, from, next) => {
//   var token = storage.get('token');
//   var roleName = storage.get('roleName');
//   console.log(roleName);
//   if (token && to.name != 'Login') {
//     // 有token 但不是去 login页面 通过
//     if (to.name == 'InspectionRecords' && roleName == 'system') {
//       next();
//     } else if (to.name == 'InspectionRecords' && roleName != 'system') {
//       next();
//     } else if (to.name != 'InspectionRecords' && roleName == 'system') {
//       next();
//     } else {
//       next((vm) => vm.$router.replace('/InspectionRecords'));
//     }
//   } else if (token && to.name == 'Login') {
//     // 有token 但是去 login页面 不通过 重定向到首页
//     next((vm) => vm.$router.replace('/Login'));
//   } else if (!token && to.name != 'Login') {
//     // 没有token 但不是去 login页面 不通过（未登录不给进入）
//     next('/Login');
//   } else {
//     // 剩下最后一种 没有token 但是去 login页面 通过
//     next((vm) => vm.$router.replace('/Login'));
//   }
// });

export default router;
