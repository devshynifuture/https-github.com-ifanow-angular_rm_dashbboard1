import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {SubscriptionInject} from '../../../../Subscriptions/subscription-inject.service';
import {OnlineTransactionService} from '../../../online-transaction.service';
import {ProcessTransactionService} from '../process-transaction.service';
import {EventService} from 'src/app/Data-service/event.service';
import {MatProgressButtonOptions} from 'src/app/common/progress-button/progress-button.component';
import {UtilService, ValidatorType} from '../../../../../../../services/util.service';

@Component({
  selector: 'app-stp-transaction',
  templateUrl: './stp-transaction.component.html',
  styleUrls: ['./stp-transaction.component.scss']
})
export class StpTransactionComponent implements OnInit {
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
  };
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
  validatorType = ValidatorType;

  constructor(private subInjectService: SubscriptionInject, private onlineTransact: OnlineTransactionService,
              private processTransaction: ProcessTransactionService, private eventService: EventService,
              private fb: FormBuilder) {
  }

  @Output() changedValue = new EventEmitter();

  @Input()
  set data(data) {
    this.inputData = data;
    this.transactionType = data.transactionType;
    this.selectedFamilyMember = data.selectedFamilyMember;
    console.log('This is Input data of FixedDepositComponent ', data);

    if (this.isViewInitCalled) {
      this.getdataForm('');
    }
  }

  get data() {
    return this.inputData;
  }

  ngOnInit() {
    this.getdataForm(this.inputData);
    this.childTransactions = [];
    this.transactionSummary = {};
    Object.assign(this.transactionSummary, {familyMemberId: this.inputData.familyMemberId});
    Object.assign(this.transactionSummary, {clientId: this.inputData.clientId});
    Object.assign(this.transactionSummary, {allEdit: true});
    Object.assign(this.transactionSummary, {transactType: 'STP'});
    Object.assign(this.transactionSummary, {selectedFamilyMember: this.inputData.selectedFamilyMember});
    Object.assign(this.transactionSummary, {isMultiTransact: false});
  }

  backToTransact() {
    this.changedValue.emit('step-2');
  }

  getDefaultDetails(data) {
    console.log('get defaul here yupeeee', data);
    this.getDataSummary = data;
    Object.assign(this.transactionSummary, {aggregatorType: this.getDataSummary.defaultClient.aggregatorType});
    Object.assign(this.transactionSummary, {tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId});
    // this.stpTransaction.controls.investor.reset();

    this.stpTransaction.controls.transferIn.reset();
  }

  onFolioChange(folio) {
    this.stpTransaction.controls.folioSelection.reset();
  }

  getMandateDetails() {
    const obj1 = {
      advisorId: this.getDataSummary.defaultClient.advisorId,
      clientCode: this.getDataSummary.defaultClient.clientCode,
      tpUserCredentialId: this.getDataSummary.defaultClient.tpUserCredentialId,
    };
    this.onlineTransact.getMandateDetails(obj1).subscribe(
      data => this.getMandateDetailsRes(data), (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }

  getMandateDetailsRes(data) {
    console.log('mandate details :', data);
    this.mandateDetails = data;
  }

  getSchemeListTranfer(value) {
    this.getNewSchemesRes([]);
    if (this.stpTransaction.get('transferIn').invalid) {
      this.showSpinnerTrans = false;
      Object.assign(this.transactionSummary, {schemeNameTranfer: ''});
    }
    if (this.selectScheme == 2 && value.length > 2) {
      this.showSpinnerTrans = true;
      const obj = {
        searchQuery: value,
        bseOrderType: 'STP',
        showOnlyNonZero: true,
        aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
        advisorId: this.getDataSummary.defaultClient.advisorId,
        tpUserCredentialId: this.getDataSummary.defaultClient.tpUserCredentialId,
        familyMemberId: this.getDataSummary.defaultClient.familyMemberId,
        clientId: this.getDataSummary.defaultClient.clientId,
        userAccountType: this.getDataSummary.defaultCredential.accountType,
        holdingType: this.getDataSummary.defaultClient.holdingType,
        tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId,
        schemeSequence: 2
      };
      this.onlineTransact.getNewSchemes(obj).subscribe(
        data => this.getNewSchemesRes(data), (error) => {
          this.showSpinnerTrans = false;
          this.stpTransaction.get('transferIn').setErrors({setValue: error.message});
          this.stpTransaction.get('transferIn').markAsTouched();
          // this.eventService.showErrorMessage(error);
        }
      );
    }
  }

  getNewSchemesRes(data) {
    this.showSpinnerTrans = false;
    console.log('new schemes', data);
    this.schemeListTransfer = data;
  }

  getSchemeList(value) {
    this.getExistingSchemesRes([]);
    if (this.stpTransaction.get('schemeStp').invalid) {
      this.showSpinner = false;
      Object.assign(this.transactionSummary, {schemeName: ''});
      Object.assign(this.transactionSummary, {folioNumber: ''});
      (this.schemeDetails) ? (this.schemeDetails.minimumPurchaseAmount = 0) : 0; // if scheme not present then min amt is 0
    }
    if (this.selectScheme == 2 && value.length > 2) {
      this.showSpinner = true;
      const obj = {
        searchQuery: value,
        bseOrderType: 'STP',
        showOnlyNonZero: true,
        aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
        advisorId: this.getDataSummary.defaultClient.advisorId,
        tpUserCredentialId: this.getDataSummary.defaultClient.tpUserCredentialId,
        familyMemberId: this.getDataSummary.defaultClient.familyMemberId,
        clientId: this.getDataSummary.defaultClient.clientId,
        userAccountType: this.getDataSummary.defaultCredential.accountType,
        holdingType: this.getDataSummary.defaultClient.holdingType,
        tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId,
        schemeSequence: 1
      };
      this.onlineTransact.getExistingSchemes(obj).subscribe(
        data => this.getExistingSchemesRes(data), (error) => {
          this.showSpinner = false;
          this.stpTransaction.get('schemeStp').setErrors({setValue: error.message});
          this.stpTransaction.get('schemeStp').markAsTouched();
          (this.schemeDetails) ? (this.schemeDetails.minimumPurchaseAmount = 0) : 0;
          // this.eventService.showErrorMessage(error);
        }
      );
    } else {

    }
  }

  getExistingSchemesRes(data) {
    this.showSpinner = false;
    this.schemeList = data;
    console.log('data schemelist res', data);
  }

  selectedFolio(folio) {
    this.folioDetails = folio;
    this.currentValue = this.processTransaction.calculateCurrentValue(this.navOfSelectedScheme, folio.balanceUnit);
    this.showUnits = true;
    Object.assign(this.transactionSummary, {folioNumber: folio.folioNumber});
    Object.assign(this.transactionSummary, {mutualFundId: folio.id});
    this.transactionSummary = {...this.transactionSummary};
  }

  selectedSchemeTransfer(schemeTransfer) {
    this.showSpinnerTrans = true;
    this.schemeTransfer = schemeTransfer;
    Object.assign(this.transactionSummary, {schemeNameTranfer: schemeTransfer.schemeName});
    this.navOfSelectedScheme = schemeTransfer.nav;
    const obj1 = {
      mutualFundSchemeMasterId: schemeTransfer.mutualFundSchemeMasterId,
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      orderType: 'STP',
      userAccountType: this.getDataSummary.defaultCredential.accountType,
    };
    this.onlineTransact.getSchemeDetails(obj1).subscribe(
      data => this.getSchemeDetailsTranferRes(data), (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }

  getSchemeDetailsTranferRes(data) {
    // this.maiSchemeList = data
    this.showSpinnerTrans = false;
    this.schemeDetailsTransfer = data[0];
    this.stpTransaction.controls.employeeContry.setValidators([Validators.min(this.schemeDetailsTransfer.sipMinimumInstallmentAmount)]);

    if (data.length > 1) {
      this.reInvestmentOpt = data;
      console.log('reinvestment', this.reInvestmentOpt);
    }
    if (data.length == 1) {
      this.reInvestmentOpt = [];
    }
    if (this.getDataSummary.defaultClient.aggregatorType == 2) {
      this.getMandateDetails();
    }
  }

  reinvest(scheme) {
    this.schemeDetailsTransfer = scheme;
    this.stpTransaction.controls.employeeContry.setValidators([Validators.min(this.schemeDetailsTransfer.sipMinimumInstallmentAmount)]);
    Object.assign(this.transactionSummary, {schemeName: scheme.schemeName});
    console.log('schemeDetails == ', this.schemeDetails);
  }

  selectedScheme(scheme) {
    this.scheme = scheme;
    this.showUnits = true;
    this.showSpinner = true;
    Object.assign(this.transactionSummary, {schemeName: scheme.schemeName});
    this.navOfSelectedScheme = scheme.nav;
    const obj1 = {
      mutualFundSchemeMasterId: scheme.mutualFundSchemeMasterId,
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      orderType: 'STP',
      userAccountType: this.getDataSummary.defaultCredential.accountType,
    };
    this.onlineTransact.getSchemeDetails(obj1).subscribe(
      data => this.getSchemeDetailsRes(data), (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }

  getSchemeDetailsRes(data) {
    this.showSpinner = false;
    console.log('getSchemeDetailsRes == ', data);
    this.maiSchemeList = data;
    this.schemeDetails = data[0];
    this.schemeDetails.selectedFamilyMember = this.selectedFamilyMember;
    this.getSchemeWiseFolios();
    this.getFrequency();
  }

  getSchemeWiseFolios() {
    this.showSpinnerFolio = true;
    const obj1 = {
      mutualFundSchemeMasterId: this.scheme.mutualFundSchemeMasterId,
      advisorId: this.getDataSummary.defaultClient.advisorId,
      familyMemberId: this.getDataSummary.defaultClient.familyMemberId,
      clientId: this.getDataSummary.defaultClient.clientId,
      userAccountType: this.getDataSummary.defaultCredential.accountType,
      holdingType: this.getDataSummary.defaultClient.holdingType,
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      showOnlyNonZero: true,
    };
    this.onlineTransact.getSchemeWiseFolios(obj1).subscribe(
      data => this.getSchemeWiseFoliosRes(data)
    );
  }

  getSchemeWiseFoliosRes(data) {
    this.showSpinnerFolio = false;
    console.log('res scheme folio', data);
    this.folioList = data;
    if (this.stpTransaction.get('investmentAccountSelection').valid) {
      Object.assign(this.transactionSummary, {folioNumber: this.folioList[0].folioNumber});
    }
  }

  getFrequency() {
    const obj = {
      isin: this.schemeDetails.isin,
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      orderType: 'STP'
    };
    this.onlineTransact.getSipFrequency(obj).subscribe(
      data => this.getSipFrequencyRes(data), (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }

  getSipFrequencyRes(data) {
    console.log('isin Frequency ----', data);
    this.switchFrequency = data;
    this.switchFrequency = data.filter((element) => {
      return element.frequency;
    });
  }

  selectedFrequency(getFrerq) {
    // this.fre = getFrerq
    this.frequency = getFrerq.frequency;
    this.stpTransaction.controls.employeeContry.setValidators([Validators.min(getFrerq.sipMinimumInstallmentAmount)]);
    if (this.getDataSummary.defaultClient.aggregatorType == 1) {
      this.dateArray(getFrerq.stpDates);
    } else {
      this.dateArray(getFrerq.sipDates);
    }
  }

  dateArray(sipDates) {
    const currentDate = UtilService.getEndOfDay(new Date());
    currentDate.setDate(currentDate.getDate() + 7);

    this.dates = sipDates.split(',');
    this.dateDisplay = this.processTransaction.getDateByArray(this.dates, true);
    this.dateDisplay = this.dateDisplay.filter(element => {
      return element.date > currentDate;
    });
    console.log('dateDisplay = ', this.dateDisplay);
  }

  stpType(value) {

  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }

  enteredAmount(value) {
    Object.assign(this.transactionSummary, {enteredAmount: value});
  }

  getbankDetails(value) {
    this.bankDetails = value[0];
    console.log('bank details', value);
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
      reinvest: [(!data) ? '' : data.reinvest, [Validators.required]],
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
      schemeStp: [null, [Validators.required]],
      transferIn: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
    });

    this.ownerData = this.stpTransaction.controls;
  }

  getFormControl(): any {
    return this.stpTransaction.controls;
  }

  stp() {
    if (this.reInvestmentOpt.length > 1 && this.stpTransaction.get('reinvest').invalid) {
      this.stpTransaction.get('reinvest').markAsTouched();
    } else if (this.stpTransaction.get('investmentAccountSelection').invalid) {
      this.stpTransaction.get('investmentAccountSelection').markAsTouched();
      return;
    } else if (this.stpTransaction.get('employeeContry').invalid) {
      this.stpTransaction.get('employeeContry').markAsTouched();
      return;
    } else if (this.stpTransaction.get('frequency').invalid) {
      this.stpTransaction.get('frequency').markAsTouched();
      return;
    } else if (this.stpTransaction.get('date').invalid) {
      this.stpTransaction.get('date').markAsTouched();
      return;
    } else if (this.stpTransaction.get('tenure').invalid) {
      this.stpTransaction.get('tenure').markAsTouched();
      return;
    } else if (this.stpTransaction.get('tenure').value != '3' && this.stpTransaction.get('installment').invalid) {
      this.stpTransaction.get('installment').markAsTouched();
      return;
    } else {
      let obj = {

        productDbId: this.schemeDetails.id,
        clientName: this.selectedFamilyMember,
        holdingNature: this.getDataSummary.defaultClient.holdingType,
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
        startDate: Number(UtilService.getEndOfDay(new Date(this.stpTransaction.controls.date.value.replace(/"/g, '')))),
        toIsin: this.schemeDetailsTransfer.isin,
        schemeCd: this.schemeDetails.schemeCode,
        euin: this.getDataSummary.euin.euin,
        orderType: 'STP',
        buySell: 'PURCHASE',
        transCode: 'NEW',
        buySellType: 'FRESH',
        dividendReinvestmentFlag: this.schemeDetailsTransfer.dividendReinvestmentFlag,
        amountType: 'Amount',
        noOfInstallments: this.stpTransaction.controls.installment.value,
        frequencyType: this.frequency,
        clientCode: this.getDataSummary.defaultClient.clientCode,
        orderVal: this.stpTransaction.controls.employeeContry.value,
        bseDPTransType: 'PHYSICAL',
        aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
        mandateId: null,
        bankDetailId: null,
        nsePaymentMode: null,
        childTransactions: []
      };
      if (this.getDataSummary.defaultClient.aggregatorType == 1) {
        obj.mandateId = (this.achMandateNSE == undefined) ? null : this.achMandateNSE.id;
        obj.bankDetailId = this.bankDetails.id;
        obj.nsePaymentMode = (this.stpTransaction.controls.modeOfPaymentSelection.value == 2) ? 'DEBIT_MANDATE' : 'ONLINE';
      }
      const tenure = this.stpTransaction.controls.tenure.value;
      const installment = this.stpTransaction.controls.installment.value;
      obj = this.processTransaction.checkInstallments(obj, tenure, installment);
      console.log('json stp', obj);
      if (this.multiTransact == true) {
        console.log('new purchase obj', this.childTransactions);
        this.AddMultiTransaction();
        obj.childTransactions = this.childTransactions;
      }
      this.barButtonOptions.active = true;
      this.onlineTransact.transactionBSE(obj).subscribe(
        data => this.stpBSERes(data), (error) => {
          this.barButtonOptions.active = false;
          this.eventService.showErrorMessage(error);
        }
      );
    }
  }

  stpBSERes(data) {
    this.barButtonOptions.active = false;
    console.log('stp res == ', data);
    if (data == undefined) {

    } else {
      this.processTransaction.onAddTransaction('confirm', this.transactionSummary);
      Object.assign(this.transactionSummary, {allEdit: false});
    }
  }

  AddMultiTransaction() {
    if (this.reInvestmentOpt.length > 1 && this.stpTransaction.get('reinvest').invalid) {
      this.stpTransaction.get('reinvest').markAsTouched();
    } else if (this.stpTransaction.get('schemeStp').invalid) {
      this.stpTransaction.get('schemeStp').markAsTouched();
      return;
    } else if (this.stpTransaction.get('investmentAccountSelection').invalid) {
      this.stpTransaction.get('investmentAccountSelection').markAsTouched();
      return;
    } else if (this.stpTransaction.get('transferIn').invalid) {
      this.stpTransaction.get('transferIn').markAsTouched();
      return;
    } else if (this.stpTransaction.get('frequency').invalid) {
      this.stpTransaction.get('frequency').markAsTouched();
      return;
    } else if (this.stpTransaction.get('employeeContry').invalid) {
      this.stpTransaction.get('employeeContry').markAsTouched();
      return;
    } else if (this.stpTransaction.get('date').invalid) {
      this.stpTransaction.get('date').markAsTouched();
      return;
    } else if (this.stpTransaction.get('tenure').invalid) {
      this.stpTransaction.get('tenure').markAsTouched();
      return;
    } else if (this.stpTransaction.get('installment').invalid) {
      this.stpTransaction.get('installment').markAsTouched();
      return;
    } else {
      this.multiTransact = true;
      if (this.scheme != undefined && this.schemeDetails != undefined && this.stpTransaction != undefined) {
        let obj = {
          amc: this.scheme.amcId,
          folioNo: (this.folioDetails == undefined) ? null : this.folioDetails.folioNumber,
          productCode: this.schemeDetails.schemeCode,
          dividendReinvestmentFlag: this.schemeDetails.dividendReinvestmentFlag,
          orderVal: this.stpTransaction.controls.employeeContry.value,
          bankDetailId: this.bankDetails.id,
          toIsin: this.schemeDetailsTransfer.isin,
          schemeName: this.scheme.schemeName,
          mandateId: (this.achMandateNSE) ? this.achMandateNSE.id : null,
          productDbId: this.schemeDetails.id,
          frequencyType: this.frequency,
          startDate: Number(UtilService.getEndOfDay(new Date(this.stpTransaction.controls.date.value.replace(/"/g, '')))),
        };
        const tenure = this.stpTransaction.controls.tenure.value;
        const installment = this.stpTransaction.controls.installment.value;
        obj = this.processTransaction.checkInstallments(obj, tenure, installment);
        this.childTransactions.push(obj);
        console.log(this.childTransactions);
        this.schemeList = [];
        this.stpTransaction.controls.frequency.reset();
        this.stpTransaction.controls.date.reset();
        this.stpTransaction.controls.installment.reset();
        this.stpTransaction.controls.employeeContry.reset();
        this.stpTransaction.controls.investmentAccountSelection.reset();
        this.stpTransaction.controls.schemeStp.reset();
      }
    }
  }
}
