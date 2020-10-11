import React, { useEffect, useState } from 'react';
import req from '../../utils/url';
import { useMount, useRequest } from 'ahooks';
import Chart from '@ant-design/charts';
import ChartList from './chatType';
import { Skeleton, Modal, Empty } from 'antd';
import dayjs from 'dayjs';
import zh from 'dayjs/locale/zh-cn';
import { DeleteOutlined, ConsoleSqlOutlined } from '@ant-design/icons';
import './singleChart.less';

dayjs.locale(zh);

const { confirm } = Modal;

export default function({ data, screenId, run_flush, delay }) {
  const [dataList, setDataList] = useState([]);
  const [previewShow, setPreviewShow] = useState(false);
  // 获取数据
  const { run: getDataSourceReq, loading: getDataSourceLoading } = useRequest(req.dataBoardGetData, {
    manual: true,
    loadingDelay: 200,
    fetchKey: data.id,
    onSuccess: (resp) => {
      if (!resp?.status) {
        setDataList(resp);
      }
    },
    [data.data_source.refresh_interval ? 'pollingInterval' : undefined]: data.data_source.refresh_interval * 1000,
    pollingWhenHidden: false,
  });

  // 删除数据
  const { run: deleteChart, loading: deleteChartLoading } = useRequest(req.dashBoardDelete, {
    manual: true, onSuccess: (resp) => {
      if (!resp?.status) {
        run_flush && run_flush();
      }
    },
  });

  const defaultHeight = 150;

  useEffect(() => {
    const col_op = data.data_source.column_op;
    col_op?.map((d) => {
      if (d.value === '$(now)') {
        d.value = dayjs().unix().toString();
      } else if (d.value.startsWith('$(day)')) {
        // 如果有减法需求
        if (d.value.indexOf('-') >= 0) {
          const [c, opTime] = d.value.split('-');
          d.value = dayjs().subtract(opTime.trim(), 'day').format('YYYY-MM-DD 00:00:00');
        } else {
          d.value = dayjs().format('YYYY-MM-DD 23:59:59');
        }
      }
      return d;
    });
    const d = {
      column_op: col_op,
      limit: data.data_source.limit,
    };
    setTimeout(() => {
      getDataSourceReq(data.data_source.selectRouter, d);
    }, delay);
  }, []);


  // 删除图例
  const deleteFunc = () => {
    confirm({
      title: '确定删除图表吗?',
      content: '此操作不可逆,请谨慎!',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        deleteChart(screenId, data.id);
      },
    });
  };


  // 类型判断
  const renders = () => {
    const c = {
      height: defaultHeight,
      ...data.config,
      data: dataList,
    };
    const item = ChartList.find((d) => d.name === data.chart_type);
    const Tag = Chart[item.types];
    if (dataList) {
      return <Tag {...c}/>;
    }
    return <Empty description={'未获取到数据,请检查数据获取方式'}/>;

  };

  const showPreview = () => {
    setPreviewShow(true);
  };


  return (
    <Skeleton loading={getDataSourceLoading || deleteChartLoading} style={{ minHeight: defaultHeight }}>
      <div className="chart_wrap">
        <h4 title={data.name}>{data.name}</h4>
        <div>
          {renders()}
        </div>
        <div className="op-wrap">
          <div className="icons" title="删除" onClick={deleteFunc}>
            <DeleteOutlined/>
          </div>
          <div className="icons" title="预览配置" onClick={showPreview}>
            <ConsoleSqlOutlined/>
          </div>
        </div>
      </div>

      <Modal title={'预览配置'}
             visible={previewShow}
             onOk={() => setPreviewShow(false)}
             onCancel={() => setPreviewShow(false)}
             okText={'确定'}
             cancelText={'取消'}>
        <div style={{ maxHeight: 400, overflow: 'auto' }}>
          <code style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(data, null, 2)}
          </code>
        </div>

      </Modal>


    </Skeleton>
  );
}
