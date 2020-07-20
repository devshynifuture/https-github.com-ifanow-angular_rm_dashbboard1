import { TempServiceService } from "./temp-service.service";

// <reference lib="webworker" />

// import {MfServiceService} from './mf-service.service';

// importScripts('tempservice.service.ts');                 /* imports just "foo.js" */

addEventListener('message', ({ data }) => {
    const response = `worker response to ${data}`;
    // console.log(`addEventListener got message:`, data);
    const mfService = new TempServiceService();
    const mutualFundList = data.mutualFundList;
    const totalValue = mfService.getFinalTotalValue(mutualFundList);
    const customDataSourceData = mfService.subCatArrayForSummary(mutualFundList, data.type, data.mutualFund, data.showFolio);
    const output = { customDataSourceData, totalValue };
    // console.log('Mutual fund script output: ', output);
    postMessage(output);
    // postMessage(response);
})