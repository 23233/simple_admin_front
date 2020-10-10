import React, { useContext, useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Space,
  Select,
  List,
  Typography,
  Spin,
  PageHeader,
  Row,
  Col,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useMount, useRequest } from '@umijs/hooks';
import req from '@/utils/url';
import { history, Link, useModel } from 'umi';
import './dataSource.less';
import Tools from '../../utils/tools';
import { Context } from './context';

const { Paragraph } = Typography;

export default function({ initValues }) {
  const { userInfo, config } = useModel('useAuthModel');

  const { fetchInfoLoading, allRouter, remarks, setSelectRouter } = useContext(
    Context,
  );

  return (
    <React.Fragment>
      <Spin spinning={fetchInfoLoading}>
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 4,
            xl: 6,
            xxl: 8,
          }}
          dataSource={Object.keys(allRouter || {}).filter(
            d => d !== config?.user_model_name,
          )}
          renderItem={item => (
            <List.Item style={{ marginBottom: 5 }}>
              <div
                title={remarks[item]}
                onClick={() => setSelectRouter(allRouter[item])}
                className="source_li"
              >
                {remarks[item]}
              </div>
            </List.Item>
          )}
        />
      </Spin>
    </React.Fragment>
  );
}
