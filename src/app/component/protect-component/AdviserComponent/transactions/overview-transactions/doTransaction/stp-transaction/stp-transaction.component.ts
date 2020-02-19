import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ConfirmationTransactionComponent } from '../confirmation-transaction/confirmation-transaction.component';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { OnlineTransactionService } from '../../../online-transaction.service';
import { ProcessTransactionService } from '../process-transaction.service';
import { EventService } from 'src/app/Data-service/event.service';

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
  reInvestmentOpt = [];
  schemeList: any;
  navOfSelectedScheme: any;
  selectScheme = 2;
  getDataSummary: any;
  scheme: any;
  folioDetails: any;
  folioList: any;
  showSpinner = false;
  switchFrequency: any;
  fre: any;
  frequency: any;
  dates: any;
  dateDisplay: any;
  schemeListTransfer: any;
  schemeDetailsTransfer: any;
  schemeTransfer: any;
  achMandateNSE: any;
  mandateDetails: any;
  bankDetails: any;
  showSpinnerFolio = false;
  showSpinnerTrans = false;
  currentValue: number;
  multiTransact = false;
  childTransactions = [];
  displayedColumns: string[] = ['no', 'folio', 'ownerName', 'amount'];
  constructor(private subInjectService: SubscriptionInject, private onlineTransact: OnlineTransactionService,
    private processTransaction: ProcessTransactionService, private eventService: EventService,
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
    this.childTransactions = []
    this.transactionSummary = {}
    Object.assign(this.transactionSummary, { allEdit: true });
    Object.assign(this.transactionSummary, { transactType: 'STP' });
    Object.assign(this.transactionSummary, { selectedFamilyMember: this.inputData.selectedFamilyMember });
    Object.assign(this.transactionSummary, { tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId });
  }
  getDefaultDetails(data) {
    console.log('get defaul here yupeeee', data)
    this.getDataSummary = data
    Object.assign(this.transactionSummary, { aggregatorType: this.getDataSummary.defaultClient.aggregatorType });
    // this.stpTransaction.controls.investor.reset();

    this.stpTransaction.controls.transferIn.reset();
  }
  onFolioChange(folio) {
    this.stpTransaction.controls.folioSelection.reset()
  }
  getMandateDetails() {
    let obj1 = {
      advisorId: this.getDataSummary.defaultClient.advisorId,
      clientCode: this.getDataSummary.defaultClient.clientCode,
      tpUserCredentialId: this.getDataSummary.defaultClient.tpUserCredentialId,
    }
    this.onlineTransact.getMandateDetails(obj1).subscribe(
      data => this.getMandateDetailsRes(data), (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  getMandateDetailsRes(data) {
    console.log('mandate details :', data)
    this.mandateDetails = data
  }
  getSchemeListTranfer(value) {
    this.showSpinnerTrans = true
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
        schemeSequence: 2
      }
      this.onlineTransact.getNewSchemes(obj).subscribe(
        data => this.getNewSchemesRes(data), (error) => {
          this.eventService.showErrorMessage(error);
        }
      );
    }
  }
  getNewSchemesRes(data) {
    this.showSpinnerTrans = false
    console.log('new schemes', data)
    this.schemeListTransfer = data
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
        holdingType: this.getDataSummary.defaultClient.holdingType,
        tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId,
        schemeSequence: 1
      }
      this.onlineTransact.getExistingSchemes(obj).subscribe(
        data => this.getExistingSchemesRes(data), (error) => {
          this.eventService.showErrorMessage(error);
        }
      );
    } else {

    }
  }
  getExistingSchemesRes(data) {
    this.showSpinner = false
    this.schemeList = data
    console.log('data schemelist res', data)
  }

  selectedFolio(folio) {
    this.folioDetails = folio
    this.currentValue = this.processTransaction.calculateCurrentValue(this.navOfSelectedScheme, folio.balanceUnit)
    this.showUnits = true
    Object.assign(this.transactionSummary, { folioNumber: folio.folioNumber });
    Object.assign(this.transactionSummary, { mutualFundId: folio.id });
    this.transactionSummary = { ...this.transactionSummary };
  }
  selectedSchemeTransfer(schemeTransfer) {
    this.showSpinnerTrans = true
    this.schemeTransfer = schemeTransfer
    Object.assign(this.transactionSummary, { schemeNameTranfer: schemeTransfer.schemeName });
    this.navOfSelectedScheme = schemeTransfer.nav
    let obj1 = {
      mutualFundSchemeMasterId: schemeTransfer.mutualFundSchemeMasterId,
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      orderType: 'ORDER',
      userAccountType: this.getDataSummary.defaultCredential.accountType,
    }
    this.onlineTransact.getSchemeDetails(obj1).subscribe(
      data => this.getSchemeDetailsTranferRes(data), (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  getSchemeDetailsTranferRes(data) {
    // this.maiSchemeList = data
    this.showSpinnerTrans = false
    this.schemeDetailsTransfer = data[0]
    if (data.length > 1) {
      this.reInvestmentOpt = data
      console.log('reinvestment', this.reInvestmentOpt)
    } if (data.length == 1) {
      this.reInvestmentOpt = []
    }
    if (this.getDataSummary.defaultClient.aggregatorType == 2) {
      this.getMandateDetails()
    }
  }
  reinvest(scheme) {
    this.schemeDetails = scheme
    Object.assign(this.transactionSummary, { schemeName: scheme.schemeName });
    console.log('schemeDetails == ', this.schemeDetails)
  }
  selectedScheme(scheme) {
    this.scheme = scheme
    this.showUnits = true
    this.showSpinner = true
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
    this.schemeDetails.selectedFamilyMember = this.selectedFamilyMember;
    this.getSchemeWiseFolios()
    this.getFrequency()
  }
  getSchemeWiseFolios() {
    this.showSpinnerFolio = true
    let obj1 = {
      mutualFundSchemeMasterId: this.scheme.mutualFundSchemeMasterId,
      advisorId: this.getDataSummary.defaultClient.advisorId,
      familyMemberId: this.getDataSummary.defaultClient.familyMemberId,
      clientId: this.getDataSummary.defaultClient.clientId,
      userAccountType: this.getDataSummary.defaultCredential.accountType,
      holdingType: this.getDataSummary.defaultClient.holdingType,
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      showOnlyNonZero: true,
    }
    this.onlineTransact.getSchemeWiseFolios(obj1).subscribe(
      data => this.getSchemeWiseFoliosRes(data)
    );
  }
  getSchemeWiseFoliosRes(data) {
    this.showSpinnerFolio = false
    console.log('res scheme folio', data)
    this.folioList = data
  }
  getFrequency() {
    let obj = {
      isin: this.schemeDetails.isin,
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      orderType: 'STP'
    }
    this.onlineTransact.getSipFrequency(obj).subscribe(
      data => this.getSipFrequencyRes(data), (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  getSipFrequencyRes(data) {
    console.log('isin Frequency ----', data)
    this.switchFrequency = data
    this.switchFrequency = data.filter(function (element) {
      return element.frequency
    })
  }
  selectedFrequency(getFrerq) {
    this.fre = getFrerq
    this.frequency = getFrerq.frequency
    this.stpTransaction.controls["employeeContry"].setValidators([Validators.min(getFrerq.sipMinimumInstallmentAmount)])
    if (this.getDataSummary.defaultClient.aggregatorType == 1) {
      this.dateArray(getFrerq.stpDates)
    } else {
      this.dateArray(getFrerq.sipDates)
    }

  }
  dateArray(sipDates) {
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 7);

    this.dates = sipDates.split(",")
    this.dateDisplay = this.processTransaction.getDateByArray(this.dates, true)
    this.dateDisplay = this.dateDisplay.filter(element => {
      return element.date > currentDate
    });
    console.log('dateDisplay = ', this.dateDisplay)
  }
  onAddTransaction(value, data) {
    Object.assign(this.transactionSummary, { allEdit: false });
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
  enteredAmount(value) {
    Object.assign(this.transactionSummary, { enteredAmount: value });
  }
  getbankDetails(value) {
    this.bankDetails = value[0]
    console.log('bank details', value)
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
      //investor: [(!data) ? '' : data.investor, [Validators.required]],
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
    if (this.stpTransaction.get('employeeContry').invalid) {
      this.stpTransaction.get('employeeContry').markAsTouched();
      return;
    } else if (this.stpTransaction.get('frequency').invalid) {
      this.stpTransaction.get('frequency').markAsTouched();
      return;
    } else if (this.stpTransaction.get('date').invalid) {
      this.stpTransaction.get('date').markAsTouched();
      return;
    } else if (this.stpTransaction.get('installment').invalid) {
      this.stpTransaction.get('installment').markAsTouched();
      return;
    } else if (this.stpTransaction.get('tenure').invalid) {
      this.stpTransaction.get('tenure').markAsTouched();
      return;
    } else {
      let obj = {

        productDbId: this.schemeDetails.id,
        toProductDbId: this.schemeDetailsTransfer.id,
        mutualFundSchemeMasterId: this.scheme.mutualFundSchemeMasterId,
        toMutualFundSchemeMasterId: this.schemeTransfer.mutualFundSchemeMasterId,
        productCode: this.schemeDetails.schemeCode,
        isin: this.schemeDetails.isin,
        folioNo: (this.folioDetails == undefined) ? null : this.folioDetails.folioNumber,
        tpUserCredentialId: this.getDataSummary.defaultClient.tpUserCredentialId,
        tpSubBrokerCredentialId: this.getDataSummary.euin.id,
        familyMemberId: this.getDataSummary.defaultClient.familyMemberId,
        adminAdvisorId: this.getDataSummary.defaultClient.advisorId,
        clientId: this.getDataSummary.defaultClient.clientId,
        startDate: Number(new Date(this.stpTransaction.controls.date.value.replace(/"/g, ""))),
        toIsin: this.schemeDetailsTransfer.isin,
        schemeCd: this.schemeDetails.schemeCode,
        euin: this.getDataSummary.euin.euin,
        orderType: "STP",
        buySell: "PURCHASE",
        transCode: "NEW",
        buySellType: "FRESH",
        dividendReinvestmentFlag: this.schemeDetails.dividendReinvestmentFlag,
        amountType: "Amount",
        noOfInstallments: this.stpTransaction.controls.installment.value,
        frequencyType: this.frequency,
        clientCode: this.getDataSummary.defaultClient.clientCode,
        orderVal: this.stpTransaction.controls.employeeContry.value,
        bseDPTransType: "PHYSICAL",
        aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
        mandateId: null,
        bankDetailId: null,
        nsePaymentMode: null,
        childTransactions: []
      }
      if (this.getDataSummary.defaultClient.aggregatorType == 1) {
        obj.mandateId = (this.achMandateNSE == undefined) ? null : this.achMandateNSE.id
        obj.bankDetailId = this.bankDetails.id
        obj.nsePaymentMode = (this.stpTransaction.controls.modeOfPaymentSelection.value == 2) ? 'DEBIT_MANDATE' : 'ONLINE'
      }
      obj = this.processTransaction.checkInstallments(obj)
      console.log('json stp', obj)
      if (this.multiTransact == true) {
        console.log('new purchase obj', this.childTransactions)
        obj.childTransactions = this.childTransactions
      }
      this.onlineTransact.transactionBSE(obj).subscribe(
        data => this.stpBSERes(data), (error) => {
          this.eventService.showErrorMessage(error);
        }
      );
    }
  }
  stpBSERes(data) {
    console.log('stp res == ', data)
    if (data == undefined) {

    } else {
      this.onAddTransaction('confirm', this.transactionSummary)
    }
  }
  AddMultiTransaction() {
    this.multiTransact = true

    let obj = {
      amc: this.scheme.amcId,
      folioNo: (this.folioDetails == undefined) ? null : this.folioDetails.folioNumber,
      productCode: this.schemeDetails.schemeCode,
      dividendReinvestmentFlag: this.schemeDetails.dividendReinvestmentFlag,
      orderVal: this.stpTransaction.controls.employeeContry.value,
      bankDetailId: this.bankDetails.id,
      toIsin: this.schemeDetailsTransfer.isin,
      schemeName: this.scheme.schemeName,
      mandateId: this.achMandateNSE.id,
      productDbId: this.schemeDetails.id,
      frequencyType: this.frequency,
      startDate: Number(new Date(this.stpTransaction.controls.date.value.replace(/"/g, ""))),
    }
    obj = this.processTransaction.checkInstallments(obj)
    this.childTransactions.push(obj)
    console.log(this.childTransactions)
    this.schemeList = [];
    this.stpTransaction.controls.frequency.reset()
    this.stpTransaction.controls.date.reset()
    this.stpTransaction.controls.installment.reset()
    this.stpTransaction.controls.employeeContry.reset()
    this.stpTransaction.controls.investmentAccountSelection.reset()
  }
}
