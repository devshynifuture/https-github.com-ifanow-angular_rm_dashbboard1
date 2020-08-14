/// <reference lib="webworker" />

// import {MfServiceService} from './mf-service.service';
import {TempserviceService} from './tempservice.service';

// importScripts('tempservice.service.ts');                 /* imports just "foo.js" */

addEventListener('message', ({data}) => {
  const response = `worker response to ${data}`;
  // console.log(`addEventListener got message:`, data);
  const mfService = new TempserviceService();
  const mutualFundList = data.mutualFundList;
  const totalValue = mfService.getFinalTotalValue(mutualFundList);
  const customDataSourceData = mfService.subCatArrayForSummary(mutualFundList,data.type,data.mutualFund,data.showFolio);
  const customDataHolder=[];
  customDataSourceData.forEach(element => {
    customDataHolder.push({...element});
    element.ownerName = mfService.convertInTitleCase(element.ownerName);
    element.amountInvested = mfService.mutualFundRoundAndFormat(element.amountInvested, 0);
    element.totalAmountInvested = mfService.mutualFundRoundAndFormat(element.totalAmountInvested, 0);
    element.currentValue = mfService.mutualFundRoundAndFormat(element.currentValue, 0);
    element.totalCurrentValue = mfService.mutualFundRoundAndFormat(element.totalCurrentValue, 0);
    element.unrealizedGain = mfService.mutualFundRoundAndFormat(element.unrealizedGain, 0);
    element.totalUnrealizedGain = mfService.mutualFundRoundAndFormat(element.totalUnrealizedGain, 0);
    element.absoluteReturn = mfService.mutualFundRoundAndFormat(element.absoluteReturn, 2);
    element.totalAbsoluteReturn = mfService.mutualFundRoundAndFormat(element.totalAbsoluteReturn, 2);
    element.xirr = mfService.mutualFundRoundAndFormat(element.xirr, 2);
    element.totalXirr = mfService.mutualFundRoundAndFormat(element.totalXirr, 2);
    element.dividendPayout = mfService.mutualFundRoundAndFormat(element.dividendPayout, 0);
    element.totalDividendPayout = mfService.mutualFundRoundAndFormat(element.totalDividendPayout, 0);
    element.switchOut = mfService.mutualFundRoundAndFormat(element.switchOut, 0);
    element.totalSwitchOut = mfService.mutualFundRoundAndFormat(element.totalSwitchOut, 0);
    element.balanceUnit = mfService.mutualFundRoundAndFormat(element.balanceUnit, 2);
    element.totalBalanceUnit = mfService.mutualFundRoundAndFormat(element.totalBalanceUnit, 3);
    element.sipAmount = mfService.mutualFundRoundAndFormat(element.sipAmount, 0);
    element.totalSipAmount = mfService.mutualFundRoundAndFormat(element.totalSipAmount, 0);
    element.nav = mfService.mutualFundRoundAndFormat(element.nav, 3);

    element.navDate =  element.navDate ? new Date(element.navDate).toISOString().replace(/T.*/,'').split('-').reverse().join('-') : '';
    if(element && element.hasOwnProperty('mutualFundTransactions') && element.mutualFundTransactions.length > 0){
      element.investedDate =  element.mutualFundTransactions ? new Date(element.mutualFundTransactions[0].transactionDate).toISOString().replace(/T.*/,'').split('-').reverse().join('-') : ''; 
    }else{
      element.investedDate =  ''
    }
 
    
  });











  const output = {customDataSourceData ,totalValue,customDataHolder};
  // console.log('Mutual fund script output: ', output);
  postMessage(output);
  // postMessage(response);
});
