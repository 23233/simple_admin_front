import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import './index.less';
import { useModel, Helmet } from 'umi';


export default (props) => {
  const { config } = useModel('useAuthModel');

  return (
    <ConfigProvider locale={zhCN}>
      <Helmet encodeSpecialCharacters={false}>
        <title>{config?.name || '后台管理系统'}</title>
      </Helmet>
      {props.children}
    </ConfigProvider>
  );
}
