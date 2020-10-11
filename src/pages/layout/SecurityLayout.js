import React, { useState } from 'react';
import { useModel, history, Link } from 'umi';
import { Menu, Dropdown, Avatar, message } from 'antd';
import { stringify } from 'querystring';
import Router from '../../router';
import { LogoutOutlined, LockOutlined } from '@ant-design/icons';
import CollectionCreateForm from '../dataShow/dataForm';

import BasicLayout from '@ant-design/pro-layout';
import { useRequest } from 'ahooks';
import req from '../../utils/url';

export default function(props) {
  const { userToken, userInfo, signout, config } = useModel('useAuthModel');
  const [pShow, setPShow] = useState(false);

  const { loading, run } = useRequest(req.changeUserPassword, {
    manual: true, onSuccess: (data => {
      message.success('修改密码成功');
      setPShow(false);
    }),
  });

  if (!userToken) {
    const queryString = stringify({
      redirect: window.location.href,
    });
    history.push(Router.login + `?${queryString}`);
  }

  if (config?.prefix === props?.location?.pathname) {
    history.push(Router.welcome);
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

  const rightMenusClick = (event) => {
    const { key } = event;
    if (key === 'logout') {
      signout();
    } else if (key === 'changePassword') {
      setPShow(true);
    }
  };

  const rightContentRender = (HeaderViewProps) => {
    const menuHeaderDropdown = (
      <Menu selectedKeys={[]} onClick={rightMenusClick}>
        <Menu.Item key="changePassword">
          <LockOutlined/>
          变更密码
        </Menu.Item>
        <Menu.Item key="logout">
          <LogoutOutlined/>
          退出登录
        </Menu.Item>
      </Menu>
    );
    return (
      <Dropdown overlay={menuHeaderDropdown}>
        <span style={{ paddingRight: 30 }}>
          <Avatar size="small" src={userInfo?.avatar} alt="avatar"/>
          <span>{userInfo?.name}</span>
        </span>
      </Dropdown>
    );
  };

  const passwordFields = {
    fields: [{
      name: 'Password',
      types: 'string',
      map_name: 'password',
      xorm_tags: '',
      sp_tags: '',
    }],
  };


  const onPasswordChangeCreate = values => {

    const params = {
      id: parseInt(userInfo.userid),
      user_name: userInfo.name,
      password: values.password,
    };

    run(params);

  };

  return (
    <BasicLayout title={'后台管理'} {...props}
                 breadcrumbRender={(routers = []) => [
                   {
                     path: '/',
                     breadcrumbName: '首页',
                   },
                   ...routers,
                 ]}
                 menuDataRender={menuDataRender}
                 menuItemRender={menuItemRender}
                 rightContentRender={rightContentRender}
    >
      {props.children}


      {
        pShow && <CollectionCreateForm
          fieldsList={passwordFields}
          initValues={{}}
          onCreate={onPasswordChangeCreate}
          onCancel={() => setPShow(false)}
        />
      }


    </BasicLayout>
  );

}
