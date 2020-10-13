import Req, { prefix } from '@/utils/request';
import {
  addDashBoard,
  addOrEditDashBoardScreen,
  changePasswordReq,
  changeUserRoleReq,
  deleteDataReq,
  loginRegReq,
  pageReq,
} from './url_interface';

// @ts-ignore
const p = `${prefix}${window.sp_prefix}`;


const req = {
  // 获取配置文件
  getConfig: () => {
    return Req.get(`${p}/config`);
  },
  // 获取router所有列信息
  getRouterFields: (routerName: string) => {
    return Req.get(`${p}/v/get_routers_fields/${routerName}`);
  },
  // 获取router所有自定义操作
  getRouterActions: (routerName: string) => {
    return Req.get(`${p}/v/get_routers_action/${routerName}`);
  },
  // 获取router列表
  getRouterLists: () => {
    return Req.get(`${p}/v/get_routers`);
  },
  // 获取router数据
  getRouterData: (routerName: string, params: pageReq) => {
    return Req.get(`${p}/v/${routerName}`, {
      params: params,
    });
  },
  searchRouterData: (routerName: string, searchText: string, cols: Array<string>, full_math: boolean) => {
    return Req.post(`${p}/v/${routerName}/search`, {
      data: {
        search_text: searchText,
        cols: cols,
        full_math: full_math,
      },
    });
  },
  getSingleData: (routerName: string, lineId: number) => {
    return Req.get(`${p}/v/${routerName}/${lineId}`);
  },
  // 删除router选中的数据
  deleteRouterSelectData: (routerName: string, data: deleteDataReq) => {
    return Req.post(`${p}/v/${routerName}/delete`, {
      data: data,
      requestType: 'json',
    });
  },
  // 更新数据
  updateData: (routerName: string, lineId: number, data: any) => {
    return Req.put(`${p}/v/${routerName}/${lineId}`, {
      data: data,
      requestType: 'form',
    });
  },
  // 新增数据
  addData: (routerName: string, data: any) => {
    return Req.post(`${p}/v/${routerName}`, {
      data: data,
      requestType: 'form',
    });
  },
  // 执行action操作
  runActions: (path: string, fields: any, methods: string) => {
    return Req(`${p}/v${path}`, {
      method: methods,
      params: methods === 'GET' ? fields : null,
      data: methods !== 'GET' ? fields : null,
      requestType: 'json',
    });
  },
  // 登录
  accountLogin: (data: loginRegReq) => {
    return Req.post(`${p}/login`, {
      data: data,
    });
  },
  // 注册
  accountReg: (data: loginRegReq) => {
    return Req.post(`${p}/reg`, {
      data: data,
    });
  },
  // 获取当前用户
  queryCurrent: () => {
    return Req.get(`${p}/v/get_current_user`);
  },
  // 变更密码
  changeUserPassword: (data: changePasswordReq) => {
    return Req.post(`${p}/v/change_password`, {
      data: data,
    });
  },
  // 改变权限
  changeUserRoles: (data: changeUserRoleReq) => {
    return Req.post(`${p}/v/change_user_role`, {
      data: data,
    });
  },

  // 数据可视化屏幕
  dashBoardScreenGet: () => {
    return Req.get(`${p}/b/dash_board_screen`);
  },
  dashBoardScreenAddOrEdit: (data: addOrEditDashBoardScreen) => {
    return Req.post(`${p}/b/dash_board_screen`, {
      data: data,
    });
  },
  dashBoardScreenDelete: (id: number) => {
    return Req.delete(`${p}/b/dash_board_screen/${id}`);
  },

  // 数据可视化图表
  dashBoardGet: (screenId: number) => {
    return Req.get(`${p}/b/data_board/${screenId}`);
  },
  dashBoardSingleGet: (screenId: number, id: number) => {
    return Req.get(`${p}/b/data_board/${screenId}/${id}`);
  },
  dashBoardAdd: (screenId: number, data: addDashBoard) => {
    return Req.post(`${p}/b/data_board/${screenId}`, {
      data: data,
    });
  },
  dashBoardEdit: (screenId: number, id: number, data: addDashBoard) => {
    return Req.put(`${p}/b/data_board/${screenId}/${id}`, {
      data: data,
    });
  },
  dashBoardEditSize: (screenId: number, id: number, extra: string) => {
    return Req.put(`${p}/b/data_board_size/${screenId}/${id}`, {
      data: {
        extra,
      },
    });
  },
  dashBoardDelete: (screenId: number, id: number) => {
    return Req.delete(`${p}/b/data_board/${screenId}/${id}`);
  },
  // 数据可视化获取数据源
  dataBoardGetData: (routerName: string, data: object) => {
    return Req.post(`${p}/b/data_board_data/${routerName}`, {
      data: data,
    });
  },

};


export default {
  ...req,
};
