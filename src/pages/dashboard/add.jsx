import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card } from 'antd';
import { history } from 'umi';
import AddOrEditComp from './addOrEdit';
import req from '../../utils/url';
import { useRequest } from 'ahooks';
import ROUTERS from '../../router';

export default function(props) {
  const { id } = props.location.query;

  const { run: addChartReq } = useRequest(req.dashBoardAdd, {
    manual: true, onSuccess: (resp) => {
      if (!resp?.status) {
        history.push(ROUTERS.dashBoard);
      }
    },
  });


  const addSuccess = (result) => {

    const data = {
      name: result.dataSourceForm.name,
      data_source: JSON.stringify({
        ...result.dataSourceForm,
        selectRouter: result.selectRouter,
      }),
      config: JSON.stringify(result.chatConfigForm),
      chart_type: result.chatType.name,
    };

    addChartReq(id, data);

    console.log('data', data);
  };

  return (
    <PageHeaderWrapper content="新增可视化图表">
      <Card>
        <AddOrEditComp onSuccess={addSuccess}/>
      </Card>
    </PageHeaderWrapper>
  );
}
