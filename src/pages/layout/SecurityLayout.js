import React from 'react';
import { useModel, history, Link } from 'umi';
import { stringify } from 'querystring';
import Router from '../../router';

import BasicLayout from '@ant-design/pro-layout';

export default function(props) {
  const { userToken, userInfo } = useModel('useAuthModel');

  if (!userToken) {
    const queryString = stringify({
      redirect: window.location.href,
    });
    history.push(Router.login + `?${queryString}`);
  }

  const checkPermissions = (authority, currentAuthority, target, Exception) => {
    // 没有判定权限.默认查看所有
    // Retirement authority, return target;
    if (!authority) {
      return target;
    } // 数组处理

    if (Array.isArray(authority)) {
      if (Array.isArray(currentAuthority)) {
        if (currentAuthority.some(item => authority.includes(item))) {
          return target;
        }
      } else if (authority.includes(currentAuthority)) {
        return target;
      }

      return Exception;
    } // string 处理

    if (typeof authority === 'string') {
      if (Array.isArray(currentAuthority)) {
        if (currentAuthority.some(item => authority === item)) {
          return target;
        }
      } else if (authority === currentAuthority) {
        return target;
      }

      return Exception;
    } // Promise 处理

    if (authority instanceof Promise) {
      return <PromiseRender ok={target} error={Exception} promise={authority}/>;
    } // Function 处理

    if (typeof authority === 'function') {
      try {
        const bool = authority(currentAuthority); // 函数执行后返回值是 Promise

        if (bool instanceof Promise) {
          return <PromiseRender ok={target} error={Exception} promise={bool}/>;
        }

        if (bool) {
          return target;
        }

        return Exception;
      } catch (error) {
        throw error;
      }
    }

    throw new Error('unsupported parameters');
  };

  const menuDataRender = (menuList) => {
    return menuList.map((item) => {
      const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
      return checkPermissions(item.authority, userInfo?.roles, localItem, null);
    });
  };

  const menuItemRender = (menuItemProps, defaultDom) => {
    if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
      return defaultDom;
    }
    return <Link to={menuItemProps.path}>{defaultDom}</Link>;
  };


  return <BasicLayout title={'后台管理'} {...props}
                      breadcrumbRender={(routers = []) => [
                        {
                          path: '/',
                          breadcrumbName: '首页',
                        },
                        ...routers,
                      ]}
                      menuDataRender={menuDataRender}
                      menuItemRender={menuItemRender}>
    {props.children}
  </BasicLayout>;

}
