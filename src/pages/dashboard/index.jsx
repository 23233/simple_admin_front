import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Card, message } from 'antd';
import { history } from 'umi';
import { useRequest } from '@umijs/hooks';
import req from '@/utils/url';
import AddOrEditComp from './addOrEdit';
import { useModel } from 'umi';

export default function(props) {
  const { userInfo } = useModel('useAuthModel');
  const [screens, setScreens] = useState([]);

  return (
    <PageHeaderWrapper content="用户仪表台">
      <Card>
        <AddOrEditComp />
      </Card>
    </PageHeaderWrapper>
  );
}
