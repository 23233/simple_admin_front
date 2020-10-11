import React, { useEffect, useState } from 'react';
import { Steps, Empty } from 'antd';
import SelectDataSource from './selectDataSource';
import GetData from './getData';
import SelectChatType from './selectChart';
import ChatConfig from './chatConfig';
import { useMount, useRequest } from 'ahooks';
import req from '../../utils/url';

const { Step } = Steps;
import { Context } from './context';

export default function({ initValues, onSuccess }) {
  const [nowStep, setNowStep] = useState(0);
  // 步骤列表
  const [stepList, setStepList] = useState([
    '选择数据源',
    '配置数据获取方式',
    '选择图表类型',
    '配置图表参数',
  ]);
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
  // 数据源获取方式
  const [dataSourceForm, setDataSourceForm] = useState({});
  // 配置文件获取方式
  const [chatConfigForm, setChatConfigForm] = useState({});
  // 选中的图表类型
  const [chatType, setChatType] = useState(null);

  // 获取表信息
  const { run: fetchDataInfo, loading: fetchInfoLoading } = useRequest(
    req.getRouterFields,
    {
      manual: true,
      onSuccess: async resp => {
        if (!resp?.status) {
          setRouterFields(resp);
          setShowDataSource(!showDataSource);
          nextStep();
        }
      },
    },
  );

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

  useEffect(() => {
    if (nowStep === stepList.length) {
      const result = {
        selectRouter,
        dataSourceForm,
        chatConfigForm,
        chatType,
      };
      onSuccess && onSuccess(result);
    }
  }, [nowStep]);

  const nextStep = () => {
    setNowStep(nowStep + 1);
  };

  const prevStep = () => {
    setNowStep(nowStep - 1);
  };

  return (
    <Context.Provider
      value={{
        nextStep,
        prevStep,
        allRouter,
        remarks,
        selectRouter,
        setSelectRouter,
        routerFields,
        fetchInfoLoading,
        setDataSourceForm,
        setChatConfigForm,
        chatType,
        setChatType,
      }}
    >
      <div>
        <Steps current={nowStep}>
          {stepList.map((d, i) => {
            return <Step key={`step_${i}`} title={d}/>;
          })}
        </Steps>

        <div style={{ padding: '25px 0' }}>
          {nowStep === 0 && <SelectDataSource/>}
          {nowStep === 1 && <GetData/>}
          {nowStep === 2 && <SelectChatType/>}
          {nowStep === 3 && <ChatConfig/>}
          {
            nowStep === 4 && <Empty description={'图表正在新增中,完成后会自动跳转...'}/>
          }
        </div>
      </div>
    </Context.Provider>
  );
}
