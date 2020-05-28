/// <reference lib="webworker" />

// import {MfServiceService} from './mf-service.service';

// importScripts('tempservice.service.ts');                 /* imports just "foo.js" */

import {TempserviceService} from '../../tempservice.service';
// import {UtilService} from '../../../../../../../../../../services/util.service';

addEventListener('message', ({data}) => {
  const response = `worker response to ${data}`;
  // console.log(`addEventListener got message: ${data}`);
  const mfService = new TempserviceService();
  const mutualFundList = data.mutualFundList;
  const dataSourceData = mfService.getCategoryForTransaction(mutualFundList, data.type, data.mutualFund,data.showFolio);
  const totalValue = mfService.getFinalTotalValue(mutualFundList);
  const customDataSourceData = mfService.getSubCategoryArrayForTransaction(mutualFundList, data.type, data.nav, data.mutualFund, data.transactionType, data.viewMode,data.showFolio);
  const customDataHolder = [];
  totalValue.grandTotal = mfService.mutualFundRoundAndFormat(totalValue.grandTotal, 2);
  customDataSourceData.forEach(element => {
    customDataHolder.push({...element});
    if (element.currentAmount && element.amount && !element.gain) {
      element.gain = element.currentAmount - element.amount;
      element.gain = mfService.mutualFundRoundAndFormat(element.gain, 2);

    } else {
    }

    if (element.totalCurrentValue && element.totalTransactionAmt && !element.totalGain) {
      element.totalGain = element.totalCurrentValue - element.totalTransactionAmt;
      element.totalGain = mfService.mutualFundRoundAndFormat(element.totalGain, 2);
    } else {

    }

    element.amount = mfService.mutualFundRoundAndFormat(element.amount, 2);
    element.totalTransactionAmt = mfService.mutualFundRoundAndFormat(element.totalTransactionAmt, 2);
    if (element.transactionNav && element.transactionNav > 0) {
      element.transactionNav = mfService.mutualFundRoundAndFormat(element.transactionNav, 4);
    } else {
      element.transactionNav = '';
    }
    element.totalNav = mfService.mutualFundRoundAndFormat(element.totalNav, 3);
    element.unit = mfService.mutualFundRoundAndFormat(element.unit, 3);
    element.totalUnit = mfService.mutualFundRoundAndFormat(element.totalUnit, 3);
    element.balanceUnits = mfService.mutualFundRoundAndFormat(element.balanceUnits, 3);
    element.totalBalanceUnit = mfService.mutualFundRoundAndFormat(element.totalBalanceUnit, 2);
    element.currentAmount = mfService.mutualFundRoundAndFormat(element.currentAmount, 2);
    element.totalCurrentValue = mfService.mutualFundRoundAndFormat(element.totalCurrentValue, 2);
    element.dividendPayout = mfService.mutualFundRoundAndFormat(element.dividendPayout, 2);
    element.dividendReinvest = mfService.mutualFundRoundAndFormat(element.dividendReinvest, 2);
    element.absoluteReturn = mfService.mutualFundRoundAndFormat(element.absoluteReturn, 2);
    element.trnAbsoluteReturn = mfService.mutualFundRoundAndFormat(element.trnAbsoluteReturn, 2);
    element.cagr = mfService.mutualFundRoundAndFormat(element.cagr, 2);
    element.totalCagr = mfService.mutualFundRoundAndFormat(element.totalCagr, 2);
  });

  const output = {dataSourceData, customDataSourceData, totalValue, customDataHolder};


  // console.log('Mutual fund script output: ', output);
  postMessage(output);
  // postMessage(response);
});
