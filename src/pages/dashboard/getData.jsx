import React, { useContext } from 'react';
import {
  Form,
  Input,
  Button,
  Space,
  InputNumber,
  Select,
  Row,
  Col,
  Popover,
} from 'antd';
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
    form.setFieldsValue({ column_op: [] });
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
  const connectList = ['or', 'and'];

  // 内置变量
  const varList = [
    {
      name: '$(now)',
      desc:
        '默认今天此时 支持减号 例： $(day) - 1 即为昨天 格式为 YYYY-MM-DD HH:mm:ss',
    },
    {
      name: '$(unix)',
      desc: '时间戳',
    },
    {
      name: '$(day)',
      desc:
        '默认今天此时 支持减号 例： $(day) - 1 即为昨天 格式为 YYYY-MM-DD HH:mm:ss',
    },
    {
      name: '$(day_start)',
      desc:
        '默认今天0点 00:00:00 支持减号 例： $(day_start) - 1 即为昨天 格式为 YYYY-MM-DD 00:00:00',
    },
    {
      name: '$(day_end)',
      desc:
        '默认今天23点 23:59:59 支持减号 例： $(day_end) - 1 即为昨天 格式为 YYYY-MM-DD 23:59:59',
    },
  ];

  return (
    <React.Fragment>
      <Form form={form} name="step1" onFinish={onFinish} autoComplete="off">
        <Form.Item
          label="数据名称"
          name="name"
          rules={[{ required: true, message: '请输入名称', max: 25 }]}
        >
          <Input type={'text'} max={25} placeholder={'请输入数据名称'} />
        </Form.Item>

        <Form.Item label="条数限制" name="limit">
          <InputNumber
            placeholder={'请输入条数限制 默认不限制'}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item label="刷新间隔" name="refresh_interval">
          <InputNumber
            placeholder={'请输入刷新间隔(秒)'}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label={'汇总去重'}
          name={'col_distinct'}
          extra={'去重默认字段名 distinct_default'}
          rules={[{ required: false, message: '请选择汇总去重字段' }]}
        >
          <Select style={{ width: '100%' }} placeholder="请选择汇总去重字段">
            {routerFields?.fields?.map((item, i) => (
              <Select.Option key={`set_${i}`} value={item.map_name}>
                {item.comment_tags || item.name}
              </Select.Option>
            ))}
          </Select>
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
                    <Col xs={12} sm={12} md={6}>
                      <Form.Item
                        hidden={true}
                        name={[field.name, 'order']}
                        fieldKey={[field.fieldKey, 'order']}
                        initialValue={i + 1}
                      />

                      <Form.Item
                        {...field}
                        label={'字段'}
                        name={[field.name, 'col_name']}
                        fieldKey={[field.fieldKey, 'col_name']}
                        rules={[{ required: true, message: '请选择字段' }]}
                      >
                        <Select
                          style={{ width: '100%' }}
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
                    <Col xs={12} sm={12} md={4}>
                      <Form.Item
                        {...field}
                        label={'操作'}
                        name={[field.name, 'op_type']}
                        fieldKey={[field.fieldKey, 'op_type']}
                        rules={[{ required: true, message: '请选择操作方式' }]}
                      >
                        <Select
                          style={{ width: '100%' }}
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
                    <Col xs={12} sm={12} md={8}>
                      <Form.Item
                        {...field}
                        label={'内容'}
                        style={{ width: '100%' }}
                        name={[field.name, 'value']}
                        fieldKey={[field.fieldKey, 'value']}
                        rules={[
                          { required: true, message: '请输入内容', max: 100 },
                        ]}
                      >
                        <Input placeholder="请输入内容" maxLength="100" />
                      </Form.Item>
                    </Col>
                    <Col xs={10} sm={10} md={3}>
                      <Form.Item
                        {...field}
                        label={'链接上条'}
                        name={[field.name, 'connect_type']}
                        fieldKey={[field.fieldKey, 'connect_type']}
                        initialValue={i > 0 ? connectList[0] : null}
                      >
                        <Select style={{ width: '100%' }} disabled={i === 0}>
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
                    <Col span={2}>
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
                    新增筛选条件
                  </Button>
                </Form.Item>
              </>
            );
          }}
        </Form.List>

        <Form.Item>
          <div style={{ textAlign: 'center' }}>
            <Button
              type="default"
              htmlType="button"
              onClick={prevStep}
              style={{ marginRight: 10 }}
            >
              返回
            </Button>
            <Button type="primary" htmlType="submit">
              下一步
            </Button>
          </div>
        </Form.Item>
      </Form>
    </React.Fragment>
  );
}
