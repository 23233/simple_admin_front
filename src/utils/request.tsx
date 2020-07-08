/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification, Button } from 'antd';
import React from 'react';
import { stringify } from 'querystring';
import { history } from 'umi';
import Router from '../router';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
/**
 * 异常处理程序
 */

const errorHandler = async (error: any) => {

  const { response } = error;
  if (response && response.status) {
    // @ts-ignore
    let content = codeMessage[response.status] || response.statusText;
    let res = await response.json();
    if (typeof res === 'object') {
      if (Array.isArray(res)) {
        content = res[0];
        if (typeof res[0] === 'object') {
          let keys = Object.keys(res[0])[0];
          content = res[0][keys].toString();
        }
      } else {
        content = res[Object.keys(res)[0]].toString();
      }
    }
    const { status, url } = response;
    // 未登录或登录状态过期
    if (response.status === 401) {
      const queryString = stringify({
        redirect: window.location.href,
      });
      localStorage.removeItem('simple_token');
      history.push(Router.login + `?${queryString}`);
      return;
    }
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: content,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }

  return response;
};
/**
 * 配置request请求时的默认参数
 */

const request = extend({
  errorHandler,
  // 默认错误处理
  // credentials: 'include', // 默认请求是否带上cookie
  // requestType: 'form',
});

request.interceptors.request.use((url, options) => {

  let token = localStorage.getItem('simple_token');
  if (token) {
    if (token.startsWith('"')) {
      token = JSON.parse(token);
    }
    // @ts-ignore
    options.headers.Authorization = `Bearer ${token}`;
  }
  return (
    {
      url: url,
      options: options,
    }
  );
});
export const prefix = process.env.NODE_ENV === 'production' ? '/' : '/api/';

export default request;
