import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Popconfirm, Row, Col, message, Radio, Tooltip, Typography } from 'antd';
import { history, Link } from 'umi';
import req from '../../utils/url';

const { Paragraph } = Typography;

import CollectionCreateForm from './dataForm';
import { useModel } from 'umi';
import { useRequest, useMount } from '@umijs/hooks';
import ROUTERS from '../../router';

const DataShow = (props) => {
  const { userInfo, config } = useModel('useAuthModel');
  // 所有表信息
  const [allRouter, setAllRouter] = useState([]);
  // 当前选中的表名
  const [selectRouter, setSelectRouter] = useState(null);
  // 当前选中的表信息
  const [routerFields, setRouterFields] = useState({});
  // 当前选中表的表数据
  const [routerData, setRouterData] = useState({
    all: 0,
    data: [],
    page: 0,
    page_size: 0,
  });

  // 修改弹窗显示隐藏
  const [editModalShow, setEditModalShow] = useState(false);
  // 自定义action列表
  const [actionList, setActionList] = useState([]);
  // 自定义action弹窗
  const [actionModalShow, setActionModalShow] = useState(false);
  // 选中的action
  const [selectAction, setSelectAction] = useState({});

  // 当前选中的行
  const [selectRow, setSelectRow] = useState([]);

  // 修改选中的行
  const [editRow, setEditRow] = useState({});


  const params = props.location.query;
  // 执行操作之后刷新
  const taskSuccess = (d) => {
    if (!d?.status) {
      fetchDataList(selectRouter);
    }
  };
  // 获取表信息
  const { run: fetchDataInfo } = useRequest(req.getRouterFields, {
    manual: true, onSuccess: (d) => {
      if (!d?.status) {
        setRouterFields(d);
      }
    },
  });
  // 获取表数据
  const { run: fetchDataList, loading: fetchDataLoading } = useRequest(req.getRouterData, {
    manual: true, onSuccess: (d) => {
      if (!d?.status) {
        setRouterData(d);
      }
    },
  });
  // 获取action信息
  const { run: fetchAction } = useRequest(req.getRouterActions, {
    manual: true, onSuccess: (d) => {
      if (!d?.status) {
        setActionList(d);
      }
    },
  });

  // 删除选中行
  const { run: runDeleteRow } = useRequest(req.deleteRouterSelectData, {
    manual: true, onSuccess: taskSuccess,
  });
  // 新增数据
  const { run: addRow, loading: addRowLoading } = useRequest(req.addData, {
    manual: true,
    onSuccess: (d) => {
      if (!d?.status) {
        fetchDataList(selectRouter);
        setEditModalShow(false);
      }
    },
  });
  // 修改数据
  const { run: updateRow, loading: updateRowLoading } = useRequest(req.updateData, {
    manual: true,
    onSuccess: (d) => {
      if (!d?.status) {
        fetchDataList(selectRouter);
        setEditModalShow(false);
      }
    },
  });

  // 自定义action提交
  const { run: actionSubmit, loading: actionLoading } = useRequest(req.runActions, {
    manual: true,
    onSuccess: (d) => {
      if (!d?.status) {
        fetchDataList(selectRouter);
        setActionModalShow(false);
      }
    },
  });


  // 获取所有路由列表
  useMount(async () => {
    const allTable = await req.getRouterLists();
    setAllRouter(allTable);
    const defaultSelect = params?.tab ? allTable[params?.tab] : Object.keys(allTable)[0];
    setSelectRouter(defaultSelect);
    // 获取表的信息
    fetchDataInfo(defaultSelect);
    // 获取表数据
    fetchDataList(defaultSelect);
    // 获取自定义action信息
    fetchAction(defaultSelect);
  });


  useEffect(() => {
    if (params.tab) {
      setSelectRouter(params.tab);
      // 获取表的信息
      fetchDataInfo(params.tab);
      // 获取表数据
      fetchDataList(params.tab);
      // 获取自定义action信息
      fetchAction(params.tab);
    }
  }, [params]);

  const tabChange = (tab) => {
    history.push(props.match.url + '?tab=' + tab);
  };

  const autoincrName = routerFields?.autoincr || 'id';

  let columns = [];


  if (routerData?.data?.length) {
    columns.push({
      title: autoincrName,
      dataIndex: autoincrName.toLowerCase(),
      key: 'tid',
      width: 80,
      render: (text) => {
        const url = ROUTERS.single_data + '/' + selectRouter + '/' + text;
        return <Link to={url}>{text}</Link>;
      },
    });
    routerFields?.fields?.map((d, i) => {
      if (d.map_name !== autoincrName.toLowerCase()) {
        let w = 200;
        if (d.types.includes('int')) {
          w = 100;
        }
        columns.push({
          title: d.map_name,
          dataIndex: d.map_name,
          key: `t${d.map_name}`,
          width: w,
          ellipsis: true,
          render: text => (
            <Paragraph ellipsis style={{ maxWidth: w, marginBottom: 0 }}>
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            </Paragraph>
          ),
        });
      }
    });
    columns.push({
      title: 'operating',
      dataIndex: 'operating',
      key: 'toperating',
      render: (text, row) => {
        return (
          <span>
            <Button onClick={(e) => onEdit(row)} type={'link'}>修改</Button>
            {
              actionList.length ? actionList.map((d, i) => {
                return (
                  <Button key={`custom_action_${i}`} onClick={() => customAction(row, d)}
                          type={'link'}>{d.name}</Button>
                );
              }) : null
            }
          </span>
        );
      },
    });
  }


  const customAction = (row, action) => {
    setEditRow(row);
    setSelectAction(action);
    setActionModalShow(true);
  };

  const pageChange = (page, pageSize) => {
    fetchDataList(selectRouter, { page: page });
    rowOnChange([]);
  };

  const rowOnChange = (selectedRowKeys, selectedRows) => {
    setSelectRow(selectedRowKeys);
  };

  const onDelete = () => {
    runDeleteRow(selectRouter, { ids: selectRow.join(',') });
  };

  const onEdit = (row) => {
    setEditRow(row);
    setEditModalShow(true);
  };

  const onAdd = () => {
    setEditRow({});
    setEditModalShow(true);
  };

  const onCreate = values => {
    console.log('Received values of form: ', values);
    // 判断是新增还是变更
    const selectKeys = Object.keys(editRow);
    if (selectKeys.length) {
      let hasChange = false;
      // 判断是否有变更
      selectKeys.map((k, i) => {
        if (k !== autoincrName) {
          const v = editRow[k];
          if (routerFields[k] === 'bool') {
            if (values[k] !== !!parseInt(v)) {
              hasChange = true;
            }
          } else if (values[k] !== v) {
            hasChange = true;
          }
        }
      });
      if (hasChange === false) {
        message.warning('not have changes dont run submit');
        return;
      }
    }

    // 修改
    if (selectKeys.length) {
      updateRow(selectRouter, editRow.id, { ...editRow, ...values });
      return;
    }
    // 新增
    addRow(selectRouter, values);

  };

  const customActionCreate = values => {
    actionSubmit(selectAction.path, values, selectAction.methods);

  };


  const rowSelection = {
    selectedRowKeys: selectRow,
    onChange: rowOnChange,
  };

  const operations = (
    <Row gutter={8}>
      <Col>
        <Popconfirm
          title="确认进行删除操作?"
          onConfirm={onDelete}
          disabled={!selectRow.length}
          okText="确定"
          cancelText="取消"
        >
          <Button disabled={!selectRow.length}>删除选中的{selectRow.length}条数据</Button>
        </Popconfirm>

      </Col>
      <Col>
        <Button type={'default'} onClick={(e) => onAdd()}>新增数据</Button>
      </Col>
      <Col>
        <Button onClick={(e) => fetchDataList(selectRouter)}>刷新</Button>
      </Col>
    </Row>
  );

  // 对表列表进行自动分组 根据下划线
  const intelligentGroup = () => {
    let group = [];
    const normalTables = Object.keys(allRouter).filter((d) => d !== config.user_model_name);
    const oldData = JSON.parse(JSON.stringify(normalTables));
    normalTables.map((k, i) => {
      const prefix = k.split('_')[0];
      let g = [];
      Object.keys(oldData).map((d) => {
        if (oldData[d].startsWith(prefix)) {
          g.push(oldData[d]);
          delete oldData[d];
        }
      });
      // 如果存在
      if (group.some((d) => d.group === prefix)) {
        group.map((b) => {
          if (b.group === prefix) {
            b.children = [...b.children, ...g];
          }
        });
      } else {
        group.push({
          group: prefix,
          children: g,
        });
      }

    });
    return group;
  };

  const group = intelligentGroup();

  return (
    <PageHeaderWrapper content="数据面板页">
      <Card>
        <div style={{ margin: '0 0 15px 0' }}>
          {
            group.map((d, i) => {
              return (
                <div key={`p_${i}`}>
                  <Radio.Group name={'table_select_radio'} value={selectRouter}
                               onChange={(ev) => tabChange(ev.target.value)}
                               buttonStyle="solid">
                    {
                      Object.keys(d.children).map((k) => {
                        let v = d.children[k];
                        if (v !== config.user_model_name) {
                          return <Radio value={v} key={v}>{v}</Radio>;
                        }
                      })
                    }
                  </Radio.Group>
                </div>
              );
            })
          }


        </div>


        <div>
          {operations}
          <Table
            scroll={{ x: true, scrollToFirstRowOnChange: true }}
            rowKey={autoincrName.toLowerCase()}
            rowSelection={rowSelection}
            dataSource={routerData.data}
            columns={columns}
            pagination={{
              hideOnSinglePage: true,
              pageSize: routerData.page_size,
              showSizeChanger: false,
              total: routerData.all,
              showTotal: (total, range) => {
                return (`共有 ${total} 条数据`);
              },
              current: routerData.page,
              onChange: pageChange,
            }}
            size={'small'}
            loading={fetchDataLoading}
          />
        </div>

      </Card>

      {
        editModalShow ? <CollectionCreateForm
          fieldsList={routerFields}
          initValues={editRow}
          loading={addRowLoading || updateRowLoading}
          onCreate={onCreate}
          onCancel={() => setEditModalShow(false)}

        /> : null
      }
      {
        actionModalShow ? <CollectionCreateForm
          fieldsList={selectAction}
          initValues={editRow}
          isAction={true}
          loading={actionLoading}
          onCreate={customActionCreate}
          onCancel={() => setActionModalShow(false)}

        /> : null
      }


    </PageHeaderWrapper>
  );
};

export default DataShow;
