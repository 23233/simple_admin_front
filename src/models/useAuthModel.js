import { useState, useCallback, useEffect } from 'react';
import { useLocalStorageState, useMount, useRequest } from '@umijs/hooks';
import req from '../utils/url';
import Router from '../router';


export default function useAuthModel() {
  let [userInfo, setUserInfo] = useLocalStorageState('simple_user_info');
  let [userToken, setUserToken] = useLocalStorageState('simple_token');
  let [config, setConfig] = useState(null);


  useMount(async () => {
    const data = await req.getConfig();
    setConfig(data);
  });


  const { run: fetchUserInfo } = useRequest(req.queryCurrent, {
    manual: true, fetchKey: 'fetch_user', onSuccess: (result, params) => {
      setUserInfo(result);
    },
  });

  useEffect(() => {
    if (userToken) {
      fetchUserInfo();
    }
  }, [userToken]);

  const signin = useCallback((account, password) => {
    // signin implementation
    // setUser(user from signin API)
  }, []);

  const signout = useCallback(() => {
    setUserInfo();
    setUserToken();
  }, []);

  return {
    userInfo,
    setUserInfo,
    userToken,
    setUserToken,
    signin,
    signout,
    config,
    setConfig,
  };
}
