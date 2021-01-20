import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { OnlineTransactionService } from '../../../online-transaction.service';
import { ProcessTransactionService } from '../process-transaction.service';
import { EventService } from 'src/app/Data-service/event.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { AuthService } from 'src/app/auth-service/authService';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-swp-transaction',
  templateUrl: './swp-transaction.component.html',
  styleUrls: ['./swp-transaction.component.scss']
})
export class SwpTransactionComponent implements OnInit {

  isSuccessfulTransaction = false;
  folioNumberShow: any;
  defaultFrequency: any;

  oldDefaultData;
  schemeName: any;
  mutualFundData: any;
  folioNumber: any;
  mfDefault: any;

  get data() {
    return this.inputData;
  }

  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'TRANSACT NOW',
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
  dataSource: any;
  ownerData: any;
  swpTransaction: any;
  inputData: any;
  selectedFamilyMember: any;
  isViewInitCalled = false;
  transactionType: any;
  maiSchemeList: any;
  schemeDetails: any;
  reInvestmentOpt = [];
  schemeList: any;
  showUnits = false;
  showSpinner = false;
  navOfSelectedScheme: any;
  transactionSummary: {};
  selectedFreqModel: any;
  getDataSummary: any;
  swpFrequency: any;

  constructor(private subInjectService: SubscriptionInject, private onlineTransact: OnlineTransactionService,
    public processTransaction: ProcessTransactionService, private fb: FormBuilder,
    private eventService: EventService) {
  }

  frequency: any;
  dates: any;
  dateDisplay: any;
  folioDetails: any;
  scheme: any;
  folioList = [];
  bankDetails: any;
  showSpinnerFolio = false;
  currentValue: number;
  multiTransact = false;
  childTransactions = [];
  displayedColumns: string[] = ['no', 'folio', 'ownerName', 'amount'];
  advisorId: any;
  validatorType = ValidatorType;
  filterSchemeList: Observable<any[]>;

  @Output() changedValue = new EventEmitter();

  @Input()
  set data(data) {
    this.advisorId = AuthService.getAdvisorId();
    this.reInvestmentOpt = []
    this.inputData = data;
    this.transactionType = data.transactionType;
    this.selectedFamilyMember = data.selectedFamilyMember;
    if (data.mutualFundData) {
      this.folioList = []
      this.schemeName = data.mutualFundData.schemeName
      this.folioNumber = data.mutualFundData.folioNumber
      this.mfDefault = data.transactionData
      let foilo = { 'folioNumber': this.folioNumber }
      let schemeName = { 'schemeName': this.schemeName }
      this.folioList.push(foilo)
      // this.schemeList.push({'schemeName': this.schemeName})
      this.filterSchemeList = of([{ 'schemeName': this.schemeName }])
      this.mutualFundData = data.mutualFundData
    }
    if (this.isViewInitCalled) {
      this.getdataForm('');
    }
  }

  ngOnInit() {
    this.transactionSummary = {};
    this.childTransactions = [];
    this.getdataForm(this.inputData);

    Object.assign(this.transactionSummary, { familyMemberId: this.inputData.familyMemberId });
    Object.assign(this.transactionSummary, { clientId: this.inputData.clientId });
    Object.assign(this.transactionSummary, { transactType: 'SWP' });
    Object.assign(this.transactionSummary, { allEdit: true });
    Object.assign(this.transactionSummary, { multiTransact: false });
    Object.assign(this.transactionSummary, { isAdvisorSection: this.inputData.isAdvisorSection });
    Object.assign(this.transactionSummary, { selectedFamilyMember: this.inputData.selectedFamilyMember });

  }

  backToTransact() {
    this.changedValue.emit('step-2');
  }

  getDefaultDetails(data) {
    this.getDataSummary = data;
    Object.assign(this.transactionSummary, { aggregatorType: this.getDataSummary.defaultClient.aggregatorType });
    if (this.oldDefaultData) {
      this.checkAndResetForm(this.oldDefaultData, this.getDataSummary);
    } else if (!this.mutualFundData) {
      this.getSchemeList();
      this.setDefaultTenure();
    }
    this.oldDefaultData = data;

  }

  checkAndResetForm(oldData, newData) {
    if (oldData.defaultCredential.accountType != newData.defaultCredential.accountType) {
      if (!this.mutualFundData) {
        this.resetForm();
        this.getSchemeList();
      } else {
        this.mfDefault = newData
        this.getdataForm(this.inputData)
      }
    } else if (oldData.defaultClient.holdingType != newData.defaultClient.holdingType) {
      this.resetForm();
      this.getSchemeList();
    } else if (oldData.defaultClient.aggregatorType != newData.defaultClient.aggregatorType) {

    }
    //

  }

  resetForm() {
    this.scheme = null;
    this.schemeList = null;
    this.reInvestmentOpt = [];
    this.schemeDetails = null;
    this.folioList = [];
    this.folioDetails = null;
    this.onFolioChange(null);
    this.navOfSelectedScheme = 0;
    this.swpFrequency = [];
    this.navOfSelectedScheme = 0;
    this.dateDisplay = [];
    this.selectedFreqModel = undefined;
    this.frequency = undefined;
    (this.schemeDetails) ? (this.schemeDetails.minAmount = 0) : 0;
    Object.assign(this.transactionSummary, { schemeName: '' }); // to disable scheme name from transaction summary
    Object.assign(this.transactionSummary, { folioNumber: '' });
    this.swpTransaction.controls.employeeContry.reset();
    this.swpTransaction.controls.investmentAccountSelection.reset();
    this.swpTransaction.controls.schemeSwp.reset();
    this.setDefaultTenure();
  }


  getSchemeList() {
    /* if (data.target.value == '') {
       this.scheme = undefined;
       this.swpTransaction.controls.employeeContry.setValidators([Validators.min(0)]);
       this.swpTransaction.controls.employeeContry.setValue();
       this.schemeDetails.minimumPurchaseAmount = 0;
       return;
     }*/
    if (this.swpTransaction.get('schemeSwp').invalid) {
      this.showSpinner = false;
      Object.assign(this.transactionSummary, { schemeName: '' });
      Object.assign(this.transactionSummary, { folioNumber: '' });
      (this.schemeDetails) ? (this.schemeDetails.minimumPurchaseAmount = 0) : 0; // if scheme not present then min amt is 0
    }
    this.showSpinner = true;
    const obj = {
      bseOrderType: 'SWP',
      showOnlyNonZero: true,
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      advisorId: this.advisorId,
      tpUserCredentialId: this.getDataSummary.defaultClient.tpUserCredentialId,
      familyMemberId: this.getDataSummary.defaultClient.familyMemberId,
      clientId: this.getDataSummary.defaultClient.clientId,
      userAccountType: this.getDataSummary.defaultCredential.accountType,
      holdingType: this.getDataSummary.defaultClient.holdingType,
      tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId,
    };
    this.onlineTransact.getExistingSchemes(obj).subscribe(
      data => this.getExistingSchemesRes(data), (error) => {
        this.showSpinner = false;
        this.swpTransaction.get('schemeSwp').setErrors({ setValue: error.message });
        this.swpTransaction.get('schemeSwp').markAsTouched();
        (this.schemeDetails) ? (this.schemeDetails.minimumPurchaseAmount = 0) : 0;
        // this.eventService.openSnackBar(error, 'Dismiss');
      }
    );
  }

  getbankDetails(value) {
    this.bankDetails = value;
  }

  getSchemeDetailsRes(data) {
    this.maiSchemeList = data;
    this.schemeDetails = data[0];
    this.schemeDetails.selectedFamilyMember = this.selectedFamilyMember;
    if (data.length > 1) {
      this.reInvestmentOpt = data;
    }
    if (data.length == 1) {
      this.reInvestmentOpt = [];
    }
    Object.assign(this.transactionSummary, { folioNumber: this.folioNumber });
    Object.assign(this.transactionSummary, { schemeName: this.schemeName });
    this.getFrequency();
    if (!this.mutualFundData) {
      this.getSchemeWiseFolios();
    }
  }

  reinvest(scheme) {
    this.schemeDetails = scheme;
    Object.assign(this.transactionSummary, { schemeName: scheme.schemeName });
  }

  getExistingSchemesRes(data) {
    this.showSpinner = false;
    this.schemeList = data;
    this.swpTransaction.controls.schemeSwp.setValue('');

  }

  selectedScheme(scheme) {
    this.scheme = scheme;
    this.showUnits = true;
    this.folioList = [];
    this.schemeDetails = null;
    this.onFolioChange(null);
    this.swpFrequency = [];
    Object.assign(this.transactionSummary, { schemeName: scheme.schemeName });
    this.navOfSelectedScheme = scheme.nav;
    const obj1 = {
      mutualFundSchemeMasterId: scheme.mutualFundSchemeMasterId,
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      orderType: 'STP',
      userAccountType: this.getDataSummary.defaultCredential.accountType,
    };
    this.onlineTransact.getSchemeDetails(obj1).subscribe(
      data => this.getSchemeDetailsRes(data), (error) => {
        this.eventService.openSnackBar(error, 'Dismiss');
      }
    );
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
      data => this.getSchemeWiseFoliosRes(data), (error) => {
        this.eventService.openSnackBar(error, 'Dismiss');
      }
    );
  }

  getSchemeWiseFoliosRes(data) {
    this.showSpinnerFolio = false;
    if (data) {
      this.folioList = data;
    }
    if (this.folioList.length == 1) {
      this.swpTransaction.controls.investmentAccountSelection.setValue(this.folioList[0].folioNumber);
      this.selectedFolio(this.folioList[0]);
      if (this.swpTransaction('investmentAccountSelection').valid) {
        Object.assign(this.transactionSummary, { folioNumber: this.folioList[0].folioNumber });
      }
    } else {
      // this.onFolioChange(null);
    }
  }

  enteredAmount(value) {
    Object.assign(this.transactionSummary, { enteredAmount: value });
  }

  onFolioChange(folio) {
    this.swpTransaction.controls.investmentAccountSelection.setValue('');
  }

  selectedFolio(folio) {
    this.folioDetails = folio;
    this.swpTransaction.controls.balanceUnit.setValue((folio.balanceUnit).toFixed(2));
    this.swpTransaction.controls.currentValue.setValue((this.processTransaction.calculateCurrentValue(this.navOfSelectedScheme, folio.balanceUnit)).toFixed(2));
    this.currentValue = this.processTransaction.calculateCurrentValue(this.navOfSelectedScheme, folio.balanceUnit);
    this.showUnits = true;
    Object.assign(this.transactionSummary, { folioNumber: folio.folioNumber });
    Object.assign(this.transactionSummary, { mutualFundId: folio.id });
    Object.assign(this.transactionSummary, { tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId });
    this.transactionSummary = { ...this.transactionSummary };
  }

  getFrequency() {
    const obj = {
      isin: this.schemeDetails.isin,
      aggregatorType: (this.getDataSummary) ? this.getDataSummary.defaultClient.aggregatorType : this.mfDefault.defaultClient.aggregatorType,
      orderType: 'SWP'
    };
    this.onlineTransact.getSipFrequency(obj).subscribe(
      data => this.getSipFrequencyRes(data), (error) => {
        this.eventService.openSnackBar(error, 'Dismiss');
      }
    );
  }

  getSipFrequencyRes(data) {
    // this.swpFrequency = data;
    this.swpFrequency = this.processTransaction.filterFrequencyList(data);
    if (this.swpFrequency) {
      this.swpFrequency.forEach(singleFrequency => {
        if (singleFrequency.frequency == 'MONTHLY') {
          this.swpTransaction.controls.frequency.setValue(singleFrequency.frequency);
          this.selectedFrequency(singleFrequency);
        }
      });
    }
  }

  selectedFrequency(getFrerq) {
    this.selectedFreqModel = getFrerq;
    this.frequency = getFrerq.frequency;
    this.swpTransaction.controls.employeeContry.setValidators([Validators.required, Validators.min(getFrerq.sipMinimumInstallmentAmount)]);
    if ((this.getDataSummary) ? this.getDataSummary.defaultClient.aggregatorType == 1 : this.mfDefault.defaultClient.aggregatorType == 1) {
      this.dateArray(getFrerq.swpDates);
    } else {
      this.dateArray(getFrerq.sipDates);
    }
  }

  dateArray(sipDates) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 7);
    this.dates = sipDates.split(',');
    this.dateDisplay = this.processTransaction.getDateByArray(this.dates, true);
    this.dateDisplay = this.dateDisplay.filter(element => {
      return element.date > currentDate;
    });
  }

  close() {
    this.subInjectService.changeNewRightSliderState({
      state: 'close',
      refreshRequired: this.isSuccessfulTransaction
    });
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
      balanceUnit: [(!data) ? '' : data.balanceUnit,],
      currentValue: [(!data) ? '' : data.currentValue,],
      employeeContry: [(!data) ? '' : data.employeeContry, [Validators.required]],
      investmentAccountSelection: [(data.folioNumber) ? data.folioNumber : (this.mutualFundData) ? this.mutualFundData.folioNumber : '', [Validators.required]],
      modeOfPaymentSelection: [(!data) ? '' : data.modeOfPaymentSelection, [Validators.required]],
      folioSelection: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      selectInvestor: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      date: [(data.date) ? data.date : '', [Validators.required]],
      frequency: [(data.frequency) ? data.frequency : '', [Validators.required]],
      tenure: [(data.tenure) ? data.tenure : '3', [Validators.required]],
      installment: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      schemeSwp: [(!data) ? '' : (this.mutualFundData) ? this.mutualFundData.schemeName : '', [Validators.required]],
    });
    this.filterSchemeList = this.swpTransaction.controls.schemeSwp.valueChanges.pipe(
      startWith(''),
      map(value => this.processTransaction.filterScheme(value + '', this.schemeList))
    );
    this.ownerData = this.swpTransaction.controls;
    if (this.mutualFundData) {
      this.folioDetails = {}
      this.swpTransaction.controls.schemeSelection.setValue('1')
      this.swpTransaction.controls.folioSelection.setValue('1')
      this.swpTransaction.controls.schemeSwp.setValue({ 'schemeName': this.schemeName })
      this.swpTransaction.controls['schemeSwp'].disable();
      this.filterSchemeList = of([{ 'schemeName': this.schemeName }])
      Object.assign(this.folioDetails, { folioNumber: this.folioNumber });
      this.scheme = {
        'schemeName': this.schemeName,
        'mutualFundSchemeMasterId': this.mutualFundData.schemeId
      }
      const obj1 = {
        mutualFundSchemeMasterId: this.mutualFundData.schemeId,
        aggregatorType: this.mfDefault.defaultClient.aggregatorType,
        orderType: 'ORDER',
        userAccountType: this.mfDefault.defaultCredential.accountType,
      };
      this.onlineTransact.getSchemeDetails(obj1).subscribe(
        data => this.getSchemeDetailsRes(data), (error) => {
          this.eventService.openSnackBar(error, 'Dismiss');
        }
      );
      this.navOfSelectedScheme = this.mutualFundData.nav
      this.currentValue = this.processTransaction.calculateCurrentValue(this.mutualFundData.nav, this.mutualFundData.balanceUnit);
      this.currentValue = Math.round(this.currentValue)
      this.swpTransaction.controls.currentValue.setValue(this.currentValue);
      this.swpTransaction.controls.balanceUnit.setValue(this.mutualFundData.balanceUnit);
      Object.assign(this.folioDetails, { balanceUnit: this.mutualFundData.balanceUnit });
      this.mutualFundData.balanceUnit = parseFloat(this.mutualFundData.balanceUnit).toFixed(2);
      this.showUnits = true;
      Object.assign(this.transactionSummary, { folioNumber: this.folioNumber });
      Object.assign(this.transactionSummary, { tpUserCredFamilyMappingId: this.mfDefault.defaultClient.tpUserCredFamilyMappingId });
    }
  }

  setDefaultTenure() {
    if (this.getDataSummary.defaultClient.aggregatorType == 1) {
      this.swpTransaction.controls.tenure.setValue('3');
    } else {
      this.swpTransaction.controls.tenure.setValue('2');
    }
  }

  getFormControl(): any {
    return this.swpTransaction.controls;
  }

  // getSingleTransactionJson() {}
  swp() {
    if (this.barButtonOptions.active) {
      return;
    }
    this.barButtonOptions.active = true;
    if (this.swpTransaction.get('investmentAccountSelection').invalid) {
      this.swpTransaction.get('investmentAccountSelection').markAsTouched();
      return;
    } else if (this.swpTransaction.get('date').invalid) {
      this.swpTransaction.get('date').markAsTouched();
      return;
    } else if (this.swpTransaction.get('frequency').invalid) {
      this.swpTransaction.get('frequency').markAsTouched();
      return;
    } else if (this.swpTransaction.get('employeeContry').invalid) {
      this.swpTransaction.get('employeeContry').markAsTouched();
      return;
    } else if ((this.swpTransaction.get('tenure').value) != 3 && this.swpTransaction.get('installment').invalid) {
      this.swpTransaction.get('installment').markAsTouched();
      return;
    } else {
      const startDate = Number(UtilService.getEndOfDay(UtilService.getEndOfDay(new Date(this.swpTransaction.controls.date.value.replace(/"/g, '')))));
      const tenure = this.swpTransaction.controls.tenure.value;
      const noOfInstallments = this.swpTransaction.controls.installment.value;
      const orderVal = this.swpTransaction.controls.employeeContry.value;
      let obj: any = this.processTransaction.calculateInstallmentAndEndDateNew(startDate, this.frequency, tenure, noOfInstallments);

      obj = {
        ...obj,
        productDbId: this.schemeDetails.id,
        clientName: this.selectedFamilyMember,
        holdingType: this.getDataSummary.defaultClient.holdingType,
        mutualFundSchemeMasterId: this.scheme.mutualFundSchemeMasterId,
        productCode: this.schemeDetails.schemeCode,
        isin: this.schemeDetails.isin,
        folioNo: (this.folioDetails == undefined) ? null : this.folioDetails.folioNumber,
        tpUserCredentialId: this.getDataSummary.defaultClient.tpUserCredentialId,
        tpSubBrokerCredentialId: this.getDataSummary.euin.id,
        familyMemberId: this.getDataSummary.defaultClient.familyMemberId,
        adminAdvisorId: this.getDataSummary.defaultClient.advisorId,
        clientId: this.getDataSummary.defaultClient.clientId,
        schemeCd: this.schemeDetails.schemeCode,
        euin: this.getDataSummary.euin.euin,
        clientCode: this.getDataSummary.defaultClient.clientCode,
        orderVal: this.swpTransaction.controls.employeeContry.value,
        aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
        orderType: 'SWP',
        amountType: 'Amount',
        bseDPTransType: 'PHYSICAL',
        bankDetailId: null,
        nsePaymentMode: null,
        childTransactions: null,
        isException: true,
        tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId,
      };
      if (this.getDataSummary.defaultClient.aggregatorType == 1) {
        obj.bankDetailId = this.bankDetails.id;
        // obj.nsePaymentMode = (this.swpTransaction.controls.modeOfPaymentSelection.value == 2) ? 'DEBIT_MANDATE' : 'ONLINE';
      }
      if (this.multiTransact == true) {
        this.AddMultiTransaction();
        obj.childTransactions = this.childTransactions;
      }
      this.onlineTransact.transactionBSE(obj).subscribe(
        data => {
          this.isSuccessfulTransaction = true;
          this.swpBSERes(data);
        }, (error) => {
          this.eventService.openSnackBar(error, 'Dismiss', null, 60000);
          this.barButtonOptions.active = false;
        }
      );
    }

  }

  swpBSERes(data) {
    this.barButtonOptions.active = false;
    if (data == undefined) {

    } else {
      this.processTransaction.onAddTransaction('confirm', this.transactionSummary);
      Object.assign(this.transactionSummary, { allEdit: false });
    }
  }

  AddMultiTransaction() {
    if (this.barButtonOptions.active) {
      return;
    }
    if (this.swpTransaction.get('schemeSwp').invalid) {
      this.swpTransaction.get('schemeSwp').markAsTouched();
      return;
    } else if (this.swpTransaction.get('investmentAccountSelection').invalid) {
      this.swpTransaction.get('investmentAccountSelection').markAsTouched();
      return;
    } else if (this.swpTransaction.get('frequency').invalid) {
      this.swpTransaction.get('frequency').markAsTouched();
      return;
    } else if (this.swpTransaction.get('employeeContry').invalid) {
      this.swpTransaction.get('employeeContry').markAsTouched();
      return;
    } else if (this.swpTransaction.get('date').invalid) {
      this.swpTransaction.get('date').markAsTouched();
      return;
    } else if (this.swpTransaction.get('tenure').invalid) {
      this.swpTransaction.get('tenure').markAsTouched();
      return;
    } else if (this.swpTransaction.get('installment').invalid) {
      this.swpTransaction.get('installment').markAsTouched();
      return;
    } else {
      this.multiTransact = true;
      if (this.scheme != undefined && this.schemeDetails != undefined && this.swpTransaction != undefined) {
        let obj = {
          amc: this.scheme.amcId,
          folioNo: (this.folioDetails == undefined) ? null : this.folioDetails.folioNumber,
          productCode: this.schemeDetails.schemeCode,
          dividendReinvestmentFlag: this.schemeDetails.dividendReinvestmentFlag,
          orderVal: this.swpTransaction.controls.employeeContry.value,
          productDbId: this.schemeDetails.id,
          frequencyType: this.frequency,
          startDate: Number(new Date(this.swpTransaction.controls.date.value.replace(/"/g, ''))),
          schemeName: this.scheme.schemeName,
        };
        const tenure = this.swpTransaction.controls.tenure.value;
        const installment = this.swpTransaction.controls.installment.value;
        obj = this.processTransaction.calculateInstallmentAndEndDate(obj, tenure, installment);
        this.childTransactions.push(obj);
        this.swpTransaction.controls.date.reset();
        this.swpTransaction.controls.employeeContry.reset();
        this.swpTransaction.controls.tenure.reset();
        this.swpTransaction.controls.frequency.reset();
        this.swpTransaction.controls.schemeSwp.reset();
        this.swpTransaction.controls.investmentAccountSelection.reset();
      }
    }
  }
}
