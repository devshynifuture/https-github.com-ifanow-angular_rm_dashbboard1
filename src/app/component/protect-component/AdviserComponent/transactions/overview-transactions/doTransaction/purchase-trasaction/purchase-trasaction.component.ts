import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { ConfirmationTransactionComponent } from '../confirmation-transaction/confirmation-transaction.component';
import { OnlineTrasactionComponent } from '../online-trasaction/online-trasaction.component';
import { OnlineTransactionService } from '../../../online-transaction.service';
import { ProcessTransactionService } from '../process-transaction.service';

@Component({
  selector: 'app-purchase-trasaction',
  templateUrl: './purchase-trasaction.component.html',
  styleUrls: ['./purchase-trasaction.component.scss']
})
export class PurchaseTrasactionComponent implements OnInit {
  purchaseTransaction: any;
  dataSource: any;
  ownerData: any;
  inputData: any;
  isViewInitCalled = false;
  selectedFamilyMember: any;
  confirmTrasaction = false
  transactionType: any;
  folioSelection: [2]
  schemeSelection: [2]
  selectScheme = 2;
  schemeList: any;
  navOfSelectedScheme: any;
  schemeDetails: any;
  reInvestmentOpt = [];
  transactionSummary: {};
  platformType = 2
  ExistingOrNew: any;
  maiSchemeList: any;
  getDataSummary: any;
  scheme: any;
  constructor(private processTransaction: ProcessTransactionService, private onlineTransact: OnlineTransactionService, private subInjectService: SubscriptionInject,
    private fb: FormBuilder) { }
  @Input()
  set data(data) {
    this.inputData = data;
    this.transactionType = data.transactionType
    this.selectedFamilyMember = data.selectedFamilyMember
    console.log('This is Input data', data);
    if (this.isViewInitCalled) {
      this.getdataForm('');
    }
  }

  get data() {
    return this.inputData;
  }

  ngOnInit() {
    this.getdataForm(this.inputData);
    this.transactionSummary = { selectedFamilyMember: this.inputData.selectedFamilyMember }
    console.log('this.transactionSummary', this.transactionSummary)
  }
  selectSchemeOption(value) {
    console.log('value selction scheme', value)
    this.selectScheme = value
  }

  getSchemeList(value) {

    if (this.selectScheme == 2 && value.length > 2) {
      let obj = {
        searchQuery: value,
        bseOrderType: 'ORDER',
        aggregatorType: 2,
        advisorId: 414,
        tpUserCredentialId: 212,
      }
      this.onlineTransact.getNewSchemes(obj).subscribe(
        data => this.getNewSchemesRes(data)
      );
    } else {

    }
  }
  reinvest(scheme) {
    this.schemeDetails = scheme
    this.transactionSummary = {
      schemeName: scheme.schemeName
    }
    console.log('schemeDetails == ', this.schemeDetails)
  }
  selectExistingOrNew(value) {
    this.ExistingOrNew = value
  }
  selectedScheme(scheme) {
    this.scheme = scheme
    this.transactionSummary = { schemeName: scheme.schemeName }
    this.navOfSelectedScheme = scheme.nav
    let obj1 = {
      mutualFundSchemeMasterId: scheme.mutualFundSchemeMasterId,
      aggregatorType: 2,
      orderType: 'ORDER',
      userAccountType: 1,
    }
    this.onlineTransact.getSchemeDetails(obj1).subscribe(
      data => this.getSchemeDetailsRes(data)
    );
  }
  getSchemeDetailsRes(data) {
    console.log('getSchemeDetailsRes == ', data)
    this.maiSchemeList = data
    this.schemeDetails = data[0]
    this.schemeDetails.selectedFamilyMember = this.selectedFamilyMember;
    if (data.length > 1) {
      this.reInvestmentOpt = data
      console.log('reinvestment', this.reInvestmentOpt)
    } if (data.length == 1) {
      this.reInvestmentOpt = []
    }
  }
  enteredAmount(value) {
    this.transactionSummary = { enteredAmount: value }
  }
  getNewSchemesRes(data) {
    console.log('new schemes', data)
    this.schemeList = data
  }
  getDefaultDetails(data) {
    console.log('get defaul here yupeeee', data)
    this.getDataSummary = data
  }
  onAddTransaction(value, data) {
    this.confirmTrasaction = true
    const fragmentData = {
      flag: 'addNsc',
      data,
      id: 1,
      state: 'open65',
      componentName: ConfirmationTransactionComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getNscSchemedata();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);
          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
  getdataForm(data) {
    if (!data) {
      data = {};
    }
    if (this.dataSource) {
      data = this.dataSource;
    }
    this.purchaseTransaction = this.fb.group({
      ownerName: [(!data) ? '' : data.ownerName, [Validators.required]],
      transactionType: [(!data) ? '' : data.transactionType, [Validators.required]],
      bankAccountSelection: [(!data) ? '' : data.bankAccountSelection, [Validators.required]],
      schemeSelection: ['2'],
      investor: [(!data) ? '' : data.investor, [Validators.required]],
      employeeContry: [(!data) ? '' : data.employeeContry, [Validators.required]],
      investmentAccountSelection: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      modeOfPaymentSelection: ['1'],
      folioSelection: ['2'],
      selectInvestor: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
    });

    this.ownerData = this.purchaseTransaction.controls;
  }

  getFormControl(): any {
    return this.purchaseTransaction.controls;
  }
  purchase() {
    let obj = {
      productDbId: this.schemeDetails.id,
      mutualFundSchemeMasterId: this.scheme.mutualFundSchemeMasterId,
      productCode: this.schemeDetails.schemeCode,
      isin: this.schemeDetails.isin,
      folioNo: (this.schemeDetails.folioNo==undefined)?null:this.schemeDetails.folioNo,
      // schemePlan : ,
      tpUserCredentialId: this.getDataSummary.defaultClient.tpUserCredentialId,
      tpSubBrokerCredentialId : this.getDataSummary.defaultCredential.subBrokerCredentialId,
      familyMemberId: this.getDataSummary.defaultClient.familyMemberId,
      adminAdvisorId: this.getDataSummary.defaultClient.advisorId,
      clientId: this.getDataSummary.defaultClient.clientId,
      orderType: 'ORDER',
      buySell: 'PURCHASE',
      transCode: 'NEW',
      buySellType: (this.purchaseTransaction.controls.folioSelection.value == '1') ? "ADDITIONAL" : "FRESH",
      dividendReinvestmentFlag: this.schemeDetails.dividendReinvestmentFlag,
      amountType: 'Amount',
      clientCode: this.getDataSummary.defaultClient.clientCode,
      orderVal: this.purchaseTransaction.controls.employeeContry.value,
      // schemeCd:,
      // userId: ,
      euin: this.getDataSummary.defaultCredential.euin,
      bseDPTransType: 'PHYSICAL',
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      // teamMemberSessionId : ,
    }
    console.log('new purchase obj',obj)
    this.onlineTransact.purchase(obj).subscribe(
      data => this.purchaseRes(data)
    );
  }
  purchaseRes(data){
    console.log('purchase transaction ==',data)
  }
}
