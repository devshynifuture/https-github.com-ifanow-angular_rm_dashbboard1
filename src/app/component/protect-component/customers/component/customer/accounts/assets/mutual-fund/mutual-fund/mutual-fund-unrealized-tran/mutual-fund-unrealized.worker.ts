/// <reference lib="webworker" />

// import {MfServiceService} from './mf-service.service';

// importScripts('tempservice.service.ts');                 /* imports just "foo.js" */

import {TempserviceService} from '../../tempservice.service';

addEventListener('message', ({data}) => {
  const response = `worker response to ${data}`;
  console.log(`addEventListener got message: ${data}`);
  const mfService = new TempserviceService();
  const mutualFundList = data.mutualFundList;
  const dataSourceData = mfService.getCategoryForTransaction(mutualFundList, data.type);
  const totalValue = mfService.getFinalTotalValue(mutualFundList);
  const customDataSourceData = mfService.getSubCategoryArrayForTransaction(mutualFundList, data.type);
  const output = {dataSourceData, customDataSourceData, totalValue};
  console.log('Mutual fund script output: ', output);
  postMessage(output);
  // postMessage(response);
});
