import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ConfirmationTransactionComponent } from '../confirmation-transaction/confirmation-transaction.component';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { OnlineTransactionService } from '../../../online-transaction.service';
import { ProcessTransactionService } from '../process-transaction.service';

@Component({
  selector: 'app-stp-transaction',
  templateUrl: './stp-transaction.component.html',
  styleUrls: ['./stp-transaction.component.scss']
})
export class StpTransactionComponent implements OnInit {

  confirmTrasaction: boolean;
  dataSource: any;
  ownerData: any;
  stpTransaction: any;
  inputData: any;
  selectedFamilyMember: any;
  isViewInitCalled = false;
  transactionType: any;
  maiSchemeList: any;
  schemeDetails: any;
  transactionSummary: {};
  showUnits = false;
  reInvestmentOpt =[];
  schemeList: any;
  navOfSelectedScheme: any;
  selectScheme = 2;
  getDataSummary: any;
  scheme: any;
  folioDetails: any;
  folioList: any;
  switchFrequency: any;
  fre: any;
  frequency: any;
  dates: any;
  dateDisplay: any;
  schemeListTransfer: any;
  schemeDetailsTransfer: any;
  schemeTransfer: any;

  constructor(private subInjectService: SubscriptionInject, private onlineTransact: OnlineTransactionService,
    private processTransaction: ProcessTransactionService,
    private fb: FormBuilder) { }
  @Input()
  set data(data) {
    this.inputData = data;
    this.transactionType = data.transactionType
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
    this.getdataForm(this.inputData)
    this.transactionSummary = { selectedFamilyMember: this.inputData.selectedFamilyMember }
  }
  getDefaultDetails(data) {
    console.log('get defaul here yupeeee', data)
    this.getDataSummary = data
  }
  getSchemeListTranfer(value){
    if (this.selectScheme == 2 && value.length > 2) {
      let obj = {
        searchQuery: value,
        bseOrderType: 'ORDER',
        aggregatorType: 2,
        advisorId: 414,
        tpUserCredentialId: this.getDataSummary.defaultClient.tpUserCredentialId,
      }
      this.onlineTransact.getNewSchemes(obj).subscribe(
        data => this.getNewSchemesRes(data)
      );
    } 
  }
  getNewSchemesRes(data){
    console.log('new schemes', data)
    this.schemeListTransfer = data
  }
  getSchemeList(value) {

    if (this.selectScheme == 2 && value.length > 2) {
      let obj = {
        searchQuery: value,
        bseOrderType: 'ORDER',
        aggregatorType: 2,
        advisorId: 414,
        tpUserCredentialId: this.getDataSummary.defaultClient.tpUserCredentialId,
      }
      this.onlineTransact.getExistingSchemes(obj).subscribe(
        data => this.getExistingSchemesRes(data)
      );
    } else {

    }
  }
  getExistingSchemesRes(data) {
    this.schemeList = data
    console.log('data schemelist res',data)
  }
 
  selectedFolio(folio) {
    this.folioDetails = folio
    this.showUnits = true
    this.transactionSummary = { folioNumber: folio.folioNumber }
  }
  selectedSchemeTransfer(schemeTransfer){
    this.schemeTransfer = schemeTransfer
    this.transactionSummary = { schemeNameTranfer: schemeTransfer.schemeName }
    this.navOfSelectedScheme = schemeTransfer.nav
    let obj1 = {
      mutualFundSchemeMasterId: schemeTransfer.mutualFundSchemeMasterId,
      aggregatorType: 2,
      orderType: 'ORDER',
      userAccountType: 1,
    }
    this.onlineTransact.getSchemeDetails(obj1).subscribe(
      data => this.getSchemeDetailsTranferRes(data)
    );
  }
  getSchemeDetailsTranferRes(data){
    // this.maiSchemeList = data
    this.schemeDetailsTransfer = data[0]
  }
  selectedScheme(scheme) {
    this.scheme = scheme
    this.showUnits = true
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
    this.getSchemeWiseFolios()
    this.getFrequency()
  }
  reinvest(scheme) {
    this.schemeDetails = scheme
    this.transactionSummary = {
      schemeName: scheme.schemeName
    }
    console.log('schemeDetails == ', this.schemeDetails)
  }
  getSchemeWiseFolios() {
    let obj1 = {
      mutualFundSchemeMasterId: this.scheme.mutualFundSchemeMasterId,
      advisorId: this.getDataSummary.defaultClient.advisorId,
      familyMemberId: this.getDataSummary.defaultClient.familyMemberId,
      clientId: this.getDataSummary.defaultClient.clientId
    }
    this.onlineTransact.getSchemeWiseFolios(obj1).subscribe(
      data => this.getSchemeWiseFoliosRes(data)
    );
  }
  getSchemeWiseFoliosRes(data) {
    console.log('res scheme folio', data)
    this.folioList = data
  }
  getFrequency() {
    let obj = {
      isin: this.schemeDetails.isin,
    }
    this.onlineTransact.getSipFrequency(obj).subscribe(
      data => this.getSipFrequencyRes(data)
    );
  }
  getSipFrequencyRes(data) {
    console.log('isin ----', data)
    this.switchFrequency = data
    this.switchFrequency = data.filter(function (element) {
      return element.sipFrequency
    })
  }
  selectedFrequency(getFrerq) {
    this.fre = getFrerq
    this.frequency = getFrerq.sipFrequency
    this.stpTransaction.controls["employeeContry"].setValidators([Validators.min(getFrerq.sipMinimumInstallmentAmount)])
    this.dateArray(getFrerq.sipDates)
  }
  dateArray(sipDates) {
    this.dates = sipDates.split(",")
    // this.dateDisplay = this.processTransaction.getDateByArray(this.dates, true)
    this.dateDisplay = this.processTransaction.getDateByArray(this.dates, true)
    console.log('dateDisplay = ', this.dateDisplay)
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
  stpType(value) {

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
    this.stpTransaction = this.fb.group({
      ownerName: [(!data) ? '' : data.ownerName, [Validators.required]],
      transactionType: [(!data) ? '' : data.transactionType, [Validators.required]],
      bankAccountSelection: [(!data) ? '' : data.bankAccountSelection, [Validators.required]],
      schemeSelection: [(!data) ? '' : data.schemeSelection, [Validators.required]],
      investor: [(!data) ? '' : data.investor, [Validators.required]],
      employeeContry: [(!data) ? '' : data.employeeContry, [Validators.required]],
      frequency: [(!data) ? '' : data.employeeContry, [Validators.required]],
      investmentAccountSelection: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      modeOfPaymentSelection: [(!data) ? '' : data.modeOfPaymentSelection, [Validators.required]],
      folioSelection: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      selectInvestor: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      date: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      tenure: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      installment: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      STPType: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      transferIn: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
    });

    this.ownerData = this.stpTransaction.controls;
  }

  getFormControl(): any {
    return this.stpTransaction.controls;
  }
  stp() {
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
      startDate: Number(new Date(this.stpTransaction.controls.date.value.replace(/"/g, ""))),
      toIsin: this.schemeDetailsTransfer.isin,
      schemeCd: this.schemeDetails.schemeCode,
      euin: this.getDataSummary.defaultCredential.euin,
      orderType: "STP",
      buySell: "PURCHASE",
      transCode: "NEW",
      buySellType: "FRESH",
      dividendReinvestmentFlag: this.schemeDetails.dividendReinvestmentFlag,
      amountType: "Amount",
      noOfInstallments: this.stpTransaction.controls.installment.value,
      frequencyType: "MONTHLY",
      clientCode: this.getDataSummary.defaultClient.clientCode,
      orderVal: this.stpTransaction.controls.employeeContry.value,
      bseDPTransType: "PHYSICAL",
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType
    }
    console.log('json stp',obj)
    this.onlineTransact.transactionBSE(obj).subscribe(
      data => this.stpBSERes(data)
    );
  }
  stpBSERes(data){
    console.log('stp res == ',data)
    if(data == undefined){

    }else{
    this.onAddTransaction('confirm',null)
    }
  }
}
