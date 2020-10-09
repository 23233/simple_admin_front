import React from 'react';
import { Form, Input, Button, Space, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

export default function({ initValues }) {
  const [form] = Form.useForm();
  // 操作符
  const opList = [
    {
      name: '=',
      label: '等于',
    },
    {
      name: '!=',
      label: '不等于',
    },
    {
      name: '>',
      label: '大于',
    },
    {
      name: '>=',
      label: '大于等于',
    },
    {
      name: '<',
      label: '小于',
    },
    {
      name: '<=',
      label: '小于等于',
    },
    {
      name: 'in',
      label: '在',
    },
    {
      name: 'not in',
      label: '不在',
    },
    {
      name: 'like',
      label: '包含',
    },
  ];
  // 连接方式
  const connectList = ['and', 'or', 'xor', 'not'];

  const onFinish = values => {
    console.log('Received values of form:', values);
  };

  const handleChange = () => {
    form.setFieldsValue({ sights: [] });
  };

  return (
    <Form form={form} name="step1" onFinish={onFinish} autoComplete="off">
      <Form.List name="sights">
        {(fields, { add, remove }) => {
          return (
            <>
              {fields.map(field => (
                <Space
                  key={field.key}
                  style={{ display: 'flex', marginBottom: 8 }}
                  align="start"
                >
                  <Form.Item
                    {...field}
                    name={[field.name, 'col_name']}
                    fieldKey={[field.fieldKey, 'col_name']}
                    rules={[{ required: true, message: 'col_name miss' }]}
                  >
                    <Select style={{ minWidth: 100 }} placeholder="ziduan">
                      {opList.map((item, i) => (
                        <Select.Option
                          key={`${field.fieldKey}_${i}}`}
                          value={item.name}
                        >
                          {item.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    {...field}
                    name={[field.name, 'op_type']}
                    fieldKey={[field.fieldKey, 'op_type']}
                    rules={[{ required: true, message: 'op_type miss' }]}
                  >
                    <Select style={{ minWidth: 100 }} placeholder="caozuo">
                      {opList.map((item, i) => (
                        <Select.Option
                          key={`${field.fieldKey}_${i}}`}
                          value={item.name}
                        >
                          {item.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    {...field}
                    name={[field.name, 'value']}
                    fieldKey={[field.fieldKey, 'value']}
                    rules={[{ required: true, message: 'zhi miss' }]}
                  >
                    <Input placeholder="zhi" />
                  </Form.Item>

                  <MinusCircleOutlined onClick={() => remove(field.name)} />
                </Space>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                  block
                >
                  <PlusOutlined /> Add sights
                </Button>
              </Form.Item>
            </>
          );
        }}
      </Form.List>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
