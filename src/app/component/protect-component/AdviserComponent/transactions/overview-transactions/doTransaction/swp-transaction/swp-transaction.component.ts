import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ConfirmationTransactionComponent } from '../confirmation-transaction/confirmation-transaction.component';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { OnlineTransactionService } from '../../../online-transaction.service';
import { ProcessTransactionService } from '../process-transaction.service';
import { EventService } from 'src/app/Data-service/event.service';

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
  reInvestmentOpt = [];
  schemeList: any;
  showUnits = false;
  showSpinner = false;
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
  mandateDetails: any;
  bankDetails: any;
  achMandateNSE: any;
  showSpinnerFolio = false;
  currentValue: number;
  multiTransact = false;
  childTransactions = [];
  displayedColumns: string[] = ['no', 'folio', 'ownerName', 'amount'];
  constructor(private subInjectService: SubscriptionInject, private onlineTransact: OnlineTransactionService,
    private processTransaction: ProcessTransactionService, private fb: FormBuilder, private eventService: EventService) { }
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
    this.transactionSummary = {}
    this.childTransactions = []
    this.getdataForm(this.inputData)
    Object.assign(this.transactionSummary, { transactType: 'SWP' });
    Object.assign(this.transactionSummary, { allEdit: true });
    Object.assign(this.transactionSummary, { selectedFamilyMember: this.inputData.selectedFamilyMember });
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
        holdingType: this.getDataSummary.defaultClient.holdingType,
        tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId,
      }
      this.onlineTransact.getExistingSchemes(obj).subscribe(
        data => this.getExistingSchemesRes(data), (error) => {
          this.eventService.showErrorMessage(error);
        }
      );
    } else {

    }
  }
  getbankDetails(value) {
    this.bankDetails = value[0]
    console.log('bank details', value)
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
    if (this.getDataSummary.defaultClient.aggregatorType == 2) {
      this.getMandateDetails()
    }
    this.getSchemeWiseFolios()
  }
  reinvest(scheme) {
    this.schemeDetails = scheme
    Object.assign(this.transactionSummary, { schemeName: scheme.schemeName });
    console.log('schemeDetails == ', this.schemeDetails)
  }
  getExistingSchemesRes(data) {
    this.showSpinner = false
    console.log('getExistingSchemesRes =', data)
    this.schemeList = data
  }
  selectedScheme(scheme) {
    this.scheme = scheme
    this.showUnits = true
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
      data => this.getSchemeWiseFoliosRes(data), (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  getSchemeWiseFoliosRes(data) {
    console.log('res scheme folio', data)
    this.showSpinnerFolio = false
    this.folioList = data
  }
  enteredAmount(value) {
    Object.assign(this.transactionSummary, { enteredAmount: value });
  }
  onFolioChange(folio) {
    this.swpTransaction.controls.folioSelection.reset()
  }
  selectedFolio(folio) {
    this.folioDetails = folio
    this.currentValue = this.processTransaction.calculateCurrentValue(this.navOfSelectedScheme, folio.balanceUnit)
    this.showUnits = true
    Object.assign(this.transactionSummary, { folioNumber: folio.folioNumber });
    Object.assign(this.transactionSummary, { mutualFundId: folio.id });
    Object.assign(this.transactionSummary, { tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId });
    this.transactionSummary = { ...this.transactionSummary };
  }
  getFrequency() {
    let obj = {
      isin: this.schemeDetails.isin,
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      orderType: 'SWP'
    }
    this.onlineTransact.getSipFrequency(obj).subscribe(
      data => this.getSipFrequencyRes(data), (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  getSipFrequencyRes(data) {
    console.log('isin Frequency ----', data)
    this.swpFrequency = data
    this.swpFrequency = data.filter(function (element) {
      return element.frequency
    })
  }
  selectedFrequency(getFrerq) {
    this.fre = getFrerq
    this.frequency = getFrerq.frequency
    this.swpTransaction.controls["employeeContry"].setValidators([Validators.min(getFrerq.sipMinimumInstallmentAmount)])
    if (this.getDataSummary.defaultClient.aggregatorType == 1) {
      this.dateArray(getFrerq.swpDates)
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
      tenure: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      installment: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
    });

    this.ownerData = this.swpTransaction.controls;
  }
  getFormControl(): any {
    return this.swpTransaction.controls;
  }
  swp() {

    if (this.swpTransaction.get('investmentAccountSelection').invalid) {
      this.swpTransaction.get('investmentAccountSelection').markAsTouched();
    }else if (this.swpTransaction.get('date').invalid) {
      this.swpTransaction.get('date').markAsTouched();
      return;
    } else if (this.swpTransaction.get('frequency').invalid) {
      this.swpTransaction.get('frequency').markAsTouched();
      return;
    } else if (this.swpTransaction.get('employeeContry').invalid) {
      this.swpTransaction.get('employeeContry').markAsTouched();
      return;
    } else if (this.swpTransaction.get('installment').invalid) {
      this.swpTransaction.get('installment').markAsTouched();
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
        startDate: Number(new Date(this.swpTransaction.controls.date.value.replace(/"/g, ""))),
        noOfInstallments: this.swpTransaction.controls.installment.value,
        frequencyType: this.frequency,
        schemeCd: this.schemeDetails.schemeCode,
        euin: this.getDataSummary.euin.euin,
        clientCode: this.getDataSummary.defaultClient.clientCode,
        orderVal: this.swpTransaction.controls.employeeContry.value,
        aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
        orderType: "SWP",
        amountType: "Amount",
        bseDPTransType: "PHYSICAL",
        bankDetailId: null,
        nsePaymentMode: null,
        childTransactions: null,
      }
      if (this.getDataSummary.defaultClient.aggregatorType == 1) {
        obj.bankDetailId = this.bankDetails.id
        obj.nsePaymentMode = (this.swpTransaction.controls.modeOfPaymentSelection.value == 2) ? 'DEBIT_MANDATE' : 'ONLINE'
      }
      const tenure = this.swpTransaction.controls.tenure.value;
      const installment = this.swpTransaction.controls.installment.value;
      obj = this.processTransaction.checkInstallments(obj, tenure, installment)
      if (this.multiTransact == true) {
        console.log('new purchase obj', this.childTransactions)
        obj.childTransactions = this.childTransactions
      }
      console.log('swp json obj', obj)
      this.onlineTransact.transactionBSE(obj).subscribe(
        data => this.swpBSERes(data), (error) => {
          this.eventService.showErrorMessage(error);
        }
      );
    }

  }
  swpBSERes(data) {
    console.log('swp res == ', data)
    if (data == undefined) {

    } else {
      this.processTransaction.onAddTransaction('confirm', this.transactionSummary)
    }
  }
  AddMultiTransaction() {
    this.multiTransact = true
    let obj = {
      amc: this.scheme.amcId,
      folioNo: (this.folioDetails == undefined) ? null : this.folioDetails.folioNumber,
      productCode: this.schemeDetails.schemeCode,
      dividendReinvestmentFlag: this.schemeDetails.dividendReinvestmentFlag,
      orderVal: this.swpTransaction.controls.employeeContry.value,
      productDbId: this.schemeDetails.id,
      frequencyType: this.frequency,
      startDate: Number(new Date(this.swpTransaction.controls.date.value.replace(/"/g, ""))),
      schemeName: this.scheme.schemeName,
    }
    const tenure = this.swpTransaction.controls.tenure.value;
    const installment = this.swpTransaction.controls.installment.value;
    obj = this.processTransaction.checkInstallments(obj, tenure, installment)
    this.childTransactions.push(obj)
    console.log(this.childTransactions)
    this.schemeList = [];
    this.swpTransaction.controls.date.reset()
    this.swpTransaction.controls.employeeContry.reset()
    this.swpTransaction.controls.tenure.reset()
    this.swpTransaction.controls.frequency.reset()

    this.swpTransaction.controls.investmentAccountSelection.reset()
  }
}
