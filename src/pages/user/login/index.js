import { Form, Input, Button, Row, Col, Typography, message } from 'antd';
import { useModel, history } from 'umi';
import React from 'react';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import Style from './index.less';
import { useRequest } from 'ahooks';
import req from '../../../utils/url';
import { parse } from 'querystring';
import ROUTERS from '../../../router';

const { Title } = Typography;

export default (props) => {
  const { config, setUserToken } = useModel('useAuthModel');
  const isLogin = props.route.name === 'login';
  const action = isLogin ? '登录' : '注册';

  const getPageQuery = () => parse(window.location.href.split('?')[1]);

  const { run, loading } = useRequest(isLogin ? req.accountLogin : req.accountReg, {
    manual: true, onSuccess: (d => {
      if (!d?.status) {
        message.success(`${action}成功`);
        setUserToken(d.token);
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
            console.log('redirect', redirect);
            if (redirect === config?.prefix) {
              redirect = ROUTERS.welcome;
              console.log('匹配到前缀');
            }

          } else {
            window.location.href = '/';
            return;
          }
        }
        history.replace(redirect || '/');
      }
    }),
  });


  const onFinish = values => {
    run(values);
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className={Style.bg}>
      <Row align="middle" justify="center">
        <Col>
          <div className={Style.w}>
            <Title level={1} className={Style.title}>{config?.name}</Title>
            <Form
              autoComplete={'off'}
              name="basic"
              size={'large'}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                name="user_name"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input prefix={<UserOutlined/>} placeholder={'请输入用户名'}/>
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password prefix={<LockOutlined/>} placeholder={'请输入密码'}/>
              </Form.Item>

              <Form.Item>
                <Button type="primary" loading={loading} htmlType="submit" block>
                  {action}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>

    </div>

  );
};

