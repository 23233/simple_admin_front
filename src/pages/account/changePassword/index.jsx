import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Card, message } from 'antd';
import { history } from 'umi';
import { useRequest } from '@umijs/hooks';
import req from '../../../utils/url';

import CollectionCreateForm from '../../dataShow/dataForm';
import { useModel } from 'umi';


export default function(props) {
  const { userInfo } = useModel('useAuthModel');

  const { loading, run } = useRequest(req.changeUserPassword, {
    manual: true, onSuccess: (data => {
      message.success('修改密码成功');
      history.goBack();
    }),
  });


  const onPasswordChangeCreate = values => {

    const params = {
      id: parseInt(userInfo.userid),
      user_name: userInfo.name,
      password: values.password,
    };

    run(params);

  };


  const passwordFields = {
    fields: [{
      name: 'Password',
      types: 'string',
      map_name: 'password',
      xorm_tags: '',
      sp_tags: '',
    }],
  };

  return (
    <PageHeaderWrapper content="用户密码变更">
      <Card>

        <CollectionCreateForm
          fieldsList={passwordFields}
          initValues={{}}
          onCreate={onPasswordChangeCreate}
          onCancel={() => history.goBack()}

        />
      </Card>


    </PageHeaderWrapper>
  );
};


