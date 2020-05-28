import {TempserviceService} from './tempservice.service';

declare function postMessage(message: any): void;


export const MUTUAL_FUND_SUMMARY = (input) => {
  console.log('Mutual fund script output: ');

  const mfService: TempserviceService = new TempserviceService();
  const mutualFundList = input.mutualFundList;
  const customDataSourceData = mfService.subCatArrayForSummary(mutualFundList, input.type,input.mutualFund,input.showFolio);

  const output = {customDataSourceData};
  console.log('Mutual fund script output: ', output);
  postMessage(output);
};
