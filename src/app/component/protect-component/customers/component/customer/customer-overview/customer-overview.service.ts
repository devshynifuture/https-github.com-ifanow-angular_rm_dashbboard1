import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomerOverviewService {

  assetAllocationChart: any
  portFolioData: any;
  rtaFeedsData: any;
  riskProfileData: any;
  cashFlowData: any;
  documentVaultData: any;
  recentTransactionData: any;
  globalRiskProfileData: any;
  constructor() { }


  clearServiceData() {
    this.assetAllocationChart = undefined;
    this.portFolioData = undefined;
    this.rtaFeedsData = undefined;
    this.riskProfileData = undefined;
    this.cashFlowData = undefined;
    this.documentVaultData = undefined;
    this.recentTransactionData = undefined;
    this.globalRiskProfileData = undefined;
  }
}
