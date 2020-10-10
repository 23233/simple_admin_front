import React, { useContext } from 'react';
import { Form, Input, Button, Space, Select, Row, Col, Popover } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Context } from './context';

export default function({ initValues }) {
  const { nextStep, prevStep, routerFields, setDataSourceForm } = useContext(
    Context,
  );

  const [form] = Form.useForm();

  const onFinish = values => {
    console.log('Received values of form:', values);
    setDataSourceForm(values);
    nextStep();
  };

  const handleChange = () => {
    form.setFieldsValue({ sights: [] });
  };

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

  // 内置变量
  const varList = [
    {
      name: '$(now)',
      desc: '当前时间',
    },
    {
      name: '$(day)',
      desc: '默认今天 支持减号 例： $(day) - 1 即为昨天',
    },
  ];

  return (
    <React.Fragment>
      <Form form={form} name="step1" onFinish={onFinish} autoComplete="off">
        <Form.Item label="条数限制" name="limit">
          <Input type={'number'} placeholder={'请输入条数限制 默认不限制'} />
        </Form.Item>

        <Form.List name="column_op">
          {(fields, { add, remove }) => {
            return (
              <>
                {fields.length ? (
                  <div style={{ padding: '10px 0' }}>
                    支持变量：
                    <Space>
                      {varList.map((d, i) => {
                        return (
                          <Popover key={`var${i}`} content={d.desc}>
                            <span style={{ color: '#1288f6' }}>{d.name}</span>
                          </Popover>
                        );
                      })}
                    </Space>
                  </div>
                ) : null}

                {fields.map((field, i) => (
                  <Row
                    gutter={16}
                    align="middle"
                    justify="space-between"
                    key={field.key}
                  >
                    <Col>
                      <Form.Item
                        {...field}
                        label={'字段'}
                        name={[field.name, 'col_name']}
                        fieldKey={[field.fieldKey, 'col_name']}
                        rules={[{ required: true, message: '请选择字段' }]}
                      >
                        <Select
                          style={{ minWidth: 100 }}
                          placeholder="请选择字段"
                        >
                          {routerFields?.fields?.map((item, i) => (
                            <Select.Option
                              key={`${field.fieldKey}_${i}}`}
                              value={item.map_name}
                            >
                              {item.comment_tags || item.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item
                        {...field}
                        label={'操作'}
                        name={[field.name, 'op_type']}
                        fieldKey={[field.fieldKey, 'op_type']}
                        rules={[{ required: true, message: '请选择操作方式' }]}
                      >
                        <Select
                          style={{ minWidth: 100 }}
                          placeholder="请选择操作方式"
                        >
                          {opList.map((item, i) => (
                            <Select.Option
                              key={`${field.fieldKey}_${i}}`}
                              value={item.name}
                            >
                              {item.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item
                        {...field}
                        label={'内容'}
                        style={{ minWidth: 240 }}
                        name={[field.name, 'value']}
                        fieldKey={[field.fieldKey, 'value']}
                        rules={[{ required: true, message: '请输入内容' }]}
                      >
                        <Input placeholder="请输入内容" />
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item
                        {...field}
                        label={'连接方式'}
                        name={[field.name, 'connect_type']}
                        fieldKey={[field.fieldKey, 'connect_type']}
                        rules={[
                          {
                            message: '请选择连接方式',
                            required:
                              i + 1 === fields.length
                                ? false
                                : fields.length > 1,
                          },
                        ]}
                      >
                        <Select
                          style={{ minWidth: 120 }}
                          placeholder="请选择连接方式"
                        >
                          {connectList.map((item, i) => (
                            <Select.Option
                              key={`${field.fieldKey}_${i}}`}
                              value={item}
                            >
                              {item}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item>
                        <MinusCircleOutlined
                          onClick={() => remove(field.name)}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                    }}
                    block
                  >
                    <PlusOutlined />
                    新增筛选
                  </Button>
                </Form.Item>
              </>
            );
          }}
        </Form.List>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            下一步
          </Button>
          <Button type="default" htmlType="button" onClick={prevStep}>
            返回
          </Button>
        </Form.Item>
      </Form>
    </React.Fragment>
  );
}
