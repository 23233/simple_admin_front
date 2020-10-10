import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Card, message, Button, Tabs, Typography, Popover, Input } from 'antd';
import { history } from 'umi';
import { useRequest } from '@umijs/hooks';
import req from '@/utils/url';
import { EditOutlined } from '@ant-design/icons';
import { useModel, Link } from 'umi';
import ROUTERS from '@/router';

const { TabPane } = Tabs;
const { Paragraph } = Typography;

const { Search } = Input;

export default function(props) {
  const { userInfo } = useModel('useAuthModel');
  const [screens, setScreens] = useState([
    {
      id: 0,
      name: '默认',
    },
  ]);
  const [showScreen, setShowScreen] = useState(0);

  // 获取屏幕

  const screenChange = value => {
    setShowScreen(value);
  };

  const screenEdit = (targetKey, action) => {
    if (action === 'add') {
      // 发起请求
      setScreens(
        screens.concat([{ id: new Date().getTime(), name: '新名称' }]),
      );
    } else {
      setScreens(screens.filter(d => d.id !== parseInt(targetKey)));
    }
    console.log('2', targetKey, action);
  };

  const screenNameEdit = (id, value) => {
    if (!value) {
      message.error('请输入新名称后重试');
      return false;
    }
    const item = screens.find(d => d.id === parseInt(id));
    item.name = value;
    setScreens([...screens]);
  };

  return (
    <PageHeaderWrapper content="用户仪表台">
      <Card>
        <Tabs
          type="editable-card"
          onChange={screenChange}
          activeKey={showScreen.toString()}
          onEdit={screenEdit}
          tabBarExtraContent={
            <Link to={ROUTERS.dashBoardAdd}>
              <Button>新增图表</Button>
            </Link>
          }
        >
          {screens.map(item => (
            <TabPane
              tab={
                <React.Fragment>
                  <span>{item.name}</span>
                  {item.name !== '默认' ? (
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
                      <EditOutlined style={{ margin: '0 0 0 10px' }} />
                    </Popover>
                  ) : null}
                </React.Fragment>
              }
              key={item.id}
              closable={item.name !== '默认'}
            />
          ))}
        </Tabs>
      </Card>
    </PageHeaderWrapper>
  );
}
