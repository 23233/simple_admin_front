import React, { useContext, useState } from 'react';
import { Row, Col, Button, message, Input } from 'antd';
import { Context } from './context';
import ReactJson from 'react-json-view';
import './selectChat.less';
import Config from './config';

const { TextArea } = Input;

export default function({ initValues }) {
  const {
    nextStep,
    prevStep,
    setChatConfigForm,
    chatType,
    routerFields,
  } = useContext(Context);
  const [json, setJson] = useState(initValues || {});
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

  const isJSON = val => {
    if (typeof val == 'string') {
      try {
        let obj = eval('(' + val + ')');
        return typeof obj == 'object';
      } catch (e) {
        return false;
      }
    }
  };

  const fastBlur = () => {
    if (fast) {
      if (isJSON(fast)) {
        setJson(eval('(' + fast + ')'));
        setFast(null);
      } else {
        message.warning('不符合json规范,请检查');
      }
    }
  };

  return (
    <React.Fragment>
      <div>
        <div style={{ textAlign: 'center' }}>
          <Button
            type="default"
            htmlType="button"
            onClick={prevStep}
            style={{ marginRight: 10 }}
          >
            返回
          </Button>
          <Button type="primary" onClick={success}>
            生成图表
          </Button>
        </div>
      </div>
      <Row style={{ padding: '20px 0' }}>
        <Col xs={24} sm={12} md={4}>
          图表配置
        </Col>
        <Col xs={24} sm={24} md={18}>
          <ReactJson
            src={json}
            onAdd={onChange}
            onDelete={onChange}
            onEdit={onChange}
            name={'config'}
          />
        </Col>
        <Col xs={24} sm={12} md={4}>
          快捷操作
        </Col>
        <Col xs={24} sm={24} md={18}>
          <TextArea
            autoSize={{ minRows: 8 }}
            value={fast}
            onChange={e => setFast(e.target.value)}
            placeholder={'配置json粘贴在这里'}
          />
          <div style={{ margin: '10px 0' }}>
            <Button onClick={fastBlur}>
              生成配置
            </Button>
          </div>

        </Col>
        <Col xs={24} sm={12} md={4}>
          <a href={chatType.href} target={'_blank'}>
            配置文件参考地址
          </a>
        </Col>
        <Col xs={24} sm={24} md={8}>

          {
            initValues && Object.keys(initValues).length ? <div>
              <p style={{ margin: 0 }}>现有配置</p>
              <code style={{ whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(initValues, null, 2)}
              </code>
            </div> : null
          }
          <p style={{ margin: 0 }}>快捷配置格式参考</p>
          <code style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify({ xField: 'sales', yField: 'type' }, null, 2)}
          </code>
        </Col>
        <Col xs={24} sm={24} md={12}>
          <p style={{ margin: 0 }}>数据源字段信息</p>
          <code style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(
              routerFields?.fields
                .concat([
                  {
                    map_name: Config.distinct_key,
                    comment_tags: '默认汇总去重字段',
                  },
                ])
                .map(d => {
                  return {
                    map_name: d.map_name,
                    comment_tags: d.comment_tags,
                  };
                }),
              null,
              2,
            )}
          </code>
        </Col>
      </Row>
    </React.Fragment>
  );
}
