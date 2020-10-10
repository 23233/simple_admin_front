import React, { useContext, useState } from 'react';
import { Row, Col, Button, message } from 'antd';
import { Context } from './context';
import ReactJson from 'react-json-view';
import './selectChat.less';

export default function({ initValues }) {
  const { nextStep, prevStep, setChatConfigForm, chatType } = useContext(
    Context,
  );
  const [json, setJson] = useState({});

  const onChange = item => {
    setJson(item.updated_src);
  };

  const success = () => {
    if (Object.keys(json).length) {
      setChatConfigForm(json);
      nextStep();
    } else {
      message.error('请填写配置文件');
    }
  };

  return (
    <React.Fragment>
      <Row style={{ padding: '20px 0' }}>
        <Col span={4}>图表配置</Col>
        <Col span={18}>
          <ReactJson
            src={json}
            onAdd={onChange}
            onDelete={onChange}
            onEdit={onChange}
            name={'config'}
          />
        </Col>
      </Row>
      <p>
        <a href={chatType.href} target={'_blank'}>
          配置文件参考地址
        </a>
      </p>

      <div>
        <Button type="primary" htmlType="button" onClick={success}>
          完成
        </Button>
        <Button type="default" htmlType="button" onClick={prevStep}>
          返回
        </Button>
      </div>
    </React.Fragment>
  );
}
