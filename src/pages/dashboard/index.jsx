import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Card, message } from 'antd';
import { history } from 'umi';
import { useRequest } from '@umijs/hooks';
import req from '@/utils/url';

import { useModel } from 'umi';

export default function(props) {
  const { userInfo } = useModel('useAuthModel');

  return (
    <PageHeaderWrapper content="用户仪表台">
      <Card>
        <h2>仪表台</h2>
      </Card>
    </PageHeaderWrapper>
  );
}
