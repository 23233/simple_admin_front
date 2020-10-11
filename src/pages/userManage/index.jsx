import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Card,
  Button,
  Table,
  Popconfirm,
  Row,
  Col,
  message,
  Radio,
  Tooltip,
  Typography,
  Tag,
} from 'antd';
import { history } from 'umi';
import req from '../../utils/url';

const { Paragraph } = Typography;
const { CheckableTag } = Tag;

import CollectionCreateForm from '../dataShow/dataForm';
import { useModel } from 'umi';
import { useRequest, useMount } from 'ahooks';
import ROUTERS from '../../router';

const DataShow = props => {
  const { userInfo, config } = useModel('useAuthModel');
  // 所有表信息
  const [allRouter, setAllRouter] = useState([]);
  // 所有表别名信息
  const [remarks, setRemarks] = useState([]);
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
  // 当前选中的行
  const [selectRow, setSelectRow] = useState([]);

  // 修改选中的行
  const [editRow, setEditRow] = useState({});

  // 执行操作之后刷新
  const taskSuccess = d => {
    if (!d?.status) {
      fetchDataList(selectRouter);
    }
  };
  // 获取表信息
  const { run: fetchDataInfo } = useRequest(req.getRouterFields, {
    manual: true,
    onSuccess: d => {
      if (!d?.status) {
        setRouterFields(d);
      }
    },
  });
  // 获取表数据
  const { run: fetchDataList, loading: fetchDataLoading } = useRequest(
    req.getRouterData,
    {
      manual: true,
      onSuccess: d => {
        if (!d?.status) {
          setRouterData(d);
        }
      },
    },
  );

  // 删除选中行
  const { run: runDeleteRow } = useRequest(req.deleteRouterSelectData, {
    manual: true,
    onSuccess: taskSuccess,
  });

  // 修改密码
  const { run: changePassword, loading: changePasswordLoading } = useRequest(
    req.changeUserPassword,
    {
      manual: true,
      onSuccess: d => {
        if (!d?.status) {
          fetchDataList(selectRouter);
          setEditModalShow(false);
        }
      },
    },
  );

  // 修改权限
  const { run: changeRoles } = useRequest(req.changeUserRoles, {
    manual: true,
    onSuccess: taskSuccess,
  });

  useEffect(() => {
    if (config) {
      const a = async () => {
        const allTable = await req.getRouterLists();
        const remarks = allTable?.remarks;
        const tables = allTable?.tables;
        setAllRouter(tables);
        setRemarks(remarks);
        const defaultSelect = tables[config.user_model_name];
        setSelectRouter(defaultSelect);
        // 获取表的信息
        fetchDataInfo(defaultSelect);
        // 获取表数据
        fetchDataList(defaultSelect);
      };
      a();
    }
  }, [config]);

  const autoincrName = routerFields?.autoincr || 'id';

  let columns = [];
  if (routerData?.data?.length) {
    columns.push({
      title: autoincrName,
      dataIndex: autoincrName.toLowerCase(),
      key: 'tid',
      width: 80,
    });
    columns.push({
      title: '操作',
      dataIndex: 'operating',
      key: 'toperating',
      render: (text, row) => {
        return (
          <span>
            <Button onClick={e => onEdit(row)} type={'link'}>
              修改密码
            </Button>
          </span>
        );
      },
    });

    routerFields?.fields?.map((d, i) => {
      if (d.map_name !== autoincrName.toLowerCase()) {
        let w = 200;
        if (d.types.includes('int')) {
          w = 100;
        }
        columns.push({
          title: d?.comment_tags || d?.map_name,
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
    const tagsData = ['guest', 'staff', 'admin'];
    columns.push({
      title: '权限组',
      dataIndex: 'roles',
      render: (text, record) => {
        return tagsData.map(tag => (
          <CheckableTag
            key={tag}
            checked={text.indexOf(tag) > -1}
            onChange={checked => roleTagChange(tag, checked, record)}
          >
            {tag}
          </CheckableTag>
        ));
      },
    });
  }

  // 变更权限
  const roleTagChange = (tag, checked, record) => {
    changeRoles({
      id: parseInt(record[autoincrName]),
      role: tag,
      add: checked,
    });
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

  const onEdit = row => {
    setEditRow(row);
    setEditModalShow(true);
  };

  const onCreate = values => {
    changePassword({
      id: parseInt(editRow[autoincrName]),
      user_name: editRow.user_name,
      password: values.password,
    });
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
          <Button disabled={!selectRow.length}>
            删除选中的{selectRow.length}条数据
          </Button>
        </Popconfirm>
      </Col>
      <Col>
        <Button onClick={e => fetchDataList(selectRouter)}>刷新</Button>
      </Col>
      <Col>
        <Button target={'_blank'} href={ROUTERS.reg} type={'link'}>
          新增用户
        </Button>
      </Col>
    </Row>
  );

  const passwordFields = {
    fields: [
      {
        name: 'Password',
        map_name: 'password',
        types: 'string',
        sp_tags: '',
        validate_tags: '',
        comment_tags: '',
        attr_tags: '',
        xorm_tags: 'varchar(100) notnull',
      },
    ],
  };

  return (
    <PageHeaderWrapper content={remarks[config?.user_model_name]}>
      <Card>
        <div>
          {operations}
          <Table
            scroll={{ x: true, scrollToFirstRowOnChange: true }}
            rowKey={autoincrName.toLowerCase()}
            rowSelection={rowSelection}
            dataSource={routerData?.data.filter(
              d => d[autoincrName] !== userInfo?.userid,
            )}
            columns={columns}
            pagination={{
              hideOnSinglePage: true,
              pageSize: routerData?.page_size,
              total: routerData?.all,
              current: routerData?.page,
              onChange: pageChange,
            }}
            size={'small'}
            loading={fetchDataLoading}
          />
        </div>
      </Card>

      {editModalShow ? (
        <CollectionCreateForm
          fieldsList={passwordFields}
          initValues={{}}
          loading={changePasswordLoading}
          onCreate={onCreate}
          onCancel={() => setEditModalShow(false)}
        />
      ) : null}
    </PageHeaderWrapper>
  );
};

export default DataShow;
