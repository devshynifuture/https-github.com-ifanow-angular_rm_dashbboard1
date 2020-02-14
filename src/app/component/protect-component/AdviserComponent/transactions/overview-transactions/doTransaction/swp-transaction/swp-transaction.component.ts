import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ConfirmationTransactionComponent } from '../confirmation-transaction/confirmation-transaction.component';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { OnlineTransactionService } from '../../../online-transaction.service';
import { ProcessTransactionService } from '../process-transaction.service';

@Component({
  selector: 'app-swp-transaction',
  templateUrl: './swp-transaction.component.html',
  styleUrls: ['./swp-transaction.component.scss']
})
export class SwpTransactionComponent implements OnInit {

  confirmTrasaction: boolean;
  dataSource: any;
  ownerData: any;
  swpTransaction: any;
  inputData: any;
  selectedFamilyMember: any;
  isViewInitCalled = false;
  transactionType: any;
  selectScheme = 2;
  maiSchemeList: any;
  schemeDetails: any;
  reInvestmentOpt: any;
  schemeList: any;
  showUnits = false;
  navOfSelectedScheme: any;
  transactionSummary: {};
  getDataSummary: any;
  swpFrequency: any;
  fre: any;
  frequency: any;
  dates: any;
  dateDisplay: any;
  folioDetails: any;
  scheme: any;
  folioList: any;
  schemeListTransfer: any;
  schemeTransfer: any;
  schemeDetailsTransfer: any;
  ExistingOrNew: any;

  constructor(private subInjectService: SubscriptionInject, private onlineTransact: OnlineTransactionService,
    private processTransaction: ProcessTransactionService, private fb: FormBuilder) { }
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
    this.transactionSummary ={}
    this.getdataForm(this.inputData)
    Object.assign(this.transactionSummary, { transactType: 'SWP' });
    Object.assign(this.transactionSummary, { allEdit: true });
    Object.assign(this.transactionSummary, {selectedFamilyMember: this.inputData.selectedFamilyMember});
  }
  getDefaultDetails(data) {
    console.log('get defaul here yupeeee', data)
    this.getDataSummary = data
  }
  getSchemeList(value) {

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
        holdingType: this.getDataSummary.defaultClient.holdingType,
        tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId,
      }
      this.onlineTransact.getExistingSchemes(obj).subscribe(
        data => this.getExistingSchemesRes(data)
      );
    } else {

    }
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
    this.getFrequency()
    this.getSchemeWiseFolios()
  }
  getExistingSchemesRes(data) {
    console.log('getExistingSchemesRes =', data)
    this.schemeList = data
  }
  selectedScheme(scheme) {
    this.scheme = scheme
    this.showUnits = true
    Object.assign(this.transactionSummary, {schemeName:  scheme.schemeName});
    this.transactionSummary = { schemeName: scheme.schemeName }
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
  getSchemeWiseFolios() {
    let obj1 = {
      mutualFundSchemeMasterId: this.scheme.mutualFundSchemeMasterId,
      advisorId: this.getDataSummary.defaultClient.advisorId,
      familyMemberId: this.getDataSummary.defaultClient.familyMemberId,
      clientId: this.getDataSummary.defaultClient.clientId,
      userAccountType: this.getDataSummary.defaultCredential.accountType,
      holdingType: this.getDataSummary.defaultClient.holdingType,
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
    }
    this.onlineTransact.getSchemeWiseFolios(obj1).subscribe(
      data => this.getSchemeWiseFoliosRes(data)
    );
  }
  getSchemeWiseFoliosRes(data) {
    console.log('res scheme folio', data)
    this.folioList = data
  }

  selectedFolio(folio) {
    this.folioDetails = folio
    this.showUnits = true
    Object.assign(this.transactionSummary, {folioNumber:  folio.folioNumber});
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
    this.swpFrequency = data
    this.swpFrequency = data.filter(function (element) {
      return element.sipFrequency
    })
  }
  selectedFrequency(getFrerq) {
    this.fre = getFrerq
    this.frequency = getFrerq.sipFrequency
    this.swpTransaction.controls["employeeContry"].setValidators([Validators.min(getFrerq.sipMinimumInstallmentAmount)])
    this.dateArray(getFrerq.sipDates)
  }
  dateArray(sipDates) {
    this.dates = sipDates.split(",")
    this.dateDisplay = this.processTransaction.getDateByArray(this.dates, true)
    this.dateDisplay = this.dateDisplay.filter(element => {
      return element.date > new Date()
    });
    console.log('dateDisplay = ', this.dateDisplay)
  }
  onAddTransaction(value, data) {
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
  getdataForm(data) {
    if (!data) {
      data = {};
    }
    if (this.dataSource) {
      data = this.dataSource;
    }
    this.swpTransaction = this.fb.group({
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
      date: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      frequency: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      installment: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
    });

    this.ownerData = this.swpTransaction.controls;
  }

  getFormControl(): any {
    return this.swpTransaction.controls;
  }
  swp() {
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
      startDate: Number(new Date(this.swpTransaction.controls.date.value.replace(/"/g, ""))),
      noOfInstallments: this.swpTransaction.controls.installment.value,
      frequencyType:this.frequency,
      schemeCd: this.schemeDetails.schemeCode,
      euin: this.getDataSummary.defaultCredential.euin,
      clientCode: this.getDataSummary.defaultClient.clientCode,
      orderVal: this.swpTransaction.controls.employeeContry.value,
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      orderType: "SWP",
      amountType: "Amount",
      bseDPTransType: "PHYSICAL",
    }
    this.onlineTransact.transactionBSE(obj).subscribe(
      data => this.swpBSERes(data)
    );
    console.log('swp json obj',obj)
  }
  swpBSERes(data){
    console.log('swp res == ',data)
    if(data == undefined){

    }else{
    this.onAddTransaction('confirm',null)
    }
  }
}
