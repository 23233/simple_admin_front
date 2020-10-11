import React, { useContext } from 'react';
import { Row, Col, List, Button, Select } from 'antd';
import { Context } from './context';
import './selectChat.less';
import charTypeJson from './chatType.json';

const { Option } = Select;

export default function({ initValues }) {
  const { nextStep, prevStep, setChatType } = useContext(Context);

  // 获取方式 https://charts.ant.design/demos/global
  // var importJs=document.createElement('script')//在页面新建一个script标签
  // importJs.setAttribute("type","text/javascript")//给script标签增加type属性
  // importJs.setAttribute("src", 'https://ajax.microsoft.com/ajax/jquery/jquery-1.4.min.js') //给script标签增加src属性， url地址为cdn公共库里的
  // document.getElementsByTagName("head")[0].appendChild(importJs)
  // var result = [];
  // var s = $('.markdown').children();
  // s.each(function(index) {
  //   if ($(this).attr('tagName') === 'H2') {
  //     var p = $(this).text();
  //     var img = $('img', s[index + 1]).attr('src');
  //     var href = window.location.protocol + "//" + window.location.host+$('a', s[index + 1]).attr('href');
  //     var types = new URL(href).pathname.replace("/demos/","")
  //     var reg = /-(\w)/g;
  //     types = types.replace(reg,function($,$1){
  //         return $1.toUpperCase();
  //         })
  //     result.push({ 'name': p, 'preview': img, 'href': href,'types':types.slice(0, 1).toUpperCase() + types.slice(1) });
  //   }
  // });

  const selectChat = item => {
    setChatType(item);
    nextStep();
  };

  return (
    <React.Fragment>
      <Row style={{ padding: '10px 0 25px' }}>
        <Col>
          <Button type="default" htmlType="button" onClick={prevStep}>
            返回
          </Button>
        </Col>
        <Col>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="快速选择"
            optionFilterProp="children"
            onChange={value =>
              selectChat(charTypeJson.find(d => d.name === value))
            }
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {charTypeJson.map((d, i) => {
              return (
                <Option key={`ii${i}`} value={d.name}>
                  {d.name}
                </Option>
              );
            })}
          </Select>
        </Col>
      </Row>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 3,
          xl: 3,
          xxl: 4,
        }}
        dataSource={charTypeJson}
        renderItem={item => (
          <List.Item style={{ marginBottom: 5 }}>
            <div
              title={item.name}
              onClick={() => selectChat(item)}
              className="chat_li"
            >
              <img src={item.preview} alt={item.name}/>
              <p>{item.name}</p>
            </div>
          </List.Item>
        )}
      />
    </React.Fragment>
  );
}
