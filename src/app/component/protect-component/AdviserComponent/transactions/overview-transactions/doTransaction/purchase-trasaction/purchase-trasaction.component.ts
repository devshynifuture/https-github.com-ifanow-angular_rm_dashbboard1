import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { OnlineTransactionService } from '../../../online-transaction.service';
import { ProcessTransactionService } from '../process-transaction.service';
import { EventService } from 'src/app/Data-service/event.service';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

@Component({
  selector: 'app-purchase-trasaction',
  templateUrl: './purchase-trasaction.component.html',
  styleUrls: ['./purchase-trasaction.component.scss']
})
export class PurchaseTrasactionComponent implements OnInit {
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE & PROCEED',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
    // buttonIcon: {
    //   fontIcon: 'favorite'
    // }
  }
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
  showSpinner = false;
  bankDetails: any;
  achMandateNSE: any;
  callOnFolioSelection: boolean;
  showSpinnerMandate = false;
  showSpinnerFolio = false;
  childTransactions: any[];
  multiTransact = false;
  schemeInput: any;
  showError = false;
  constructor(private processTransaction: ProcessTransactionService, private onlineTransact: OnlineTransactionService,
    private subInjectService: SubscriptionInject, private fb: FormBuilder, private eventService: EventService,
    private customerService: CustomerService, ) { }
  displayedColumns: string[] = ['no', 'folio', 'ownerName', 'amount'];
  dataSource1 = ELEMENT_DATA;
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
    this.transactionSummary = {}
    this.childTransactions = []
    this.getdataForm(this.inputData);
    Object.assign(this.transactionSummary, { selectedFamilyMember: this.inputData.selectedFamilyMember });
    Object.assign(this.transactionSummary, { paymentMode: 1 });
    Object.assign(this.transactionSummary, { allEdit: true });
    Object.assign(this.transactionSummary, { transactType: 'PURCHASE' });
    console.log('this.transactionSummary', this.transactionSummary)
  }
  selectSchemeOption(value) {
    console.log('value selction scheme', value)
    this.purchaseTransaction.controls.schemePurchase.reset()
    this.selectScheme = value
  }
  getSchemeList(value) {
    this.showSpinner = true
    this.platformType = this.getDataSummary.defaultClient.aggregatorType
    console.log("valuelength-------------->",value.length)
    let obj = {
      searchQuery: value,
      bseOrderType: 'ORDER',
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      advisorId: 414,
      tpUserCredentialId: this.getDataSummary.defaultClient.tpUserCredentialId,
      familyMemberId: this.getDataSummary.defaultClient.familyMemberId,
      clientId: this.getDataSummary.defaultClient.clientId,
      userAccountType: this.getDataSummary.defaultCredential.accountType,
      holdingType: this.getDataSummary.defaultClient.holdingType,
      tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId,
    }
    if (this.selectScheme == 2 && value.length > 2) {
      this.onlineTransact.getNewSchemes(obj).subscribe(
        data => this.getNewSchemesRes(data), (error) => {
          this.eventService.showErrorMessage(error);
        }
      );
    } else {
      this.onlineTransact.getExistingSchemes(obj).subscribe(
        data => this.getExistingSchemesRes(data), (error) => {
          this.eventService.showErrorMessage(error);
        }
      );
    }
  }
  getNewSchemesRes(data) {
    this.showSpinner = false
    if(data.length==0){
      this.purchaseTransaction.get('schemePurchase').setErrors({'setValue':'Selected scheme does not exist'});
      this.purchaseTransaction.get('schemePurchase').markAsTouched();
    }
    console.log('new schemes', data)
    this.schemeList = data
  }
  getExistingSchemesRes(data) {
    this.showSpinner = false
    if(data.length==0){
      this.purchaseTransaction.get('schemePurchase').setErrors({'setValue':'Selected scheme does not exist'});
      this.purchaseTransaction.get('schemePurchase').markAsTouched();
    }
    this.schemeList = data
  }
  reinvest(scheme) {
    this.schemeDetails = scheme
    Object.assign(this.transactionSummary, { schemeName: scheme.schemeName });
    console.log('schemeDetails == ', this.schemeDetails)
  }
  selectExistingOrNew(value) {
    this.ExistingOrNew = value
  }
  getbankDetails(bank) {
    this.bankDetails = bank[0]
    console.log('bank details', bank)
  }
  onFolioChange(folio) {
    this.purchaseTransaction.controls.investmentAccountSelection.reset()
  }
  selectedScheme(scheme) {
    this.scheme = scheme
    Object.assign(this.transactionSummary, { schemeName: scheme.schemeName });
    this.navOfSelectedScheme = scheme.nav
    let obj1 = {
      mutualFundSchemeMasterId: scheme.mutualFundSchemeMasterId,
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      orderType: 'ORDER',
      userAccountType: this.getDataSummary.defaultCredential.accountType,
    }
    this.onlineTransact.getSchemeDetails(obj1).subscribe(
      data => this.getSchemeDetailsRes(data), (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }

  getSchemeDetailsRes(data) {
    this.showSpinner = false
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
    this.showSpinnerFolio = true
    let obj1 = {
      amcId: this.scheme.amcId,
      advisorId: this.getDataSummary.defaultClient.advisorId,
      familyMemberId: this.getDataSummary.defaultClient.familyMemberId,
      clientId: this.getDataSummary.defaultClient.clientId,
      userAccountType: this.getDataSummary.defaultCredential.accountType,
      holdingType: this.getDataSummary.defaultClient.holdingType,
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
    }
    this.onlineTransact.getFoliosAmcWise(obj1).subscribe(
      data => this.getFoliosAmcWiseRes(data), (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  // backToTransact(value,data){
  //   data = {
  //     formStep : 'step-2'
  //   }
  //   this.confirmTrasaction = true
  //   const fragmentData = {
  //     flag: 'addNsc',
  //     data:data,
  //     id: 1,
  //     state: 'open65',
  //     componentName: OnlineTrasactionComponent
  //   };
  //   const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
  //     sideBarData => {
  //       console.log('this is sidebardata in subs subs : ', sideBarData);
  //       if (UtilService.isDialogClose(sideBarData)) {
  //         if (UtilService.isRefreshRequired(sideBarData)) {
  //           console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);
  //         }
  //         rightSideDataSub.unsubscribe();
  //       }

  //     }
  //   );
  // }
  getFoliosAmcWiseRes(data) {
    this.showSpinnerFolio = false
    console.log('getFoliosAmcWiseRes', data)
    this.folioList = data
  }
  selectedFolio(folio) {
    this.folioDetails = folio
    Object.assign(this.transactionSummary, { folioNumber: folio.folioNumber });
    Object.assign(this.transactionSummary, { mutualFundId: folio.id });
    Object.assign(this.transactionSummary, { tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId });
    this.transactionSummary = { ...this.transactionSummary };
  }
  enteredAmount(value) {
    Object.assign(this.transactionSummary, { enteredAmount: value });
  }
  getDefaultDetails(data) {
    console.log('get defaul here yupeeee', data)
    this.getDataSummary = data
    Object.assign(this.transactionSummary, { aggregatorType: this.getDataSummary.defaultClient.aggregatorType });
    this.platformType = this.getDataSummary.defaultClient.aggregatorType
    //  this.purchaseTransaction.controls.investor.reset();
  }
  selectPaymentMode(value) {
    Object.assign(this.transactionSummary, { paymentMode: value });
    if (value == 2) {
      Object.assign(this.transactionSummary, { getAch: true });
      this.getNSEAchmandate()
    }
  }
  getNSEAchmandate() {
    this.showSpinnerMandate = true
    let obj1 = {
      tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId
    }
    this.onlineTransact.getNSEAchmandate(obj1).subscribe(
      data => this.getNSEAchmandateRes(data), (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  getNSEAchmandateRes(data) {
    this.showSpinnerMandate = false
    console.log('getNSEAchmandateRes', data)
    if (data.length > 1) {
      Object.assign(this.transactionSummary, { showUmrnEdit: true });
    }
    this.achMandateNSE = data[0]
    Object.assign(this.transactionSummary, { umrnNo: this.achMandateNSE.umrnNo });
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
      //  investor: [(!data) ? '' : data.investor, [Validators.required]],
      employeeContry: [(!data) ? '' : data.employeeContry, [Validators.required,]],
      investmentAccountSelection: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      modeOfPaymentSelection: ['1'],
      folioSelection: ['2'],
      selectInvestor: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      reinvest: [(!data) ? '' : data.reinvest, [Validators.required]],
      schemePurchase: [null, [Validators.required]],
    });

    this.ownerData = this.purchaseTransaction.controls;
  }

  getFormControl(): any {
    return this.purchaseTransaction.controls;
  }
  purchase() {
    if (this.purchaseTransaction.get('folioSelection').invalid) {
      this.purchaseTransaction.get('folioSelection').markAsTouched();
      return;
    } else if (this.purchaseTransaction.get('employeeContry').invalid) {
      this.purchaseTransaction.get('employeeContry').markAsTouched();
    } else if (this.reInvestmentOpt.length > 1) {
      if (this.purchaseTransaction.get('reinvest').invalid) {
        this.purchaseTransaction.get('reinvest').markAsTouched();
        return;
      }
    } else if (this.ExistingOrNew == 1 && this.purchaseTransaction.get('investmentAccountSelection').invalid) {
      this.purchaseTransaction.get('investmentAccountSelection').markAsTouched();
      return;
    } else {
      let obj = {
        productDbId: this.schemeDetails.id,
        mutualFundSchemeMasterId: this.scheme.mutualFundSchemeMasterId,
        productCode: this.schemeDetails.schemeCode,
        isin: this.schemeDetails.isin,
        folioNo: (this.folioDetails == undefined) ? null : this.folioDetails.folioNumber,
        tpUserCredentialId: this.getDataSummary.defaultClient.tpUserCredentialId,
        tpSubBrokerCredentialId: this.getDataSummary.euin.id,
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
        euin: this.getDataSummary.euin.euin,
        bseDPTransType: 'PHYSICAL',
        aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
        mandateId: null,
        nsePaymentMode: null,
        bankDetailId: null,
        childTransactions: []
      }
      if (this.getDataSummary.defaultClient.aggregatorType == 1) {
        obj.mandateId = (this.achMandateNSE == undefined) ? null : this.achMandateNSE.id
        obj.bankDetailId = this.bankDetails.id
        obj.nsePaymentMode = (this.purchaseTransaction.controls.modeOfPaymentSelection.value == 2) ? 'DEBIT_MANDATE' : 'ONLINE'
      }
      if (this.multiTransact == true) {
        console.log('new purchase obj', this.childTransactions)
        obj.childTransactions = this.childTransactions
      }
      console.log('new purchase obj', obj)
      this.barButtonOptions.active = true;
      this.onlineTransact.transactionBSE(obj).subscribe(
        data => this.purchaseRes(data), (error) => {
          this.eventService.showErrorMessage(error);
        }
      );
    }
  }
  purchaseRes(data) {
    this.barButtonOptions.active = false;
    console.log('purchase transaction ==', data)
    if (data == undefined) {

    } else {
      this.processTransaction.onAddTransaction('confirm', this.transactionSummary)
      Object.assign(this.transactionSummary, { allEdit: false });
    }
  }
  AddMultiTransaction() {
    if (this.purchaseTransaction.get('schemePurchase').invalid) {
      this.purchaseTransaction.get('schemePurchase').markAsTouched();
      return;
    } else if (this.ExistingOrNew == 1 && this.purchaseTransaction.get('investmentAccountSelection').invalid) {
      this.purchaseTransaction.get('investmentAccountSelection').markAsTouched();
      return;
    } else if (this.purchaseTransaction.get('employeeContry').invalid) {
      this.purchaseTransaction.get('employeeContry').markAsTouched();
      return;
    } else if (this.reInvestmentOpt.length > 1) {
      if (this.purchaseTransaction.get('reinvest').invalid) {
        this.purchaseTransaction.get('reinvest').markAsTouched();
        return;
      }
    } else {
      this.multiTransact = true
      if (this.scheme != undefined && this.schemeDetails != undefined) {
        let obj = {
          amc: (this.scheme) ? this.scheme.amcId : null,
          folioNo: (this.folioDetails == undefined) ? null : this.folioDetails.folioNumber,
          productCode: (this.schemeDetails) ? this.schemeDetails.schemeCode : null,
          dividendReinvestmentFlag: (this.schemeDetails) ? this.schemeDetails.dividendReinvestmentFlag : null,
          orderVal: this.purchaseTransaction.controls.employeeContry.value,
          bankDetailId: (this.bankDetails) ? this.bankDetails.id : null,
          schemeName: (this.scheme) ? this.scheme.schemeName : null,
          productDbId: (this.schemeDetails) ? this.schemeDetails.id : null,
        }
        this.childTransactions.push(obj)
        console.log(this.childTransactions)
        this.schemeList = [];
        this.purchaseTransaction.controls.reinvest.reset()
        this.purchaseTransaction.controls.employeeContry.reset()
        this.purchaseTransaction.controls.investmentAccountSelection.reset()
        this.purchaseTransaction.controls.schemePurchase.reset()
      }
    }
  }
}
export interface PeriodicElement {
  no: any;
  ownerName: string;
  folio: string
  amount: any
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    no: 1, folio: '758734587', ownerName: 'hdfc', amount: 52435

  },
  {
    no: 2, folio: '758734587', ownerName: 'axis', amount: 5256

  },
];