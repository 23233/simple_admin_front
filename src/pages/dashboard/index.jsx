import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Card, message, Button, Tabs, Typography, Popover, Input, Spin, Row, Col } from 'antd';
import { useRequest } from 'ahooks';
import req from '@/utils/url';
import { EditOutlined } from '@ant-design/icons';
import { useModel, Link } from 'umi';
import ROUTERS from '@/router';
import SingleChart from './singleChat';

const { TabPane } = Tabs;
const { Paragraph } = Typography;

const { Search } = Input;

export default function(props) {
  const { userInfo } = useModel('useAuthModel');
  const [showScreen, setShowScreen] = useState(0);
  const [chatList, setChatList] = useState([]);

  // 获取屏幕
  const { loading: getScreenLoading, data: screens, run: getScreen } = useRequest(req.dashBoardScreenGet, {
    onSuccess: (resp) => {
      if (resp && resp.length) {
        const d = resp.find((d) => d.is_default);
        setShowScreen(d?.id || resp[0].id);
      }
    },
  });
  // 修改或新增
  const { loading: editOrAddLoading, run: editOrAddReq } = useRequest(req.dashBoardScreenAddOrEdit, {
    manual: true,
    onSuccess: () => {
      getScreen();
    },
  });
  // 删除
  const { run: deleteReq, loading: deleteLoading } = useRequest(req.dashBoardScreenDelete, {
    manual: true, onSuccess: () => {
      getScreen();
    },
  });

  // 获取图表列表
  const { loading: getChatsLoading, run: getChats } = useRequest(req.dashBoardGet, {
    manual: true,
    onSuccess: (resp) => {
      if (!resp.status) {
        resp.map((d) => {
          d.config = JSON.parse(d.config);
          d.data_source = JSON.parse(d.data_source);
          return d;
        });
        setChatList(resp);
      }
    },
  });


  useEffect(() => {
    if (showScreen) {
      getChats(showScreen);
    }
  }, [showScreen]);


  // 屏幕当前选中变更
  const screenChange = value => {
    setShowScreen(value);
  };

  // 刷新数据
  const flushData = () => {
    getChats(showScreen);
  };


  // 屏幕操作
  const screenEdit = (targetKey, action) => {
    if (action === 'add') {
      // 发起请求
      editOrAddReq({ name: '新屏幕' });
    } else {
      deleteReq(parseInt(targetKey));
    }
  };

  // 屏幕名称编辑
  const screenNameEdit = (id, value) => {
    if (!value) {
      message.error('请输入新名称后重试');
      return false;
    }
    editOrAddReq({ name: value, id: parseInt(id) });
  };


  return (
    <PageHeaderWrapper content="用户仪表台">
      <Card>
        <Spin spinning={getScreenLoading || editOrAddLoading || deleteLoading}>
          <Tabs
            type="editable-card"
            onChange={screenChange}
            activeKey={showScreen.toString()}
            onEdit={screenEdit}
            tabBarExtraContent={
              screens && showScreen ?
                <React.Fragment>
                  <Button onClick={flushData}>刷新</Button>
                  <Link to={ROUTERS.dashBoardAdd + '?id=' + showScreen}>
                    <Button type={'primary'} title={'新增图表'}>新增图表</Button>
                  </Link>
                </React.Fragment> : null
            }
          >
            {(screens || []).map((item, index) => (
              <TabPane
                tab={
                  <React.Fragment>
                    <span>{item.name}</span>
                    <Popover
                      title={'变更名称'}
                      trigger={'click'}
                      content={
                        <Search
                          placeholder={'请输入新名称'}
                          enterButton={'确定'}
                          maxLength={20}
                          allowClear
                          onSearch={value => screenNameEdit(item.id, value)}
                        />
                      }
                    >
                      <EditOutlined style={{ margin: '0 0 0 10px' }}/>
                    </Popover>
                  </React.Fragment>
                }
                key={item.id}
                closable={index >= 1}
              />
            ))}
          </Tabs>
        </Spin>
        <Spin spinning={getChatsLoading}>
          <Row>
            {
              chatList.map((d, i) => {
                return (
                  <Col key={d.id} xs={24} sm={12} md={8} xl={6}>
                    <SingleChart data={d} screenId={showScreen} run_flush={flushData} delay={200 * (i + 1)}/>
                  </Col>
                );
              })
            }
          </Row>

        </Spin>
      </Card>
    </PageHeaderWrapper>
  );
}
