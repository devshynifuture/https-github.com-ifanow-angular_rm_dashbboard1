import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SubscriptionInject} from '../../../../Subscriptions/subscription-inject.service';
import {FormBuilder, Validators} from '@angular/forms';
import {OnlineTransactionService} from '../../../online-transaction.service';
import {ProcessTransactionService} from '../process-transaction.service';
import {EventService} from 'src/app/Data-service/event.service';
import {MatProgressButtonOptions} from 'src/app/common/progress-button/progress-button.component';
import {UtilService, ValidatorType} from '../../../../../../../services/util.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MathUtilService} from '../../../../../../../services/math-util.service';
import {ConfirmDialogComponent} from '../../../../../common-component/confirm-dialog/confirm-dialog.component';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {AddMandateComponent} from '../../MandateCreation/add-mandate/add-mandate.component';

@Component({
  selector: 'app-sip-transaction',
  templateUrl: './sip-transaction.component.html',
  styleUrls: ['./sip-transaction.component.scss']
})
export class SipTransactionComponent implements OnInit {

  isSuccessfulTransaction = false;
  oldDefaultData;

  constructor(private subInjectService: SubscriptionInject, private onlineTransact: OnlineTransactionService,
              public processTransaction: ProcessTransactionService, private fb: FormBuilder,
              private eventService: EventService, public dialog: MatDialog) {
  }

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
  mandateAmountErrorMessage = '';
  installmentErrorMessage = '';
  ownerData: any;
  folioSelection: [2];
  schemeSelection: [2];
  sipTransaction: any;
  inputData: any;
  selectedFamilyMember: any;
  isViewInitCalled = false;
  transactionType: any;
  schemeDetails: any = {};
  transactionSummary: {};
  selectScheme = 2;
  schemeList: any;
  existingSchemeList = [];
  scheme: any;
  navOfSelectedScheme: any;
  reInvestmentOpt = [];
  getDataSummary: any;
  folioList: any;
  folioDetails: any;
  ExistingOrNew: any = 2;
  sipFrequency: any;
  dateDisplay: any;
  dates: any;
  showSchemeSpinner = false;
  mandateDetails: any;
  frequency: any;
  selectedFreqModel: any;
  selectedMandate: any;
  platformType: any;
  bankDetails: any;
  showSpinnerFolio = false;
  showSpinnerMandate = false;
  multiTransact = false;
  childTransactions = [];
  dataSource = new MatTableDataSource(this.childTransactions);

  id = 0;
  isEdit = false;
  editedId: any;
  displayedColumns: string[] = ['no', 'folio', 'ownerName', 'amount', 'icons'];
  umrn: any;
  validatorType = ValidatorType;
  filterSchemeList: Observable<any[]>;

  @Output() changedValue = new EventEmitter();

  @Input()
  set data(data) {
    this.inputData = data;
    this.transactionType = data.transactionType;
    this.selectedFamilyMember = data.selectedFamilyMember;

    if (this.isViewInitCalled) {
      this.getDataForm('', false);
    }
  }

  ngOnInit() {
    this.getDataForm(this.inputData, false);
    this.childTransactions = [];
    this.transactionSummary = {};
    Object.assign(this.transactionSummary, {familyMemberId: this.inputData.familyMemberId});
    Object.assign(this.transactionSummary, {clientId: this.inputData.clientId});
    Object.assign(this.transactionSummary, {transactType: 'SIP'});
    Object.assign(this.transactionSummary, {isAdvisorSection: this.inputData.isAdvisorSection});
    Object.assign(this.transactionSummary, {paymentMode: 2});
    Object.assign(this.transactionSummary, {allEdit: true});
    Object.assign(this.transactionSummary, {multiTransact: false}); // when multi transact then disabled edit button in transaction summary
    Object.assign(this.transactionSummary, {selectedFamilyMember: this.inputData.selectedFamilyMember});
  }

  backToTransact() {
    this.changedValue.emit('step-2');
  }

  enteredAmount(value) {
    Object.assign(this.transactionSummary, {enteredAmount: value});
  }

  selectExistingOrNew(value) {
    this.sipTransaction.controls.folioSelection.setValue(value);
    if (value == '2') {
      this.setMinAmount();
      Object.assign(this.transactionSummary, {folioNumber: ''});
    } else {
      if (this.scheme) {
        this.getFolioList();
      }
    }
    this.ExistingOrNew = value;
  }

  selectSchemeOption(value) {
    if (value == '2') {
      this.existingSchemeList = [];
    }
    this.scheme = undefined;
    this.schemeList = undefined;
    this.schemeDetails = undefined;
    this.sipTransaction.get('employeeContry').setValue('');
    this.selectExistingOrNew(value);
    this.sipTransaction.controls.schemeSip.reset();
    this.folioList = [];
    this.navOfSelectedScheme = 0;
    this.frequency = undefined;
    this.sipFrequency = [];
    Object.assign(this.transactionSummary, {schemeName: ''}); // to disable scheme name from transaction summary
    Object.assign(this.transactionSummary, {folioNumber: ''}); // to disable folio number from transaction summary
    this.selectScheme = value;
    if (this.getDataSummary) {
      if (this.selectScheme == 1) {
        if (this.existingSchemeList && this.existingSchemeList.length > 0) {
          this.getExistingSchemesRes(this.existingSchemeList);
        } else {
          this.getExistingScheme();
        }
      }
    }
  }

  getSchemeList(data) {

    if (data == '') {
      this.scheme = undefined;
      // this.schemeList = undefined;
      this.sipTransaction.controls.employeeContry.setValidators([Validators.min(0)]);
      this.sipTransaction.controls.employeeContry.setValue();
      this.schemeDetails.minAmount = 0;
      return;
    }
    if (this.sipTransaction.get('schemeSip').invalid) {
      this.showSchemeSpinner = false;
      Object.assign(this.transactionSummary, {schemeName: ''});
      Object.assign(this.transactionSummary, {folioNumber: ''});
      // if scheme not present then min amt is 0
      (this.schemeDetails) ? (this.schemeDetails.minAmount = 0) : 0;
    }
    let amcId = 0;
    // if (this.childTransactions && this.childTransactions.length > 0) {
    //   amcId = this.childTransactions[0].amcId;
    // }
    const obj = {
      amcId,
      searchQuery: data,
      bseOrderType: 'SIP',
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      advisorId: this.getDataSummary.defaultClient.advisorId,
      tpUserCredentialId: this.getDataSummary.defaultClient.tpUserCredentialId,
      familyMemberId: this.getDataSummary.defaultClient.familyMemberId,
      clientId: this.getDataSummary.defaultClient.clientId,
      userAccountType: this.getDataSummary.defaultCredential.accountType,
      holdingType: this.getDataSummary.defaultClient.holdingType,
      tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId,
    };
    if (data.length > 2) {
      if (this.selectScheme == 2) {
        // this.getNewSchemesRes([]);
        this.showSchemeSpinner = true;
        this.onlineTransact.getNewSchemes(obj).subscribe(
          responseData => {
            this.getNewSchemesRes(responseData, data);
          }, (error) => {
            this.showSchemeSpinner = false;
            this.sipTransaction.get('schemeSip').setErrors({setValue: error});
            this.sipTransaction.get('schemeSip').markAsTouched();
            (this.schemeDetails) ? (this.schemeDetails.minAmount = 0) : 0;
            // this.eventService.openSnackBar(error, 'Dismiss');
          }
        );
      } else {

      }
    }
  }

  getNewSchemesRes(responseData, inputData) {
    this.showSchemeSpinner = false;
    this.schemeList = responseData;
    if (this.sipTransaction.controls.schemeSip.value) {
      this.filterSchemeList = new Observable().pipe(startWith(''),
        map(value => this.processTransaction.filterScheme(inputData + '', this.schemeList)));
    } else {
      this.sipTransaction.controls.schemeSip.setValue('');
    }
  }

  getExistingScheme() {
    this.showSchemeSpinner = true;
    let amcId = 0;
    // if (this.childTransactions && this.childTransactions.length > 0) {
    //   amcId = this.childTransactions[0].amcId;
    // }
    const obj = {
      amcId,
      bseOrderType: 'SIP',
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      advisorId: this.getDataSummary.defaultClient.advisorId,
      tpUserCredentialId: this.getDataSummary.defaultClient.tpUserCredentialId,
      familyMemberId: this.getDataSummary.defaultClient.familyMemberId,
      clientId: this.getDataSummary.defaultClient.clientId,
      userAccountType: this.getDataSummary.defaultCredential.accountType,
      holdingType: this.getDataSummary.defaultClient.holdingType,
      tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId,
    };
    this.onlineTransact.getExistingSchemes(obj).subscribe(
      data => this.getExistingSchemesRes(data), (error) => {
        this.showSchemeSpinner = false;
        this.sipTransaction.get('schemeSip').setErrors({setValue: error});
        this.sipTransaction.get('schemeSip').markAsTouched();
        (this.schemeDetails) ? (this.schemeDetails.minAmount = 0) : 0;
        // this.eventService.openSnackBar(error, 'Dismiss');
      }
    );
  }

  getExistingSchemesRes(data) {
    this.showSchemeSpinner = false;
    this.existingSchemeList = data;
    this.schemeList = this.existingSchemeList;
    this.sipTransaction.controls.schemeSip.setValue('');

  }

  getDefaultDetails(data) {
    this.getDataSummary = data;
    if (this.oldDefaultData) {
      this.checkAndResetForm(this.oldDefaultData, this.getDataSummary);
    }
    // this.sipTransaction.controls.investor.reset();
    this.platformType = this.getDataSummary.defaultClient.aggregatorType;
    Object.assign(this.transactionSummary, {aggregatorType: this.platformType});
    if (this.selectScheme == 1 && !(this.existingSchemeList && this.existingSchemeList.length > 0)) {
      this.getExistingScheme();
    }
    /*if (this.platformType == 1) {
      this.getMandateDetails();
    } else if (this.sipTransaction.controls.modeOfPaymentSelection.value == '2') {
    }*/
    this.getMandateDetails();
    this.oldDefaultData = data;

  }

  checkAndResetForm(oldData, newData) {
    if (oldData.defaultCredential.accountType != newData.defaultCredential.accountType) {
      this.resetForm();
      this.existingSchemeList = [];
    } else if (oldData.defaultClient.holdingType != newData.defaultClient.holdingType) {
      if (this.selectScheme == 1) {
        this.resetForm();
        this.existingSchemeList = [];
      } else {
        this.folioList = [];
        this.onFolioChange(undefined);
        this.selectExistingOrNew(this.ExistingOrNew);
      }
    } else if (oldData.defaultClient.aggregatorType != newData.defaultClient.aggregatorType) {

    }
  }

  selectPaymentMode(value) {
    Object.assign(this.transactionSummary, {paymentMode: value});
    if (value == 2) {
      Object.assign(this.transactionSummary, {getAch: true});
      this.getMandateDetails();
    } else {
      this.sipTransaction.controls.employeeContry.clearValidators();
      this.sipTransaction.controls.employeeContry.clearAsyncValidators();

      this.sipTransaction.controls.employeeContry.setValidators([Validators.required, Validators.min(this.schemeDetails.minAmount)]);
      this.sipTransaction.controls.employeeContry.updateValueAndValidity();
    }
    this.checkAndHandleMaxInstallmentValidator();
  }


  selectedScheme(scheme) {
    this.scheme = scheme;
    this.folioList = [];
    this.reInvestmentOpt = [];
    this.schemeDetails = undefined;
    this.sipFrequency = [];
    this.onFolioChange(undefined);
    Object.assign(this.transactionSummary, {schemeName: scheme.schemeName});
    this.navOfSelectedScheme = scheme.nav;
    const obj1 = {
      mutualFundSchemeMasterId: scheme.mutualFundSchemeMasterId,
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      orderType: 'SIP',
      userAccountType: this.getDataSummary.defaultCredential.accountType,
    };
    this.onlineTransact.getSchemeDetails(obj1).subscribe(
      data => this.getSchemeDetailsRes(data), (error) => {
        this.eventService.openSnackBar(error, 'Dismiss');
      }
    );
  }

  getSchemeDetailsRes(data) {
    this.schemeDetails = data[0];
    this.setMinAmount();
    this.schemeDetails.selectedFamilyMember = this.selectedFamilyMember;
    if (data.length > 1) {
      this.reInvestmentOpt = data;
    }
    if (data.length == 1) {
      this.reInvestmentOpt = [];
    }
    if (this.sipTransaction.controls.folioSelection.value == '1') {
      this.getFolioList();
    }
    this.getFrequency();
  }

  setMinAmount() {
    if (!this.schemeDetails) {
      return;
    } else if (this.sipTransaction.get('schemeSelection').value == '2' && this.schemeDetails) {
      this.schemeDetails.minAmount = this.schemeDetails.minimumPurchaseAmount;
    } else if (this.ExistingOrNew == 1) {
      this.schemeDetails.minAmount = this.schemeDetails.additionalPurchaseAmount;
    } else {
      this.schemeDetails.minAmount = this.schemeDetails.minimumPurchaseAmount;
    }
    if (this.selectedMandate) {
      Object.assign(this.transactionSummary, {umrnNo: this.selectedMandate.umrnNo});
      Object.assign(this.transactionSummary, {selectedMandate: this.selectedMandate});
      if (this.sipTransaction.controls.modeOfPaymentSelection.value == '2') {
        this.sipTransaction.controls.employeeContry.setValidators([Validators.required, Validators.min(this.schemeDetails.minAmount),
          Validators.max(this.selectedMandate.amount)]);
        this.sipTransaction.controls.employeeContry.updateValueAndValidity();
      } else {
        this.sipTransaction.controls.employeeContry.setValidators([Validators.required, Validators.min(this.schemeDetails.minAmount)]);
      }
    } else if (this.schemeDetails) {
      this.sipTransaction.controls.employeeContry.setValidators([Validators.required, Validators.min(this.schemeDetails.minAmount)]);
    }// this.sipTransaction.updateValueAndValidity();
  }


  getFrequency() {
    const obj = {
      isin: this.schemeDetails.isin,
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      orderType: 'SIP'
    };
    this.onlineTransact.getSipFrequency(obj).subscribe(
      data => this.getSipFrequencyRes(data)
    );
  }

  getSipFrequencyRes(data) {
    this.sipFrequency = this.processTransaction.filterFrequencyList(data);
    if (this.sipFrequency) {
      this.sipFrequency.forEach(singleFrequency => {
        if (singleFrequency.frequency == 'MONTHLY') {
          this.sipTransaction.controls.frequency.setValue(singleFrequency.frequency);
          this.selectedFrequency(singleFrequency);
        }
      });
    }
  }

  selectedFrequency(getFrerq) {
    this.selectedFreqModel = getFrerq;
    this.frequency = getFrerq.frequency;
    if (this.getDataSummary.defaultClient.aggregatorType == 2) {
      this.sipTransaction.controls.employeeContry.setValidators([Validators.required, Validators.min(getFrerq.additionalPurchaseAmount)]);
    }
    this.dateArray(getFrerq.sipDates);
    this.checkAndHandleMaxInstallmentValidator();

  }

  dateArray(sipDates) {
    const currentDate = UtilService.getEndOfDay(new Date());
    currentDate.setDate(currentDate.getDate() + 7);

    this.dates = sipDates.split(',');
    this.dateDisplay = this.processTransaction.getDateByArray(this.dates, true);
    this.dateDisplay = this.dateDisplay.filter(element => {
      return element.date > currentDate;
    });
  }

  getBankDetails(value) {
    if (value && value.length > 0) {
      this.bankDetails = value[0];
    } else {
      this.eventService.openSnackBar('Bank detail not found', 'Dismiss');
    }
  }

  onFolioChange(folio) {
    this.sipTransaction.controls.investmentAccountSelection.setValue('');
  }

  getMandateDetails() {
    const obj1 = {
      tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId
    };
    this.onlineTransact.getMandateDetails(obj1).subscribe(
      data => this.getMandateDetailsRes(data), (error) => {
        this.handleMandateFailure();
      }
    );
  }

  handleMandateFailure() {
    this.showSpinnerMandate = false;
    this.mandateDetails = [];
    this.selectedMandate = undefined;
    this.eventService.openSnackBar('No mandate found', 'Dismiss');
    this.sipTransaction.controls.modeOfPaymentSelection.setValue('1');
  }

  getMandateDetailsRes(data) {
    this.mandateDetails = this.processTransaction.filterActiveMandateData(data);

    if (!this.mandateDetails || this.mandateDetails.length == 0) {
      if (this.getDataSummary.defaultClient.aggregatorType == 1 && this.inputData.isAdvisorSection) {
        /* this.mandateDetails = this.processTransaction.filterRejectedMandateData(data);
         if (!this.mandateDetails || this.mandateDetails.length == 0) {
         }*/
        this.alertModal();
        this.showSpinnerMandate = false;
        return;
      } else {
        this.handleMandateFailure();
        return;
      }
    }
    this.showSpinnerMandate = false;
    if (data.length > 1) {
      Object.assign(this.transactionSummary, {showUmrnEdit: true});
    }
    this.selectedMandate = this.processTransaction.getMaxAmountMandate(this.mandateDetails);
    if (this.selectedMandate) {
      Object.assign(this.transactionSummary, {umrnNo: this.selectedMandate.umrnNo});
      Object.assign(this.transactionSummary, {selectedMandate: this.selectedMandate});
      this.setMinAmount();
    }
  }

  alertModal() {
    const dialogData = {
      data: '',
      header: 'Are you sure ?',
      body: 'No active or pending mandate found. Please create mandate to continue',
      body2: 'Are you sure you want to create a mandate ?',
      btnYes: 'NO',
      btnNo: 'YES',
      positiveMethod: () => {
        this.openMandateCreation();
        dialogRef.close();
      },
      negativeMethod: () => {
      }
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });
  }

  openMandateCreation() {
    const fragmentData = {
      flag: 'mandate',
      data: {},
      id: 1,
      state: 'open',
      componentName: AddMandateComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {

        if (UtilService.isRefreshRequired(sideBarData)) {

        }
        rightSideDataSub.unsubscribe();
      }
    );
  }

  getFolioList() {
    this.showSpinnerFolio = true;
    const obj1 = {
      amcId: this.scheme.amcId,
      mutualFundSchemeMasterId: this.scheme.mutualFundSchemeMasterId,
      advisorId: this.getDataSummary.defaultClient.advisorId,
      familyMemberId: this.getDataSummary.defaultClient.familyMemberId,
      clientId: this.getDataSummary.defaultClient.clientId,
      userAccountType: this.getDataSummary.defaultCredential.accountType,
      holdingType: this.getDataSummary.defaultClient.holdingType,
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
    };
    if (this.sipTransaction.get('schemeSelection').value == '2') {
      this.onlineTransact.getFoliosAmcWise(obj1).subscribe(
        data => {
          this.getFoliosAmcWiseRes(data);
          this.setMinAmount();
        }, (error) => {
          this.showSpinnerFolio = false;
          this.sipTransaction.get('folioSelection').setValue('2');
          this.ExistingOrNew = 2;
          this.eventService.openSnackBar(error, 'Dismiss');
          //this.setMinAmount();

        }
      );
    } else {
      /**Schemewise folio for addtional purchase*/
      this.onlineTransact.getSchemeWiseFolios(obj1).subscribe(
        data => {
          this.getFoliosAmcWiseRes(data);
          this.setMinAmount();
        }, (error) => {
          this.showSpinnerFolio = false;
          this.sipTransaction.get('folioSelection').setValue('2');
          this.ExistingOrNew = 2;
          this.eventService.openSnackBar(error, 'Dismiss');
          this.setMinAmount();

        }
      );
    }
  }

  getFoliosAmcWiseRes(data) {
    this.showSpinnerFolio = false;
    this.folioList = data;
    if (this.folioList.length == 1) {
      this.sipTransaction.controls.investmentAccountSelection.setValue(this.folioList[0].folioNumber);
      this.selectedFolio(this.folioList[0]);
      if (this.sipTransaction.controls.investmentAccountSelection.valid) {
        Object.assign(this.transactionSummary, {folioNumber: this.folioList[0].folioNumber});
      }
    }
  }

  selectedFolio(folio) {
    this.folioDetails = folio;
    Object.assign(this.transactionSummary, {folioNumber: folio.folioNumber});
    Object.assign(this.transactionSummary, {mutualFundId: folio.id});
    Object.assign(this.transactionSummary, {tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId});
    this.transactionSummary = {...this.transactionSummary};
  }

  reinvest(scheme) {
    this.schemeDetails = scheme;
    this.transactionSummary = {
      ...this.transactionSummary,
      schemeName: scheme.schemeName,
    };
    this.setMinAmount();
  }

  close() {
    this.subInjectService.changeNewRightSliderState({
      state: 'close',
      refreshRequired: this.isSuccessfulTransaction
    });
  }

  getDataForm(data, isEdit) {
    if (isEdit == true) {
      this.isEdit = isEdit;
      this.editedId = data.id;
      this.scheme = data.scheme;
      this.schemeDetails = data.schemeDetails;
      this.reInvestmentOpt = data.reInvestmentOpt;
      this.folioDetails = data.folioDetails;
      if (this.folioDetails) {
        this.selectedFolio(this.folioDetails);
      }
      this.selectedFreqModel = data.selectedFreqModel;
      this.sipFrequency = data.sipFrequency;
      this.scheme = data.scheme;
      this.schemeDetails = data.schemeDetails;
      this.reInvestmentOpt = data.reInvestmentOpt;
      this.folioDetails = data.folioDetails;
      if (this.folioDetails) {
        this.folioList = [this.folioDetails];
      }
    }
    if (!data) {
      data = {};
    }
    this.sipTransaction = this.fb.group({
      ownerName: [(!data) ? '' : data.ownerName, [Validators.required]],
      transactionType: [(!data) ? '' : data.transactionType, [Validators.required]],
      bankAccountSelection: [(!data) ? '' : data.bankAccountSelection, [Validators.required]],
      schemeSelection: ['2'],
      // investor: [(!data) ? '' : data.investor, [Validators.required]],
      reinvest: [(data.dividendReinvestmentFlag) ? data.dividendReinvestmentFlag + '' : '', [Validators.required]],
      employeeContry: [(!data) ? '' : data.orderVal, [Validators.required]],
      frequency: [(data.frequencyType) ? data.frequencyType : '', [Validators.required]],
      investmentAccountSelection: [(data.folioNo) ? data.folioNo : '', [Validators.required]],
      // modeOfPaymentSelection: ['1'],
      modeOfPaymentSelection: [(!data.modeOfPaymentSelection) ? '2' : data.modeOfPaymentSelection],
      folioSelection: [(!data.folioSelection) ? '2' : data.folioSelection],
      selectInvestor: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      date: [(data.date) ? data.date : '', [Validators.required]],
      tenure: [(data.tenure) ? data.tenure : '3', [Validators.required]],
      installment: [(!data) ? '' : data.noOfInstallments, [Validators.required]],
      schemeSip: [(!data) ? '' : data.scheme, [Validators.required]],
      isException: true,
    });
    this.sipTransaction.controls.schemeSip.valueChanges.subscribe((newValue) => {
      this.filterSchemeList = new Observable().pipe(startWith(''),
        map(value => this.processTransaction.filterScheme(newValue + '', this.schemeList)));
    });
    this.sipTransaction.controls.tenure.valueChanges.subscribe(newValue => {
      this.checkAndHandleMaxInstallmentValidator();
    });
    this.sipTransaction.controls.date.valueChanges.subscribe(newValue => {
      this.checkAndHandleMaxInstallmentValidator();
    });
    this.ownerData = this.sipTransaction.controls;
    if (data.folioNo) {
      this.getFolioList();
      // this.selectedScheme(data.scheme);
    }
    this.sipTransaction.controls.modeOfPaymentSelection.setValue('2');
  }

  getFormControl(): any {
    return this.sipTransaction.controls;
  }

  deleteChildTran(element) {
    UtilService.deleteRow(element, this.childTransactions);
    this.dataSource.data = this.childTransactions;

    if (this.childTransactions.length == 0) {
      this.multiTransact = false;
      this.resetForm();
      if (this.selectScheme == 1) {
        this.getExistingScheme();
      }
    }
  }

  getSingleTransactionJson() {
    const startDate = Number(UtilService.getEndOfDay(UtilService.getEndOfDay(new Date(this.sipTransaction.controls.date.value.replace(/"/g, '')))));
    const tenure = this.sipTransaction.controls.tenure.value;
    const noOfInstallments = this.sipTransaction.controls.installment.value;
    const orderVal = this.sipTransaction.controls.employeeContry.value;
    let obj: any = this.processTransaction.calculateInstallmentAndEndDateNew(startDate, this.frequency, tenure, noOfInstallments);
    if (this.sipTransaction.controls.modeOfPaymentSelection.value == '2' && tenure == '3') {
      obj.endDate = this.selectedMandate.toDate;
    }
    obj = {
      ...obj,
      orderVal,
      productDbId: this.schemeDetails.id,
      clientName: this.selectedFamilyMember,
      holdingType: this.getDataSummary.defaultClient.holdingType,
      mutualFundSchemeMasterId: this.scheme.mutualFundSchemeMasterId,
      productCode: this.schemeDetails.schemeCode,
      isin: this.schemeDetails.isin,
      umrn: this.umrn,
      folioNo: (this.folioDetails == undefined) ? undefined : this.folioDetails.folioNumber,
      tpUserCredentialId: this.getDataSummary.defaultClient.tpUserCredentialId,
      tpSubBrokerCredentialId: this.getDataSummary.euin.id,
      familyMemberId: this.getDataSummary.defaultClient.familyMemberId,
      adminAdvisorId: this.getDataSummary.defaultClient.advisorId,
      clientId: this.getDataSummary.defaultClient.clientId,
      orderType: 'SIP',
      buySell: 'PURCHASE',
      transCode: 'NEW',
      buySellType: 'FRESH',
      dividendReinvestmentFlag: this.schemeDetails.dividendReinvestmentFlag,
      amountType: 'Amount',
      clientCode: this.getDataSummary.defaultClient.clientCode,
      euin: this.getDataSummary.euin.euin,
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      schemeCd: this.schemeDetails.schemeCode,
      transMode: 'PHYSICAL',
      bseDPTransType: 'PHYSICAL',
      mandateId: undefined,
      bankDetailId: undefined,
      nsePaymentMode: undefined,
      mandateType: undefined,
      xSipMandateId: undefined,
      childTransactions: [],
      tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId,
      noOfInstallments: this.sipTransaction.controls.installment.value,

      selectedFreqModel: this.selectedFreqModel,
      schemeSelection: this.sipTransaction.get('schemeSelection').value,
      folioSelection: this.sipTransaction.get('folioSelection').value,
      modeOfPaymentSelection: this.sipTransaction.get('modeOfPaymentSelection').value,
      tenure: this.sipTransaction.controls.tenure.value,
      date: this.sipTransaction.controls.date.value,
      sipFrequency: this.sipFrequency,
      amcId: this.scheme.amcId,
      scheme: this.scheme,
      schemeName: this.scheme.schemeName,
      schemeDetails: this.schemeDetails,
      reInvestmentOpt: this.reInvestmentOpt,
      folioDetails: this.folioDetails,
    };
    if (this.getDataSummary.defaultClient.aggregatorType == 1) {
      obj.mandateId = (this.selectedMandate) ? this.selectedMandate.id : undefined;
      obj.bankDetailId = this.bankDetails.id;
      obj.nsePaymentMode = (this.sipTransaction.controls.modeOfPaymentSelection.value == '2') ? 'DEBIT_MANDATE' : 'ONLINE';
    } else {
      obj.mandateType = (this.selectedMandate) ? this.selectedMandate.mandateType : undefined;
      obj.xSipMandateId = (this.selectedMandate) ? this.selectedMandate.mandateId : undefined;
    }

    return obj;
  }

  sip() {
    if (this.validateSingleTransaction()) {
      const obj = this.getSingleTransactionJson();

      if (this.multiTransact == true) {
        this.AddMultiTransaction();
        obj.childTransactions = this.childTransactions;
        this.childTransactions.forEach(singleTranJson => {
          this.removeUnnecessaryDataFromJson(singleTranJson);
        });
      }
      this.removeUnnecessaryDataFromJson(obj);
      this.barButtonOptions.active = true;
      this.onlineTransact.transactionBSE(obj).subscribe(
        data => {
          this.isSuccessfulTransaction = true;
          this.sipBSERes(data);
        }, (error) => {
          this.barButtonOptions.active = false;
          this.eventService.openSnackBar(error, 'Dismiss');
        }
      );
    }
  }

  validateSingleTransaction() {
    if (this.sipTransaction.get('schemeSip').invalid) {
      this.sipTransaction.get('schemeSip').markAsTouched();
    } else if (this.reInvestmentOpt.length > 1 && this.sipTransaction.get('reinvest').invalid) {
      this.sipTransaction.get('reinvest').markAsTouched();
    } else if (this.sipTransaction.get('folioSelection').value == '1' && this.sipTransaction.get('investmentAccountSelection').invalid) {
      this.sipTransaction.get('investmentAccountSelection').markAsTouched();
    } else if (this.sipTransaction.get('employeeContry').invalid) {
      this.sipTransaction.get('employeeContry').markAsTouched();
    } else if (this.sipTransaction.get('date').invalid) {
      this.sipTransaction.get('date').markAsTouched();
    } else if (this.sipTransaction.get('tenure').invalid) {
      this.sipTransaction.get('tenure').markAsTouched();
    } else if (this.sipTransaction.get('frequency').invalid) {
      this.sipTransaction.get('frequency').markAsTouched();
    } else if (this.sipTransaction.controls.modeOfPaymentSelection.value == '2' && !this.selectedMandate) {
      this.eventService.openSnackBar('No mandate found. Please change payment mode.');
    } else {
      return true;
    }
    return false;
  }

  sipBSERes(data) {

    this.barButtonOptions.active = false;
    if (data == undefined) {

    } else {
      this.processTransaction.onAddTransaction('confirm', this.transactionSummary);
      Object.assign(this.transactionSummary, {allEdit: false});
    }
  }

  setDefaultTenure() {
    if (this.getDataSummary.defaultClient.aggregatorType == 1) {
      this.sipTransaction.controls.tenure.setValue('3');
    } else {
      this.sipTransaction.controls.tenure.setValue('2');
    }
  }

  AddMultiTransaction() {
    if (this.validateSingleTransaction()) {
      Object.assign(this.transactionSummary, {multiTransact: true});
      this.multiTransact = true;
      if (this.isEdit != true) {
        this.id++;
      }
      this.multiTransact = true;
      if (this.scheme != undefined && this.schemeDetails != undefined && this.sipTransaction != undefined) {
        if (this.isEdit == true) {
          this.childTransactions.forEach(element => {
            if (element.id == this.editedId) {
              element.id = this.editedId;
              element.date = this.sipTransaction.controls.date.value;
              element.mutualFundSchemeMasterId = this.scheme.mutualFundSchemeMasterId;
              element.amcId = this.scheme.amcId;
              element.folioNo = this.sipTransaction.get('investmentAccountSelection').value;
              element.orderVal = this.sipTransaction.get('employeeContry').value;
              element.schemeName = this.scheme.schemeName;
              element.schemeSelection = this.sipTransaction.get('schemeSelection').value;
              element.folioSelection = this.sipTransaction.get('folioSelection').value;
              element.modeOfPaymentSelection = this.sipTransaction.get('modeOfPaymentSelection').value;
              element.scheme = this.scheme;
              element.schemeDetails = this.schemeDetails;
              element.reInvestmentOpt = this.reInvestmentOpt;
              element.folioDetails = this.folioDetails;
              element.selectedFreqModel = this.selectedFreqModel;
              element.sipFrequency = this.sipFrequency;
              element.scheme = this.scheme;
              element.schemeDetails = this.schemeDetails;
              element.reInvestmentOpt = this.reInvestmentOpt;
              element.folioDetails = this.folioDetails;
            }
          });
          this.isEdit = false;
        } else {
          const obj = this.getSingleTransactionJson();
          this.childTransactions.push(obj);
        }
        // Only once required because for same amcId search
        if (this.childTransactions.length == 1) {
          this.schemeList = [];
          if (this.selectScheme == 1) {
            this.getExistingScheme();
          } else {
          }
        }
        this.dataSource.data = this.childTransactions;
        this.navOfSelectedScheme = 0;
        this.scheme = undefined;
        this.schemeDetails = undefined;
        this.reInvestmentOpt = [];
        this.folioDetails = undefined;
        this.folioList = [];
        this.onFolioChange(undefined);
        this.sipTransaction.controls.date.reset();
        this.dateDisplay = [];
        // this.sipTransaction.controls.tenure.reset();
        this.sipTransaction.controls.installment.reset();
        this.sipTransaction.controls.frequency.reset();
        this.sipTransaction.controls.employeeContry.reset();
        this.sipTransaction.controls.investmentAccountSelection.reset();
        this.sipTransaction.controls.schemeSip.reset();
        this.setDefaultTenure();
      }

    }
  }

  checkAndHandleMaxInstallmentValidator() {
    if (this.sipTransaction.controls.modeOfPaymentSelection.value == '2' && this.selectedMandate &&
      !this.sipTransaction.get('date').invalid && !this.sipTransaction.get('frequency').invalid) {
      setTimeout(() => {
        const maxInstallmentNumber = this.calculateMaxInstallmentNumber(new Date(this.sipTransaction.get('date').value).getTime(),
          this.selectedMandate.toDate, this.sipTransaction.get('frequency').value, this.sipTransaction.get('tenure').value);
        this.sipTransaction.controls.installment.setValidators([Validators.required, Validators.max(maxInstallmentNumber)]);
        this.installmentErrorMessage = 'Installment number cannot be greater than ' + MathUtilService.roundOffNumber(maxInstallmentNumber);
        this.sipTransaction.controls.installment.updateValueAndValidity();

      }, 1000);
    } else {
      this.sipTransaction.controls.installment.clearValidators();
      this.sipTransaction.controls.installment.clearAsyncValidators();
      if (this.sipTransaction.controls.tenure == '3') {

      } else {
        this.sipTransaction.controls.installment.setValidators([Validators.required]);
      }
      this.sipTransaction.controls.installment.updateValueAndValidity();
    }
  }

  calculateMaxInstallmentNumber(sipStartDate, mandateEndDate, frequencyType, tenure) {
    const difference = mandateEndDate - sipStartDate;
    const differenceInDays = difference / (1000 * 3600 * 24);
    const differenceInMonths = differenceInDays / 30;
    const differenceInWeeks = differenceInDays / 7;
    const differenceInYear = differenceInDays / 365;

    if (tenure == 2) {
      return differenceInYear;
    } else if (frequencyType == 'MONTHLY') {
      return differenceInMonths;
    } else if (frequencyType == 'QUATERLY') {
      return differenceInMonths / 3;
    } else if ((frequencyType == 'WEEKLY' || frequencyType == 'ONCE_IN_A_WEEK')) {
      return differenceInWeeks;
    } else if (frequencyType == 'YEARLY') {
      return differenceInYear;
    } else if (frequencyType == 'BUSINESS_DAY') {
      return differenceInDays;
    } else {
      return differenceInMonths;
    }
  }

  resetForm() {
    this.scheme = undefined;
    this.schemeList = undefined;
    this.reInvestmentOpt = [];
    this.schemeDetails = undefined;
    this.folioList = [];
    this.folioDetails = undefined;
    this.onFolioChange(undefined);
    this.frequency = undefined;
    this.sipFrequency = [];
    this.navOfSelectedScheme = 0;
    this.dateDisplay = [];
    (this.schemeDetails) ? (this.schemeDetails.minAmount = 0) : 0;
    Object.assign(this.transactionSummary, {schemeName: ''}); // to disable scheme name from transaction summary
    Object.assign(this.transactionSummary, {folioNumber: ''});
    this.sipTransaction.controls.reinvest.setValue('');
    this.sipTransaction.controls.employeeContry.reset();
    this.sipTransaction.controls.investmentAccountSelection.setValue('');
    this.sipTransaction.controls.schemePurchase.reset();
    this.sipTransaction.controls.schemePurchase.reset();
    this.sipTransaction.controls.frequency.setValue('');
    this.setDefaultTenure();
  }

  removeUnnecessaryDataFromJson(singleTransactionJson) {
    singleTransactionJson.schemeSelection = undefined;
    singleTransactionJson.folioSelection = undefined;
    singleTransactionJson.modeOfPaymentSelection = undefined;
    singleTransactionJson.scheme = undefined;
    singleTransactionJson.schemeDetails = undefined;
    singleTransactionJson.reInvestmentOpt = undefined;
    singleTransactionJson.folioDetails = undefined;
    singleTransactionJson.sipFrequency = undefined;
    singleTransactionJson.scheme = undefined;
    singleTransactionJson.schemeDetails = undefined;
    singleTransactionJson.reInvestmentOpt = undefined;
    singleTransactionJson.folioDetails = undefined;
    singleTransactionJson.selectedFreqModel = undefined;
  }
}
