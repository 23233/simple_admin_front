import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Space, Select, List, Typography, Spin, PageHeader, Row, Col } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useMount, useRequest } from '@umijs/hooks';
import req from '@/utils/url';
import { history, Link, useModel } from 'umi';
import './dataSource.less';
import Tools from '../../utils/tools';

const { Paragraph } = Typography;

export default function({ initValues }) {
  const { userInfo, config } = useModel('useAuthModel');
  const [form] = Form.useForm();

  // 所有表信息
  const [allRouter, setAllRouter] = useState([]);
  // 所有表别名信息
  const [remarks, setRemarks] = useState([]);
  // 当前选中的表名
  const [selectRouter, setSelectRouter] = useState(null);
  // 当前选中的表信息
  const [routerFields, setRouterFields] = useState({});
  // 显示数据源
  const [showDataSource, setShowDataSource] = useState(false);

  // 获取表信息
  const { run: fetchDataInfo, loading: fetchInfoLoading } = useRequest(req.getRouterFields, {
    manual: true,
    onSuccess: async (resp) => {
      if (!resp?.status) {
        const pList = [];
        resp?.fields.map(async (d) => {
          const sp_tags = Tools.parseTags(d.sp_tags);
          d.sp_tags_list = sp_tags;
          if (sp_tags && sp_tags.length) {
            // 先判断是否有外键
            let fk = sp_tags.find(e => e.key === 'fk');
            if (fk) {
              if (!d?.routerInfo?.length) {
                pList.push({ fields: d, tableName: fk.value });
              }
            }
          }
        });
        setRouterFields(resp);
        setShowDataSource(!showDataSource);
      }
    },
  });

  useMount(async () => {
    const allTable = await req.getRouterLists();
    const remarks = allTable?.remarks;
    const tables = allTable?.tables;
    setAllRouter(tables);
    setRemarks(remarks);
  });

  useEffect(() => {
    if (selectRouter) {
      // 获取表的信息
      fetchDataInfo(selectRouter);
    }
  }, [selectRouter]);

  const onFinish = values => {
    console.log('Received values of form:', values);
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


  const back = () => {
    setSelectRouter(null);
    setShowDataSource(!showDataSource);
  };

  return (
    <React.Fragment>
      {
        showDataSource ?
          <React.Fragment>
            <PageHeader
              onBack={back}
              title="返回"
            />

            <Form form={form} name="step1" onFinish={onFinish} autoComplete="off">
              <Form.Item
                label="名称"
                name="name"
                rules={[{ required: true, message: '请输入名称' }]}
              >
                <Input placeholder={'请输入名称'} maxLength={40}/>
              </Form.Item>
              <Form.Item
                label="条数限制"
                name="limit"
              >
                <Input type={'number'} placeholder={'请输入条数限制'}/>
              </Form.Item>

              <Form.List name="column_op">
                {(fields, { add, remove }) => {
                  return (
                    <>
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
                              <Select style={{ minWidth: 100 }} placeholder="请选择字段">
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
                              <Select style={{ minWidth: 100 }} placeholder="请选择操作方式">
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
                              style={{ minWidth: 240}}
                              name={[field.name, 'value']}
                              fieldKey={[field.fieldKey, 'value']}
                              rules={[{ required: true, message: '请输入内容' }]}
                            >
                              <Input placeholder="请输入内容"/>
                            </Form.Item>
                          </Col>
                          <Col>
                            <Form.Item
                              {...field}
                              label={'连接方式'}
                              name={[field.name, 'connect_type']}
                              fieldKey={[field.fieldKey, 'connect_type']}
                              rules={[{
                                message: '请选择连接方式',
                                required: i + 1 === fields.length ? false : fields.length > 1,
                              }]}
                            >
                              <Select style={{ minWidth: 120 }} placeholder="请选择连接方式">
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
                              <MinusCircleOutlined onClick={() => remove(field.name)}/>
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
                          <PlusOutlined/>新增筛选
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
          </React.Fragment>

          :

          <Spin spinning={fetchInfoLoading}>

            <PageHeader
              title="选择数据源"
            />

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
              dataSource={Object.keys(allRouter).filter(d => d !== config?.user_model_name)}
              renderItem={item => (
                <List.Item style={{ marginBottom: 5 }}>
                  <div title={remarks[item]}
                       onClick={() => setSelectRouter(allRouter[item])}
                       className={`source_li ${selectRouter === item ? 'active' : null}`}>
                    {remarks[item]}
                  </div>
                </List.Item>
              )}
            />
          </Spin>


      }


    </React.Fragment>

  );
}
