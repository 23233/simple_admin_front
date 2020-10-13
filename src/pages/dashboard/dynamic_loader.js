import React from 'react';
import { dynamic } from 'umi';

export default dynamic({
  loader: async function() {
    const { default: ChartAddEdit } = await import(/* webpackChunkName: "external_chartAddEdit" */ './addOrEdit');
    return ChartAddEdit;
  },
});
