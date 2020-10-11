import React, { useContext, useState } from 'react';
import { Row, Col, Button, message, Input } from 'antd';
import { Context } from './context';
import ReactJson from 'react-json-view';
import './selectChat.less';

const { TextArea } = Input;

export default function({ initValues }) {
  const { nextStep, prevStep, setChatConfigForm, chatType, routerFields } = useContext(
    Context,
  );
  const [json, setJson] = useState({});
  const [fast, setFast] = useState(null);

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

  const isJSON = (str) => {
    if (typeof str == 'string') {
      try {
        let obj = JSON.parse(str);
        if (typeof obj == 'object' && obj) {
          return true;
        } else {
          return false;
        }
      } catch (e) {
        return false;
      }
    }
  };

  const fastBlur = () => {
    if (fast) {
      if (isJSON(fast)) {
        setJson(JSON.parse(fast));
        setFast(null);
      } else {
        message.warning('不符合json规范,已清空');
        setFast(null);
      }
    }
  };


  return (
    <React.Fragment>
      <div>
        <div style={{ textAlign: 'center' }}>
          <Button type="default" htmlType="button" onClick={prevStep} style={{ marginRight: 10 }}>
            返回
          </Button>
          <Button type="primary" onClick={success}>
            生成图表
          </Button>
        </div>
      </div>
      <Row style={{ padding: '20px 0' }}>
        <Col xs={24} sm={12} md={4}>图表配置</Col>
        <Col xs={24} sm={24} md={18}>
          <ReactJson
            src={json}
            onAdd={onChange}
            onDelete={onChange}
            onEdit={onChange}
            name={'config'}
          />
        </Col>
        <Col xs={24} sm={12} md={4}>快捷操作</Col>
        <Col xs={24} sm={24} md={18}>
          <TextArea autoSize={{ minRows: 8 }} value={fast} onChange={(e) => setFast(e.target.value)}
                    placeholder={'配置json粘贴在这里'}
                    onBlur={fastBlur}/>
          <p>基本规范 必须{}包括内容 key value 必须双引号包裹 最后一个value不能有,号存在</p>
        </Col>
        <Col xs={24} sm={12} md={4}><a href={chatType.href} target={'_blank'}>配置文件参考地址</a>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <code style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify({ 'xField': 'sales', 'yField': 'type' }, null, 2)}
          </code>
        </Col>
        <Col xs={24} sm={24} md={12}>
          <code style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(routerFields?.fields.map((d) => {
              return {
                map_name: d.map_name,
                comment_tags: d.comment_tags,
              };
            }), null, 2)}
          </code>
        </Col>

      </Row>



    </React.Fragment>
  );
}
