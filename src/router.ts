const ROUTER_PREFIX = '/SP_PREFIX';

const ROUTERS = {
  user: ROUTER_PREFIX + '/user',
  login: ROUTER_PREFIX + '/user/login',
  reg: ROUTER_PREFIX + '/user/reg',
  backend: ROUTER_PREFIX + '/backend',
  welcome: ROUTER_PREFIX + '/welcome',
  changePassword: ROUTER_PREFIX + '/account/changePassword',
  dashBoard: ROUTER_PREFIX + '/dashBoard',
  v: ROUTER_PREFIX + '/v',
  data_manage: ROUTER_PREFIX + '/v/data_manage',
  user_manage: ROUTER_PREFIX + '/v/user_manage',
  single_data: ROUTER_PREFIX + '/v/single',
};

export default ROUTERS;
export const Routes = [
  {
    path: ROUTERS.user,
    routes: [
      {
        name: 'login',
        path: ROUTERS.login,
        component: './user/login/index',
      },
      {
        name: 'reg',
        path: ROUTERS.reg,
        component: './user/login/index',
      },
    ],
  },
  {
    path: '/',
    component: './layout/SecurityLayout',
    routes: [
      {
        path: '/',
        redirect: ROUTERS.welcome,
      },
      {
        path: ROUTERS.welcome,
        authority: ['guest'],
        name: '欢迎界面',
        icon: 'smile',
        component: './Welcome',
      },
      {
        path: ROUTERS.dashBoard,
        name: '数据可视化',
        icon: 'barChart',
        authority: ['admin', 'staff'],
        component: './dashboard/index',
      },
      {
        path: ROUTERS.changePassword,
        name: '更改密码',
        icon: 'lock',
        authority: ['guest'],
        component: './account/changePassword',
      },
      {
        path: ROUTERS.v,
        name: '数据管理',
        icon: 'crown',
        authority: ['admin', 'staff'],
        routes: [
          {
            path: ROUTERS.data_manage,
            name: '表数据',
            icon: 'table',
            component: './dataShow',
            authority: ['staff', 'admin'],
          },
          {
            path: ROUTERS.user_manage,
            name: '后台用户管理',
            icon: 'user',
            component: './userManage/index',
            authority: ['admin'],
          },
          {
            path: ROUTERS.single_data + '/:routerName/:id',
            hideInMenu: true,
            component: './dataShow/single',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
