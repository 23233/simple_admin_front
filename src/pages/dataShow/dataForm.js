import React, { useState } from 'react';
import Moment from 'moment';
import { Button, Modal, Form, Input, Radio, InputNumber, Switch, TimePicker, DatePicker } from 'antd';
import Tools from '../../utils/tools';

const CollectionCreateForm = ({ onCreate, onCancel, fieldsList, initValues, loading, isAction }) => {
  const [form] = Form.useForm();
  let initialValues = {};
  if (!isAction) {
    initialValues = JSON.parse(JSON.stringify(initValues));
    fieldsList.fields.map((d, i) => {
      if (['time.Time', 'time'].includes(d.types)) {
        initialValues[d.map_name] = Moment(initValues[d.map_name]);
      } else if (['bool'].includes(d.types)) {
        initialValues[d.map_name] = !!parseInt(initValues[d.map_name] || false);
      } else if (['uint', 'uint8', 'uint16', 'uint32', 'uint64', 'int', 'int8', 'int16', 'int32', 'int64', 'float32', 'float64', 'time.Duration'].includes(d.types)) {
        initialValues[d.map_name] = initValues[d.map_name] || 0;
      }
    });
  } else {
    if (initValues) {
      // 标签解析
      fieldsList.fields.map((d, i) => {
        if (d.sp_tags) {
          // 解析出数据
          const tags = Tools.parseTags(d.sp_tags);
          tags.map((t) => {
            switch (t.key) {
              // 数据关联
              case 'lineTo':
                initialValues[d.map_name] = initValues[t.value];
                break;
              default:
                break;
            }
          });
        }
      });
    }

  }


  const TypeToElement = (t) => {
    switch (t) {
      case 'float32':
      case 'float64':
      case 'int':
      case 'int8' :
      case 'int16':
      case 'int32':
      case 'int64':
      case 'uint':
      case 'uint8':
      case 'uint16':
      case 'uint32':
      case 'uint64':
      case 'time.Duration':
        return (
          <InputNumber style={{ width: '100%' }} placeholder={'please input value'}/>
        );
      case 'time':
      case 'time.Time':
        return (
          <DatePicker showTime/>
        );
      case 'bool':
        return (
          <Switch/>
        );
      default:
        return (
          <Input placeholder={'please input value'}/>
        );
    }
  };

  const MomentToFormat = (values) => {
    Object.keys(values).map((k, i) => {
      const v = values[k];
      if (typeof (v) === 'object' && v._isAMomentObject) {
        values[k] = v.format('YYYY-MM-DD HH:mm:ss');
      }
    });
  };

  const runCreate = () => {
    form
      .validateFields()
      .then(values => {
        // form.resetFields();
        // 把所有时间转换格式
        MomentToFormat(values);
        onCreate(values);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      visible={true}
      title="数据交互页"
      okText="提交"
      cancelText="取消"
      onCancel={onCancel}
      confirmLoading={loading}
      onOk={runCreate}
    >
      <Form
        form={form}
        name="form_in_modal"
        layout={'horizontal'}
        initialValues={initialValues}
      >
        {
          fieldsList.fields.map((k, i) => {
            const isPass = k.map_name !== fieldsList.autoincr && k.map_name !== fieldsList.updated && k.map_name !== fieldsList.deleted && k.map_name !== fieldsList.version && k.xorm_tags.split(' ').includes('created') === false && k.sp_tags.split(' ').includes('autogen') === false;
            if (isPass) {
              let required = false;
              if (k.xorm_tags.split(' ').includes('notnull') || k.xorm_tags.split(' ').includes('not null')) {
                required = true;
              }
              return (
                <Form.Item
                  key={`form_${i}`}
                  name={k.map_name}
                  label={k?.comment_tags || k.map_name}
                  valuePropName={['bool'].includes(k.types) ? 'checked' : 'value'}
                  rules={[
                    {
                      required: required,
                      message: 'please input data',
                    },
                  ]}
                >
                  {TypeToElement(k.types)}
                </Form.Item>
              );
            }

          })
        }
      </Form>
    </Modal>
  );
};

export default CollectionCreateForm;