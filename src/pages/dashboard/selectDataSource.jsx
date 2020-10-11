import React, { useContext, useEffect, useState } from 'react';
import {
  List,
  Spin,
} from 'antd';
import { history, Link, useModel } from 'umi';
import './dataSource.less';
import { Context } from './context';


export default function({ initValues }) {
  const { userInfo, config } = useModel('useAuthModel');

  const { fetchInfoLoading, allRouter, remarks, setSelectRouter, selectRouter, nextStep } = useContext(
    Context,
  );

  const routerClick = (item) => {
    if (selectRouter === allRouter[item]) {
      nextStep();
    } else {
      setSelectRouter(allRouter[item]);
    }
  };

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
                onClick={() => routerClick(item)}
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
