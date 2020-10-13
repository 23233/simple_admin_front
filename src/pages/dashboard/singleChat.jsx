import React, { useEffect, useState } from 'react';
import req from '../../utils/url';
import { useMount, useRequest, useSize, useUpdateEffect } from 'ahooks';
import Chart from '@ant-design/charts';
import ChartList from './chatType';
import { history } from 'umi';
import { Skeleton, Modal, Empty } from 'antd';
import dayjs from 'dayjs';
import zh from 'dayjs/locale/zh-cn';
import {
  DeleteOutlined,
  EditOutlined,
  ConsoleSqlOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import './singleChart.less';
import Config from './config';
import ROUTERS from '../../router';
import { Rnd } from 'react-rnd';


dayjs.locale(zh);

const { confirm } = Modal;

export default function({ data, screenId, run_flush, order, delay, freePosition = true }) {
  const defaultSize = 200;
  const [dataList, setDataList] = useState([]);
  const [showData, setShowData] = useState([]);
  const [previewShow, setPreviewShow] = useState(false);
  const [width, setWidth] = useState(data?.extra?.width || defaultSize);
  const [height, setHeight] = useState(data?.extra?.height || defaultSize);
  const [x, setX] = useState(data?.extra?.x || 0);
  const [y, setY] = useState(data?.extra.y || 0);

  const opList = [
    {
      name: '编辑',
      icon: <EditOutlined/>,
      func: () => history.push(ROUTERS.dashBoardEdit + `?screenId=${screenId}&id=${data.id}`),
    },
    {
      name: '删除',
      icon: <DeleteOutlined/>,
      func: () => deleteFunc(),
    },
    {
      name: '刷新',
      icon: <ReloadOutlined/>,
      func: () => getSource(),
    },
    {
      name: '预览配置',
      icon: <ConsoleSqlOutlined/>,
      func: () => showPreview(),
    },
  ];


  // 获取数据
  const { run: getDataSourceReq, loading: getDataSourceLoading } = useRequest(
    req.dataBoardGetData,
    {
      manual: true,
      loadingDelay: 200,
      fetchKey: data.id,
      onSuccess: resp => {
        if (!resp?.status) {
          setDataList(resp);
        }
      },
      [data.data_source.refresh_interval ? 'pollingInterval' : undefined]:
      data.data_source.refresh_interval * 1000,
      pollingWhenHidden: false,
    },
  );

  // 删除数据
  const { run: deleteChart, loading: deleteChartLoading } = useRequest(
    req.dashBoardDelete,
    {
      manual: true,
      onSuccess: resp => {
        if (!resp?.status) {
          run_flush && run_flush();
        }
      },
    },
  );

  // 更新位置
  const { run: updatePositionReq } = useRequest(req.dashBoardEditSize, { manual: true, debounceInterval: 200 });


  useUpdateEffect(() => {
    runUpdatePosition();
  }, [x, y, width, height]);

  const runUpdatePosition = () => {
    const d = {
      x,
      y,
      width,
      height,
    };
    updatePositionReq(screenId, data.id, JSON.stringify(d));
  };


  useEffect(() => {
    setTimeout(() => {
      getSource();
    }, delay);
  }, [data]);

  useEffect(() => {
    if (data.data_source[Config.distinct_key]) {
      const d = distinctAggregation(dataList, data.data_source[Config.distinct_key]);
      setShowData(d);
      return;
    }
    setShowData(dataList);
  }, [dataList]);

  // 去重聚合统计
  const distinctAggregation = (src, col_name) => {
    if (src && src.length) {
      // 去重
      const uniques = (arr, u_key) => [...arr.reduce((p, c) => p.set(c[u_key], c), new Map()).values()];
      const uniqueList = uniques(src, col_name);
      // 统计
      return uniqueList.map((d) => {
        d[Config.distinct_key] = src.filter((b) => b[col_name] === d[col_name]).length;
        return d;
      });
    }
    return src;

  };

  const parseData = () => {
    const col_op = data.data_source.column_op;
    col_op?.map(d => {
      if (d.value === '$(now)') {
        d.value = dayjs().format('YYYY-MM-DD HH:mm:ss');
      } else if (d.value === '$(unix)') {
        d.value = dayjs()
          .unix()
          .toString();
      } else if (d.value.startsWith('$(day)')) {
        d.value = varParse(d.value, 'YYYY-MM-DD HH:mm:ss');
      } else if (d.value.startsWith('$(day_start)')) {
        d.value = varParse(d.value, 'YYYY-MM-DD 00:00:00');
      } else if (d.value.startsWith('$(day_end)')) {
        d.value = varParse(d.value, 'YYYY-MM-DD 23:59:59');
      }
      return d;
    });
    return {
      column_op: col_op,
      limit: data.data_source.limit,
    };
  };

  const varParse = (srcValue, format) => {
    let result;
    if (srcValue.indexOf('-') >= 1) {
      const [c, opTime] = srcValue.split('-');
      result = dayjs()
        .subtract(opTime.trim(), 'day')
        .format(format);
    } else {
      result = dayjs().format(format);
    }
    return result;
  };

  const getSource = () => {
    const d = parseData();
    getDataSourceReq(data.data_source.selectRouter, d);
  };

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
      ...data.config,
      data: showData,
    };
    const item = ChartList.find(d => d.name === data.chart_type);
    const Tag = Chart[item.types];
    if (showData) {
      return (
        <Tag
          {...c}
          loading={getDataSourceLoading || deleteChartLoading}
          errorTemplate={error => {
            return <Empty description={`渲染出现错误 ${error}`}/>;
          }}
        />
      );
    }
    return <Empty description={'未获取到数据,请检查数据获取方式'}/>;
  };

  const showPreview = () => {
    setPreviewShow(true);
  };

  const content = () => {
    return (
      <div className="chart_wrap">
        <h4 title={data.name}>{data.name}</h4>
        <div style={{ height: freePosition ? 'calc(100% - 30px)' : defaultSize }}>{renders()}</div>
        <div className="op-wrap">
          {
            opList.map((d, i) => {
              return (
                <div className="icons" key={`chart_op_${i}`} title={d.name} onClick={d.func}>
                  {d.icon}
                </div>
              );
            })
          }
        </div>
      </div>
    );
  };


  return (
    <React.Fragment>
      {
        freePosition ? <Rnd
          size={{ width, height }}
          position={{ x, y }}
          bounds={'#canvas-wrap'}
          onDragStop={(e, d) => {
            setX(d.x);
            setY(d.y);
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            setWidth(ref.style.width);
            setHeight(ref.style.height);
            setX(position.x);
            setY(position.y);
          }}
        >
          {content()}
        </Rnd> : content()
      }

      <Modal
        title={'预览配置'}
        visible={previewShow}
        onOk={() => setPreviewShow(false)}
        onCancel={() => setPreviewShow(false)}
        okText={'确定'}
        cancelText={'取消'}
      >
        <div style={{ maxHeight: 400, overflow: 'auto' }}>
          <code style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(data, null, 2)}
          </code>
        </div>
      </Modal>
    </React.Fragment>
  );
}
