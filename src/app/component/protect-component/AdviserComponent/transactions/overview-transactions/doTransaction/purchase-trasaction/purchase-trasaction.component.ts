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
  platformType
  selectScheme = 2;
  schemeList: any;
  navOfSelectedScheme: any;
  schemeDetails: any;
  reInvestmentOpt = [];
  transactionSummary: {};
  ExistingOrNew: any;
  maiSchemeList: any;
  getDataSummary: any;
  scheme: any;
  folioList: any;
  folioDetails: any;
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
    let obj = {
      searchQuery: value,
      bseOrderType: 'ORDER',
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      advisorId: 414,
      tpUserCredentialId: this.getDataSummary.defaultClient.tpUserCredentialId,
      familyMemberId: this.getDataSummary.defaultClient.familyMemberId,
      clientId: this.getDataSummary.defaultClient.clientId,
    }
    if (this.selectScheme == 2 && value.length > 2) {
      this.onlineTransact.getNewSchemes(obj).subscribe(
        data => this.getNewSchemesRes(data)
      );
    } else {
      this.onlineTransact.getExistingSchemes(obj).subscribe(
        data => this.getExistingSchemesRes(data)
      );
    }
  }
  getNewSchemesRes(data) {
    console.log('new schemes', data)
    this.schemeList = data
  }
  getExistingSchemesRes(data) {
    this.schemeList = data
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
    this.purchaseTransaction.controls["employeeContry"].setValidators([Validators.min(this.schemeDetails.minimumPurchaseAmount)])
    this.schemeDetails.selectedFamilyMember = this.selectedFamilyMember;
    if (data.length > 1) {
      this.reInvestmentOpt = data
      console.log('reinvestment', this.reInvestmentOpt)
    } if (data.length == 1) {
      this.reInvestmentOpt = []
    }
    this.getAmcWiseFolio()
  }
  getAmcWiseFolio() {
    let obj1 = {
      amcId: this.scheme.amcId,
      advisorId: this.getDataSummary.defaultClient.advisorId,
      familyMemberId: this.getDataSummary.defaultClient.familyMemberId,
      clientId: this.getDataSummary.defaultClient.clientId,
    }
    this.onlineTransact.getFoliosAmcWise(obj1).subscribe(
      data => this.getFoliosAmcWiseRes(data)
    );
  }
  getFoliosAmcWiseRes(data) {
    console.log('getFoliosAmcWiseRes', data)
    this.folioList = data
  }
  selectedFolio(folio) {
    this.folioDetails = folio
    this.transactionSummary = { folioNumber: folio.folioNumber }
  }
  enteredAmount(value) {
    this.transactionSummary = { enteredAmount: value }
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
      employeeContry: [(!data) ? '' : data.employeeContry, [Validators.required,]],
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
    if (this.purchaseTransaction.get('investor').invalid) {
      this.purchaseTransaction.get('investor').markAsTouched();
      return;
    } else if (this.purchaseTransaction.get('folioSelection').invalid) {
      this.purchaseTransaction.get('folioSelection').markAsTouched();
      return;
    } else {
      let obj = {
        productDbId: this.schemeDetails.id,
        mutualFundSchemeMasterId: this.scheme.mutualFundSchemeMasterId,
        productCode: this.schemeDetails.schemeCode,
        isin: this.schemeDetails.isin,
        folioNo: (this.folioDetails == undefined) ? null : this.folioDetails.folioNumber,
        tpUserCredentialId: this.getDataSummary.defaultClient.tpUserCredentialId,
        tpSubBrokerCredentialId: this.getDataSummary.defaultCredential.tpSubBrokerCredentialId,
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
        euin: this.getDataSummary.defaultCredential.euin,
        bseDPTransType: 'PHYSICAL',
        aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      }
      console.log('new purchase obj', obj)
      this.onlineTransact.purchase(obj).subscribe(
        data => this.purchaseRes(data)
      );
    }
  }
  purchaseRes(data) {
    console.log('purchase transaction ==', data)
    if(data){
      this.onAddTransaction('confirm',null)
    }
  }
}
