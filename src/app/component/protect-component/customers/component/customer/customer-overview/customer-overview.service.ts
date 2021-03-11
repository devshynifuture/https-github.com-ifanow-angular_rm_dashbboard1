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
  bankList: any;
  dematList: any;
  addressList: any;
  familyMemberList: any;
  clientData: any;
  summaryLeftsidebarData: any;
  summaryCashFlowData: any;
  aumGraphdata: any;
  appearancePortfolio: any;
  documentFamilyMemberList: any;
  suggestedClientListUsingEmail: any;
  suggestedClientListUsingMobile: any;
  kycCountData: any
  constructor() { }


  clearServiceData() {
    this.assetAllocationChart = null;
    this.portFolioData = null;
    this.rtaFeedsData = null;
    this.riskProfileData = null;
    this.cashFlowData = null;
    this.documentVaultData = null;
    this.recentTransactionData = null;
    this.globalRiskProfileData = null;
    this.clientData = null;
    this.familyMemberList = null;
    this.addressList = null;
    this.bankList = null;
    this.dematList = null;
    this.summaryCashFlowData = null;
    this.aumGraphdata = null;
    this.summaryLeftsidebarData = null;
    this.appearancePortfolio = null;
    this.documentFamilyMemberList = null;
    this.suggestedClientListUsingMobile = null;
    this.suggestedClientListUsingEmail = null;
    this.kycCountData = null
  }
}
