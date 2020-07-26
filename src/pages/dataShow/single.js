import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import req from '../../utils/url';
import { Link, useModel, history } from 'umi';
import { useRequest, useMount } from '@umijs/hooks';
import CollectionCreateForm from './dataForm';
import { Button, Spin, Typography, Space, Tooltip, Statistic, Row, Col } from 'antd';
import ROUTERS from '../../router';

const { Text, Paragraph } = Typography;

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

  const { data, loading, run: fetchSingle } = useRequest(req.getSingleData, {
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
    <PageHeaderWrapper content={`${routerName} ID:${id}`}>
      <Spin spinning={loading}>
        <Space>
          <Button onClick={() => history.goBack()}>返回</Button>
          <Button onClick={() => fetchSingle(routerName, id)}>刷新</Button>
          {
            actionList.length ? actionList.map((d, i) => {
              return (
                <Button key={`custom_action_${i}`} onClick={() => customAction(data, d)}>{d.name}</Button>
              );
            }) : null
          }
        </Space>

        <div style={{ background: '#fff', marginTop: 5 }}>
          {
            data &&
            <Row gutter={8}>
              {
                Object.keys(data).map((d, i) => {
                  return (
                    <Col xs={24} sm={12} md={6} key={`d_${i}`}>
                      <div style={{ padding: 5 }}>
                        <Statistic title={d} value={data[d]}
                                   valueStyle={{
                                     overflow: 'hidden',
                                     wordBreak: 'break-all',
                                     fontSize: 16,
                                     fontWeight: 'bold',
                                   }}/>
                      </div>
                    </Col>
                  );
                })
              }
            </Row>
          }
        </div>


      </Spin>


      {
        actionModalShow ? <CollectionCreateForm
          fieldsList={selectAction}
          initValues={data}
          isAction={true}
          loading={actionLoading}
          onCreate={customActionCreate}
          onCancel={() => setActionModalShow(false)}

        /> : null
      }
    </PageHeaderWrapper>
  );
}
