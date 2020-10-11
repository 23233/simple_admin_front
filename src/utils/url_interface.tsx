export interface pageReq {
  page?: number
}

// 删除数据
export interface deleteDataReq {
  ids: string
}

// 登录注册用
export interface loginRegReq {
  user_name: string,
  password: string
}

// 改变用户密码
export interface changePasswordReq {
  id: number,
  user_name: string,
  password: string
}

// 改变用户权限
export interface changeUserRoleReq {
  id: number
  role: string
  add?: boolean
}


// 新增或修改数据仪表台屏幕
export interface addOrEditDashBoardScreen {
  id?: number,
  name: string,
  is_default?: boolean
}

// 新增图表
export interface addDashBoard {
  name: string,
  data_source: string,
  config: string,
  chat_type: string,
}
