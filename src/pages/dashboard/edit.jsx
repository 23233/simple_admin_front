import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Empty } from 'antd';
import { history } from 'umi';
import AddOrEditComp from './addOrEdit';
import req from '../../utils/url';
import { useRequest } from 'ahooks';
import ROUTERS from '../../router';

export default function(props) {
  const { id, screenId } = props.location.query;
  const [item, setItem] = useState({});

  if (!(id && screenId)) {
    return (
      <Empty description={'参数错误'}/>
    );
  }

  // 获取数据
  const { run: getDataReq } = useRequest(req.dashBoardSingleGet, {
    manual: true,
    onSuccess: (resp) => {
      if (!resp?.status) {
        resp.data_source = JSON.parse(resp.data_source);
        resp.config = JSON.parse(resp.config);
        setItem(resp);
      }
    },
  });

  const { run: editChartReq } = useRequest(req.dashBoardEdit, {
    manual: true, onSuccess: (resp) => {
      if (!resp?.status) {
        history.push(ROUTERS.dashBoard);
      }
    },
  });

  useEffect(() => {
    if (id && screenId) {
      getDataReq(screenId, id);
    }
  }, [id, screenId]);


  const editSuccess = (result) => {
    const data = {
      name: result.dataSourceForm.name,
      data_source: JSON.stringify({
        ...result.dataSourceForm,
        selectRouter: result.selectRouter,
      }),
      config: JSON.stringify(result.chatConfigForm),
      chart_type: result.chatType.name,
    };
    editChartReq(screenId, id, data);
  };

  return (
    <PageHeaderWrapper content="编辑图表">
      <Card>
        {
          item && Object.keys(item).length ? <AddOrEditComp onSuccess={editSuccess} initValues={item}/> :
            <Empty description={'获取数据失败'}/>
        }
      </Card>
    </PageHeaderWrapper>
  );
}
