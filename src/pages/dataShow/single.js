import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import req from '../../utils/url';
import { useModel } from 'umi';
import { useRequest, useMount } from '@umijs/hooks';
import CollectionCreateForm from './dataForm';
import { Button, Spin, Descriptions, Space } from 'antd';
import ROUTERS from '../../router';
import { history } from '../../.umi/core/history';

export default function(props) {
  const { id, routerName } = props.match.params;
  // 自定义action列表
  const [actionList, setActionList] = useState([]);
  // 自定义action弹窗
  const [actionModalShow, setActionModalShow] = useState(false);
  // 选中的action
  const [selectAction, setSelectAction] = useState({});

  // 获取action信息
  const { run: fetchAction } = useRequest(req.getRouterActions, {
    manual: true, onSuccess: (d) => {
      if (!d?.status) {
        setActionList(d);
      }
    },
  });
  // 自定义action提交
  const { run: actionSubmit, loading: actionLoading } = useRequest(req.runActions, {
    manual: true,
    onSuccess: (d) => {
      if (!d?.status) {
        fetchSingle(routerName, id);
        setActionModalShow(false);
      }
    },
  });

  const { data, loading, run: fetchSingle } = useRequest(req.gerSingleData, {
    manual: true,
  });

  console.log('data', data);

  useEffect(() => {
    fetchSingle(routerName, id);
    // 获取自定义action信息
    fetchAction(routerName);
  }, [id]);

  const customAction = (row, action) => {
    setSelectAction(action);
    setActionModalShow(true);
  };

  const customActionCreate = values => {
    actionSubmit(selectAction.path, values, selectAction.methods);
  };

  return (
    <PageHeaderWrapper content={'数据页'}>
      <Spin spinning={loading}>
        <div style={{ background: '#fff', marginBottom: 5 }}>
          {
            data && <Descriptions
              bordered
              column={{ xxl: 6, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
            >
              {Object.keys(data).map((d, i) => {
                return (
                  <Descriptions.Item key={`d_${i}`} label={d}>{data[d]}</Descriptions.Item>
                );
              })}
            </Descriptions>
          }
        </div>


      </Spin>


      <Space>
        <Button href={ROUTERS.data_manage + '?tab=' + routerName}>返回</Button>

        {
          actionList.length ? actionList.map((d, i) => {
            return (
              <Button key={`custom_action_${i}`} onClick={() => customAction(data, d)}>{d.name}</Button>
            );
          }) : null
        }
      </Space>


      {
        actionModalShow ? <CollectionCreateForm
          fieldsList={selectAction}
          initValues={{}}
          loading={actionLoading}
          onCreate={customActionCreate}
          onCancel={() => setActionModalShow(false)}

        /> : null
      }
    </PageHeaderWrapper>
  );
}
