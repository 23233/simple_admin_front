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

// 认领poi
export interface claimPoiReq {
  poi_uid: string
  remark: string
  previews?: Array<string>
}
