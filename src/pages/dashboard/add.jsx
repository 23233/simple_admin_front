import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React from 'react';
import { Card } from 'antd';
import AddOrEditComp from './addOrEdit';

export default function(props) {
  return (
    <PageHeaderWrapper content="新增可视化">
      <Card>
        <AddOrEditComp />
      </Card>
    </PageHeaderWrapper>
  );
}
