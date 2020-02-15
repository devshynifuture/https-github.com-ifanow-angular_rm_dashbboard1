import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { ConfirmationTransactionComponent } from '../confirmation-transaction/confirmation-transaction.component';
import { UtilService } from 'src/app/services/util.service';
import { OnlineTransactionService } from '../../../online-transaction.service';

@Component({
  selector: 'app-switch-transaction',
  templateUrl: './switch-transaction.component.html',
  styleUrls: ['./switch-transaction.component.scss']
})
export class SwitchTransactionComponent implements OnInit {
  confirmTrasaction: boolean;
  switchTransaction: any;
  dataSource: any;
  ownerData: any;
  selectedFamilyMember: any;
  inputData: any;
  isViewInitCalled=false;
  transactionType: any;
  selectScheme=2;
  navOfSelectedScheme: any;
  transactionSummary: {};
  schemeDetails: any;
  maiSchemeList: any;
  reInvestmentOpt=[];
  schemeList: any;
  showUnits = false;
  getDataSummary: any;
  showSpinner = false;
  scheme: any;
  folioList: any;
  folioDetails: any;
  schemeTransfer: any;
  schemeDetailsTransfer: any;
  schemeListTransfer: any;

  constructor(private subInjectService: SubscriptionInject,private onlineTransact: OnlineTransactionService,
    private fb: FormBuilder) { }
    @Input()
    set data(data) {
      this.inputData = data;
      this.transactionType =  data.transactionType
      this.selectedFamilyMember = data.selectedFamilyMember
      console.log('This is Input data of FixedDepositComponent ', data);
  
      if (this.isViewInitCalled) {
        this.getdataForm('');
      }
    }
  
    get data() {
      return this.inputData;
    }
  
  ngOnInit() {
    this.transactionSummary = {}
    this.getdataForm(this.inputData)
    Object.assign(this.transactionSummary, { transactType: 'SWITCH' });
    Object.assign(this.transactionSummary, { allEdit: true });
    Object.assign(this.transactionSummary, {selectedFamilyMember:  this.inputData.selectedFamilyMember});
  }
  getDefaultDetails(data) {
    console.log('get defaul here yupeeee', data)
    this.getDataSummary = data
  }
  getSchemeList(value) {
    this.showSpinner = true
    if (this.selectScheme == 2 && value.length > 2) {
      let obj = {
        searchQuery: value,
        bseOrderType: 'ORDER',
        aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
        advisorId: 414,
        tpUserCredentialId: this.getDataSummary.defaultClient.tpUserCredentialId,
        familyMemberId: this.getDataSummary.defaultClient.familyMemberId,
        clientId: this.getDataSummary.defaultClient.clientId,
        userAccountType: this.getDataSummary.defaultCredential.accountType,
        holdingType:this.getDataSummary.defaultClient.holdingType,
        tpUserCredFamilyMappingId:this.getDataSummary.defaultClient.tpUserCredFamilyMappingId,
      }
      this.onlineTransact.getExistingSchemes(obj).subscribe(
        data => this.getExistingSchemesRes(data)
      );
    } else {

    }
  }
  getExistingSchemesRes(data) {
    this.showSpinner = false
    this.schemeList = data
  }
  selectedFolio(folio) {
    this.folioDetails = folio
    this.showUnits = true
    Object.assign(this.transactionSummary, {folioNumber:  folio.folioNumber});
  }
  selectedScheme(scheme) {
    this.scheme = scheme
    this.showUnits = true
    Object.assign(this.transactionSummary, {schemeName:  scheme.schemeName});
    this.navOfSelectedScheme = scheme.nav
    let obj1 = {
      mutualFundSchemeMasterId: scheme.mutualFundSchemeMasterId,
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      orderType: 'ORDER',
      userAccountType: this.getDataSummary.defaultCredential.accountType,
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
    this.getSchemeWiseFolios()
  }
  reinvest(scheme) {
    this.schemeDetails = scheme
    Object.assign(this.transactionSummary, { schemeName: scheme.schemeName });
    console.log('schemeDetails == ', this.schemeDetails)
  }
  getSchemeWiseFolios() {
    let obj1 = {
      mutualFundSchemeMasterId: this.scheme.mutualFundSchemeMasterId,
      advisorId:  this.getDataSummary.defaultClient.advisorId,
      familyMemberId:  this.getDataSummary.defaultClient.familyMemberId,
      clientId:  this.getDataSummary.defaultClient.clientId,
      userAccountType: this.getDataSummary.defaultCredential.accountType,
      holdingType:this.getDataSummary.defaultClient.holdingType,
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
    }
    this.onlineTransact.getSchemeWiseFolios(obj1).subscribe(
      data => this.getSchemeWiseFoliosRes(data)
    );
  }
  getSchemeWiseFoliosRes(data) {
    console.log('res scheme folio',data)
    this.folioList = data
  }
 
  onAddTransaction(value,data){
    Object.assign(this.transactionSummary, {allEdit: false});
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
  selectedSchemeTransfer(schemeTransfer){
    this.schemeTransfer = schemeTransfer
    Object.assign(this.transactionSummary, {schemeNameTranfer: schemeTransfer.schemeName});
    this.navOfSelectedScheme = schemeTransfer.nav
    let obj1 = {
      mutualFundSchemeMasterId: schemeTransfer.mutualFundSchemeMasterId,
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      orderType: 'ORDER',
      userAccountType: this.getDataSummary.defaultCredential.accountType,
    }
    this.onlineTransact.getSchemeDetails(obj1).subscribe(
      data => this.getSchemeDetailsTranferRes(data)
    );
  }
  getSchemeDetailsTranferRes(data){
    // this.maiSchemeList = data
    this.schemeDetailsTransfer = data[0]
  }
  getSchemeListTranfer(value){
    this.showSpinner = true
    if (this.selectScheme == 2 && value.length > 2) {
      let obj = {
        searchQuery: value,
        bseOrderType: 'ORDER',
        aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
        advisorId: 414,
        tpUserCredentialId: this.getDataSummary.defaultClient.tpUserCredentialId,
        familyMemberId: this.getDataSummary.defaultClient.familyMemberId,
        clientId: this.getDataSummary.defaultClient.clientId,
        userAccountType: this.getDataSummary.defaultCredential.accountType,
        holdingType:this.getDataSummary.defaultClient.holdingType,
        tpUserCredFamilyMappingId:this.getDataSummary.defaultClient.tpUserCredFamilyMappingId,
      }
      this.onlineTransact.getNewSchemes(obj).subscribe(
        data => this.getNewSchemesRes(data)
      );
    } 
  }
  switchType(value){

  }
  enteredAmount(value) {
    Object.assign(this.transactionSummary, { enteredAmount: value });
  }
  getNewSchemesRes(data){
    this.showSpinner = false
    console.log('new schemes', data)
    this.schemeListTransfer = data
  }
  getdataForm(data) {
    if (!data) {
      data = {};
    }
    if (this.dataSource) {
      data = this.dataSource;
    }
    this.switchTransaction = this.fb.group({
      ownerName: [(!data) ? '' : data.ownerName, [Validators.required]],
      transactionType: [(!data) ? '' : data.transactionType, [Validators.required]],
      bankAccountSelection: [(!data) ? '' : data.bankAccountSelection, [Validators.required]],
      schemeSelection: [(!data) ? '' : data.schemeSelection, [Validators.required]],
      investor: [(!data) ? '' : data.investor, [Validators.required]],
      employeeContry: [(!data) ? '' : data.employeeContry, [Validators.required]],
      investmentAccountSelection: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      modeOfPaymentSelection: [(!data) ? '' : data.modeOfPaymentSelection, [Validators.required]],
      folioSelection: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      selectInvestor: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      installment:[(!data) ? '' : data.employeeContry, [Validators.required]],
      tenure:[(!data) ? '' : data.employeeContry, [Validators.required]],
      transferIn:[(!data) ? '' : data.employeeContry, [Validators.required]],
      switchType:[(!data) ? '' : data.employeeContry, [Validators.required]],
    });

    this.ownerData = this.switchTransaction.controls;
  }

  getFormControl(): any {
    return this.switchTransaction.controls;
  }
  switch(){

    let obj = {

      productDbId: this.schemeDetails.id,
      toProductDbId:this.schemeDetailsTransfer.id,
      mutualFundSchemeMasterId: this.scheme.mutualFundSchemeMasterId,
      toMutualFundSchemeMasterId:this.schemeTransfer.mutualFundSchemeMasterId,
      productCode: this.schemeDetails.schemeCode,
      isin: this.schemeDetails.isin,
      folioNo: (this.folioDetails == undefined) ? null : this.folioDetails.folioNumber,
      tpUserCredentialId: this.getDataSummary.defaultClient.tpUserCredentialId,
      tpSubBrokerCredentialId: this.getDataSummary.defaultCredential.tpSubBrokerCredentialId,
      familyMemberId: this.getDataSummary.defaultClient.familyMemberId,
      adminAdvisorId: this.getDataSummary.defaultClient.advisorId,
      clientId: this.getDataSummary.defaultClient.clientId,
      toIsin: this.schemeDetailsTransfer.isin,
      schemeCd: this.schemeDetails.schemeCode,
      euin: this.getDataSummary.defaultCredential.euin,
      qty: (this.switchTransaction.controls.switchType.value == 1) ? 0 : (this.switchTransaction.controls.switchType.value == 3) ? this.schemeDetails.balance_units : this.switchTransaction.controls.employeeContry.value,
      allRedeem: (this.switchTransaction.controls.switchType.value == 3) ? true : false,
      orderType: "SWITCH",
      buySell: "SWITCH_OUT",
      transCode: "NEW",
      buySellType: "FRESH",
      amountType: (this.switchTransaction.controls.redeemType.value == 1) ? 'Amount' : 'Unit',
      dividendReinvestmentFlag: this.schemeDetails.dividendReinvestmentFlag,
      clientCode: this.getDataSummary.defaultClient.clientCode,
      orderVal: this.switchTransaction.controls.employeeContry.value,
      bseDPTransType: "PHYSICAL",
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType
    }
    console.log('switch', obj)
    this.onlineTransact.transactionBSE(obj).subscribe(
      data => this.switchBSERes(data)
    );
  }
  switchBSERes(data){
    console.log('switch res == ',data)
    if(data == undefined){

    }else{
    this.onAddTransaction('confirm',this.transactionSummary)
    }
  }
}
