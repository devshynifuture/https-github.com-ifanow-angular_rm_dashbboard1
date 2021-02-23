import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { OnlineTransactionService } from '../../../online-transaction.service';
import { ProcessTransactionService } from '../process-transaction.service';
import { EventService } from 'src/app/Data-service/event.service';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { MultiTransactionPopupComponent } from '../multi-transaction-popup/multi-transaction-popup.component';
import { EnumDataService } from "../../../../../../../services/enum-data.service";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-purchase-trasaction',
  templateUrl: './purchase-trasaction.component.html',
  styleUrls: ['./purchase-trasaction.component.scss']
})
export class PurchaseTrasactionComponent implements OnInit {

  isSuccessfulTransaction = false;
  oldDefaultData;
  schemeName: any;
  folioNumber: any;
  mutualFundData: any;
  mfDefault: any;
  disabledScheme = true;
  acceptedMandate: any;
  element: any;

  constructor(public processTransaction: ProcessTransactionService, private onlineTransact: OnlineTransactionService,
    private subInjectService: SubscriptionInject, private fb: FormBuilder,
    private eventService: EventService,
    private utilService: UtilService,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private customerService: CustomerService,
    public enumDataService: EnumDataService) {
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
  };
  mandateDetails = [];
  purchaseTransaction: any;
  ownerData: any;
  inputData: any;
  existingSchemeList = [];
  isViewInitCalled = false;
  selectedFamilyMember: any;
  confirmTrasaction = false;
  transactionType: any;
  folioSelection: [2];
  schemeSelection: [2];
  platformType;
  selectScheme = 2;
  schemeList: any;
  schemeDetails: any;
  reInvestmentOpt = [];
  transactionSummary: any;
  ExistingOrNew: any = '2';
  maiSchemeList: any;
  getDataSummary: any;
  scheme: any;
  folioList: any;
  folioDetails: any;
  showSpinner = false;
  bankDetails: any;
  selectedMandate: any;
  callOnFolioSelection: boolean;
  showSpinnerMandate = false;
  showSpinnerFolio = false;
  childTransactions = [];
  dataSource = new MatTableDataSource(this.childTransactions);

  multiTransact = false;
  schemeInput: any;
  showError = false;
  id = 0;
  isEdit = false;
  editedId: any;
  noFolio: string;
  displayedColumns: string[] = ['no', 'folio', 'ownerName', 'amount', 'icons'];
  @Output() changedValue = new EventEmitter();
  validatorType = ValidatorType;
  filterSchemeList: Observable<any[]>;

  @Input()
  set data(data) {
    this.inputData = data;
    this.setDefaultData(this.inputData)
    if (data.mutualFundData) {
      this.handleMutualFundData(data)
    }
  }

  ngOnInit() {
    this.transactionSummary = {};
    this.childTransactions = [];
    this.getdataForm(this.inputData, false);
    this.assignToTransactionSummary()
  }


  assignToTransactionSummary() {
    Object.assign(this.transactionSummary, { familyMemberId: this.inputData.familyMemberId });
    Object.assign(this.transactionSummary, { clientId: this.inputData.clientId });
    Object.assign(this.transactionSummary, { selectedFamilyMember: this.inputData.selectedFamilyMember });
    Object.assign(this.transactionSummary, { paymentMode: 1 });
    Object.assign(this.transactionSummary, { allEdit: true });
    Object.assign(this.transactionSummary, { transactType: 'PURCHASE' });
    Object.assign(this.transactionSummary, { changeDetails: this.inputData.transactionData });
    Object.assign(this.transactionSummary, { isAdvisorSection: this.inputData.isAdvisorSection });
    Object.assign(this.transactionSummary, { multiTransact: false });
  }

  setDefaultData(data) {
    this.folioList = [];
    this.reInvestmentOpt = [];
    this.schemeList = [];
    this.transactionSummary = {};
    console.log('default', this.inputData);
    this.transactionSummary = this.inputData.transactionData;
    this.getDataSummary = this.inputData.transactionData;
    this.platformType = this.getDataSummary.defaultClient.aggregatorType;
    this.transactionType = data.transactionType;
    this.selectedFamilyMember = data.selectedFamilyMember;
  }

  handleMutualFundData(data) {
    this.schemeName = data.mutualFundData.schemeName;
    this.scheme = data.mutualFundData
    this.folioNumber = data.mutualFundData.folioNumber;
    this.mfDefault = data.transactionData;
    const foilo = { folioNumber: this.folioNumber };
    this.folioList.push(foilo);
    this.filterSchemeList = of([{ schemeName: this.schemeName }]);
    Object.assign(this.transactionSummary, { folioNumber: this.folioNumber });
    Object.assign(this.transactionSummary, { schemeName: this.schemeName });
    this.ExistingOrNew = 1;
    this.mutualFundData = data.mutualFundData;
  }
  selectSchemeOption(value) {
    if (value == '2') {
      this.existingSchemeList = [];
    }
    this.selectExistingOrNewFolio(value);
    this.scheme = undefined;
    this.schemeList = undefined;
    this.purchaseTransaction.controls.schemePurchase.reset();
    this.folioList = [];
    this.purchaseTransaction.get('employeeContry').setValue('');
    (this.schemeDetails) ? (this.schemeDetails.minAmount = 0) : 0;
    Object.assign(this.transactionSummary, { schemeName: '' }); // to disable scheme name from transaction summary
    Object.assign(this.transactionSummary, { folioNumber: '' }); // to disable folio number from transaction summary
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
    console.log('Purchase getschemelist data : ', data);
    if (data == '') {
      this.scheme = undefined;
      this.purchaseTransaction.controls.employeeContry.setValidators([Validators.min(0)]);
      this.purchaseTransaction.controls.employeeContry.setValue();
      this.schemeDetails.minAmount = 0;
      return;
    }
    if (this.purchaseTransaction.get('schemePurchase').invalid) {
      this.showSpinner = false;
      this.folioList = [];
      Object.assign(this.transactionSummary, { schemeName: '' }); // to disable scheme name from transaction summary
      Object.assign(this.transactionSummary, { folioNumber: '' }); // to disable folio number from transaction summary
      (this.schemeDetails) ? (this.schemeDetails.minAmount = 0) : 0; // if scheme not present then min amt is 0
    }
    const amcId = 0;
    const obj = {
      amcId,
      searchQuery: data,
      bseOrderType: 'ORDER',
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      advisorId: this.getDataSummary.defaultClient.advisorId,
      tpUserCredentialId: this.getDataSummary.defaultClient.tpUserCredentialId,
      familyMemberId: this.getDataSummary.defaultClient.familyMemberId,
      clientId: this.getDataSummary.defaultClient.clientId,
      userAccountType: this.getDataSummary.defaultClient.accountType,
      holdingType: this.getDataSummary.defaultClient.holdingType,
      tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId,
    };
    if (this.selectScheme == 2) {
      if (data.length > 2) {
        this.showSpinner = true;
        this.onlineTransact.getNewSchemes(obj).subscribe(
          responseData => this.getNewSchemesRes(responseData, data), (error) => {
            this.showSpinner = false;
            this.purchaseTransaction.get('schemePurchase').setErrors({ setValue: error });
            this.purchaseTransaction.get('schemePurchase').markAsTouched();
            (this.schemeDetails) ? (this.schemeDetails.minAmount = 0) : 0;
          }
        );
      }
    }
  }

  getNewSchemesRes(responseData, inputData) {
    this.showSpinner = false;
    this.schemeList = responseData;
    this.filterSchemeList = new Observable().pipe(startWith(''),
      map(value => this.processTransaction.filterScheme(this.purchaseTransaction.controls.schemePurchase.value, this.schemeList)));
  }

  getExistingSchemesRes(data) {
    this.showSpinner = false;
    this.existingSchemeList = data;
    this.schemeList = this.existingSchemeList;
    this.purchaseTransaction.controls.schemePurchase.setValue('');
  }

  reinvest(scheme) {
    console.log('purchase reinvest flag selection scheme :', scheme);
    this.schemeDetails = scheme;
    this.setMinAmount();
  }

  selectExistingOrNewFolio(value) {
    this.ExistingOrNew = value;
    this.purchaseTransaction.controls.folioSelection.setValue(value);
    if (value == '2') {
      this.setMinAmount();
      Object.assign(this.transactionSummary, { folioNumber: '' });
    } else {
      if (this.scheme) {
        this.getFolioList();
      }
    }
  }

  getbankDetails(bank) {
    this.bankDetails = bank;
  }

  onFolioChange(folio) {
    this.purchaseTransaction.controls.investmentAccountSelection.setValue('');
  }

  selectedScheme(scheme) {
    this.scheme = scheme;
    this.scheme.navDate = this.datePipe.transform(scheme.navDate, 'dd-MM-yyyy'),
      this.folioList = [];
    this.folioDetails = null;
    this.reInvestmentOpt = [];
    this.schemeDetails = null;
    this.onFolioChange(null);
    Object.assign(this.transactionSummary, { schemeName: scheme.schemeName });
    const obj1 = {
      mutualFundSchemeMasterId: scheme.mutualFundSchemeMasterId,
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      orderType: 'ORDER',
      userAccountType: this.getDataSummary.defaultClient.accountType,
    };
    this.onlineTransact.getSchemeDetails(obj1).subscribe(
      data => this.getSchemeDetailsRes(data), (error) => {
        this.eventService.openSnackBar(error, 'Dismiss');
      }
    );
  }

  getSchemeDetailsRes(data) {
    if (!data) {
      this.eventService.openSnackBarNoDuration('Not able to find MF scheme details, Please contact with support team', 'DISMISS');
    }
    this.showSpinner = false;
    this.maiSchemeList = data;
    this.schemeDetails = data[0];
    this.setMinAmount();
    this.schemeDetails.selectedFamilyMember = this.selectedFamilyMember;
    if (data.length > 1) {
      this.reInvestmentOpt = data;
    }
    if (data.length == 1) {
      this.reInvestmentOpt = [];
    }
    if (this.purchaseTransaction.controls.folioSelection.value == '1' && !this.mutualFundData) {
      this.getFolioList();
    }
  }

  setMinAmount() {
    if (!this.schemeDetails) {
      return;
    } else if (this.purchaseTransaction.get('schemeSelection').value == '2' && this.schemeDetails) {
      this.schemeDetails.minAmount = this.schemeDetails.minimumPurchaseAmount;
    } else if (this.ExistingOrNew == 1) {
      this.schemeDetails.minAmount = this.schemeDetails.additionalPurchaseAmount;
    } else {
      this.schemeDetails.minAmount = this.schemeDetails.minimumPurchaseAmount;
    }
    if (this.selectedMandate) {
      Object.assign(this.transactionSummary, { umrnNo: this.selectedMandate.umrnNo });
      Object.assign(this.transactionSummary, { selectedMandate: this.selectedMandate });
      if (this.purchaseTransaction.controls.modeOfPaymentSelection.value == '2') {
        this.purchaseTransaction.controls.employeeContry.setValidators([Validators.required, Validators.min(this.schemeDetails.minAmount),
        Validators.max(this.selectedMandate.amount)]);
        this.purchaseTransaction.controls.employeeContry.updateValueAndValidity();
      } else {
        this.purchaseTransaction.controls.employeeContry.setValidators([Validators.required, Validators.min(this.schemeDetails.minAmount)]);
      }
    } else if (this.schemeDetails) {
      this.purchaseTransaction.controls.employeeContry.setValidators([Validators.required, Validators.min(this.schemeDetails.minAmount)]);
    }// this.purchaseTransaction.updateValueAndValidity();
  }

  getFolioList() {
    this.showSpinnerFolio = true;
    const obj1 = {
      mutualFundSchemeMasterId: this.scheme.mutualFundSchemeMasterId,
      amcId: (this.scheme) ? this.scheme.amcId : null,
      advisorId: this.getDataSummary.defaultClient.advisorId,
      familyMemberId: this.getDataSummary.defaultClient.familyMemberId,
      clientId: this.getDataSummary.defaultClient.clientId,
      userAccountType: this.getDataSummary.defaultClient.accountType,
      holdingType: this.getDataSummary.defaultClient.holdingType,
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
    };
    if (this.purchaseTransaction.get('schemeSelection').value == '2') {
      this.onlineTransact.getFoliosAmcWise(obj1).subscribe(
        data => {
          this.getFoliosAmcWiseRes(data);
          this.setMinAmount();
        }, (error) => {
          this.purchaseTransaction.get('folioSelection').setValue('2');
          this.ExistingOrNew = 2;
          this.eventService.openSnackBar(error, 'Dismiss');
          this.setMinAmount();

        }
      );
    } else {
      /**Schemewise folio for addtional purchase*/
      this.onlineTransact.getSchemeWiseFolios(obj1).subscribe(
        data => {
          this.getFoliosAmcWiseRes(data);
          this.setMinAmount();
        }, (error) => {
          this.purchaseTransaction.get('folioSelection').setValue('2');
          this.ExistingOrNew = 2;
          this.eventService.openSnackBar(error, 'Dismiss');
          this.setMinAmount();

        }
      );
    }
  }

  backToTransact() {
    this.changedValue.emit('step-2');
  }

  getFoliosAmcWiseRes(data) {
    this.showSpinnerFolio = false;
    if (data) {
      this.folioList = data;
      if (this.folioList.length == 1) {
        this.purchaseTransaction.controls.investmentAccountSelection.setValue(this.folioList[0].folioNumber);
        this.selectedFolio(this.folioList[0]);
        if (this.purchaseTransaction.get('investmentAccountSelection').valid) {
          Object.assign(this.transactionSummary, { folioNumber: this.folioList[0].folioNumber });
        }
      }
    } else {
      this.purchaseTransaction.get('folioSelection').setValue('2');
      this.noFolio = 'No existing folios';
      this.ExistingOrNew = 2;
    }
  }

  selectedFolio(folio) {
    this.folioDetails = folio;
    Object.assign(this.transactionSummary, { folioNumber: folio.folioNumber });
    Object.assign(this.transactionSummary, { tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId });
  }

  enteredAmount(value) {
    Object.assign(this.transactionSummary, { enteredAmount: value });
    Object.assign(this.transactionSummary, { Ttype: 1 });

  }

  getDefaultDetails(data) {
    this.getDataSummary = data;

    if (this.oldDefaultData) {
      this.checkAndResetForm(this.oldDefaultData, this.getDataSummary);
    }

    Object.assign(this.transactionSummary, { aggregatorType: this.getDataSummary.defaultClient.aggregatorType });
    this.platformType = this.getDataSummary.defaultClient.aggregatorType;
    if (this.selectScheme == 1 && !(this.existingSchemeList && this.existingSchemeList.length > 0)) {
      this.getExistingScheme();
    } else {
      this.purchaseTransaction.controls.schemePurchase.reset();
      this.filterSchemeList = new Observable<any[]>();
    }
    if (this.purchaseTransaction.controls.modeOfPaymentSelection.value == '2') {
      this.getMandateDetails();
    }
    this.oldDefaultData = data;
  }

  checkAndResetForm(oldData, newData) {
    if (oldData.defaultCredential.accountType != newData.defaultCredential.accountType) {
      if (!this.mutualFundData) {
        this.resetForm();
      } else {
        this.mfDefault = newData;
        this.getdataForm(this.inputData, true);
      }
      this.existingSchemeList = [];
    } else if (oldData.defaultClient.holdingType != newData.defaultClient.holdingType) {
      if (this.selectScheme == 1) {
        this.resetForm();
        this.existingSchemeList = [];
      } else {
        this.folioList = [];
        this.onFolioChange(null);
        this.selectExistingOrNewFolio(this.ExistingOrNew);
      }
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
    (this.schemeDetails) ? (this.schemeDetails.minAmount = 0) : 0;
    Object.assign(this.transactionSummary, { schemeName: '' }); // to disable scheme name from transaction summary
    Object.assign(this.transactionSummary, { folioNumber: '' });
    Object.assign(this.transactionSummary, { enteredAmount: '' });
    this.purchaseTransaction.controls.reinvest.setValue('');
    this.purchaseTransaction.controls.employeeContry.reset();
    this.purchaseTransaction.controls.investmentAccountSelection.reset();
    this.purchaseTransaction.controls.schemePurchase.reset();
  }

  getExistingScheme() {
    this.showSpinner = true;
    const amcId = 0;
    // if (this.childTransactions && this.childTransactions.length > 0) {
    //   amcId = this.childTransactions[0].amcId;
    // }
    const obj = {
      amcId,
      bseOrderType: 'ORDER',
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      advisorId: this.getDataSummary.defaultClient.advisorId,
      tpUserCredentialId: this.getDataSummary.defaultClient.tpUserCredentialId,
      familyMemberId: this.getDataSummary.defaultClient.familyMemberId,
      clientId: this.getDataSummary.defaultClient.clientId,
      userAccountType: this.getDataSummary.defaultClient.accountType,
      holdingType: this.getDataSummary.defaultClient.holdingType,
      tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId,
    };
    this.onlineTransact.getExistingSchemes(obj).subscribe(
      data => this.getExistingSchemesRes(data), (error) => {
        this.showSpinner = false;
        this.purchaseTransaction.get('schemePurchase').setErrors({ setValue: error.message });
        this.purchaseTransaction.get('schemePurchase').markAsTouched();
        (this.schemeDetails) ? (this.schemeDetails.minAmount = 0) : 0;
        // this.eventService.openSnackBar(error, 'Dismiss');
      }
    );
  }

  selectPaymentMode(value) {
    Object.assign(this.transactionSummary, { paymentMode: value });
    if (value == 2) {
      Object.assign(this.transactionSummary, { getAch: true });
      this.getMandateDetails();
    } else {
      this.purchaseTransaction.controls.employeeContry.clearValidators();
      this.purchaseTransaction.controls.employeeContry.clearAsyncValidators();

      this.purchaseTransaction.controls.employeeContry.setValidators([Validators.required, Validators.min(this.schemeDetails.minAmount)]);
      this.purchaseTransaction.controls.employeeContry.updateValueAndValidity();
    }

  }

  getMandateDetails() {
    this.showSpinnerMandate = true;
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
    this.selectedMandate = null;
    this.eventService.openSnackBar('No mandate found', 'Dismiss');
    this.purchaseTransaction.controls.modeOfPaymentSelection.setValue('1');
  }

  getMandateDetailsRes(data) {
    if (data) {
      this.acceptedMandate = [];
      this.mandateDetails = this.processTransaction.filterActiveMandateData(data);
      if (!this.mandateDetails || this.mandateDetails.length == 0) {
        this.handleMandateFailure();
        return;
      }
    } else {
      this.handleMandateFailure();
    }
    this.showSpinnerMandate = false;
    if (data.length > 0) {
      let keepGoing = true;
      data.forEach(element => {
        if (keepGoing && (element.statusString == 'ACCEPTED' || element.statusString == 'APPROVED')) {
          this.acceptedMandate.push(element);
          this.selectedMandate = element;
          keepGoing = false;
          Object.assign(this.transactionSummary, { showUmrnEdit: true });
          Object.assign(this.transactionSummary, { acceptedMandate: this.acceptedMandate });
        } else {
          if (keepGoing != false && (this.bankDetails.ifscCode == element.ifscCode)) {
            this.selectedMandate = element;
          }
        }
      });
    }
    // this.selectedMandate = this.processTransaction.getMaxAmountMandate(this.mandateDetails);
    if (this.selectedMandate) {
      Object.assign(this.transactionSummary, { umrnNo: this.selectedMandate.umrnNo });
      Object.assign(this.transactionSummary, { selectedMandate: this.selectedMandate });
      this.setMinAmount();
    }
  }

  close() {
    this.subInjectService.changeNewRightSliderState({
      state: 'close',
      refreshRequired: this.isSuccessfulTransaction
    });
  }

  getdataForm(data, isEdit) {
    if (isEdit == true) {
      this.isEdit = isEdit;
      this.editedId = data.id;
      this.scheme = data.scheme;
      this.schemeDetails = data.schemeDetails;
      if (data.reInvestmentOpt) {
        this.reInvestmentOpt = data.reInvestmentOpt;
      }
      this.folioDetails = data.folioDetails;
    }
    if (!data) {
      data = {};
    }
    this.purchaseTransaction = this.fb.group({
      ownerName: [(!data) ? '' : data.ownerName, [Validators.required]],
      transactionType: [(!data) ? '' : data.transactionType, [Validators.required]],
      bankAccountSelection: [(!data) ? '' : data.bankAccountSelection, [Validators.required]],
      schemeSelection: [(!data.schemeSelection) ? '2' : data.schemeSelection],
      employeeContry: [(!data) ? '' : data.orderVal, [Validators.required,]],
      investmentAccountSelection: [(data.folioNumber) ? data.folioNumber : (this.mutualFundData) ? this.mutualFundData.folioNumber : '', [Validators.required]],
      modeOfPaymentSelection: [(!data.modeOfPaymentSelection) ? '1' : data.modeOfPaymentSelection],
      folioSelection: [(!data.folioSelection) ? '2' : data.folioSelection],
      selectInvestor: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      reinvest: [(data.dividendReinvestmentFlag) ? data.dividendReinvestmentFlag : '', [Validators.required]],
      schemePurchase: [(data.scheme) ? data.scheme.schemeName : this.mutualFundData ? this.mutualFundData.schemeName : '', [Validators.required]],
    });
    this.purchaseTransaction.controls.schemePurchase.valueChanges.subscribe((newValue) => {
      this.filterSchemeList = of(this.schemeList).pipe(startWith(''),
        map(value => this.processTransaction.filterScheme(newValue + '', this.schemeList)));
    });
    this.purchaseTransaction.controls.schemePurchase.setValue({ schemeName: (data.scheme) ? data.scheme.schemeName : '' });
    this.ownerData = this.purchaseTransaction.controls;
    if (data.folioNo) {
      this.getFolioList();
    }
    if (this.mutualFundData) {
      this.mutualFundSchemeDetails()
    }
  }
  mutualFundSchemeDetails() {
    this.folioDetails = {};
    Object.assign(this.mutualFundData, { disabledScheme: true });
    this.disabledScheme = true;
    this.purchaseTransaction.controls.schemeSelection.setValue('1');
    this.purchaseTransaction.controls.folioSelection.setValue('1');
    this.purchaseTransaction.controls.schemePurchase.setValue({ schemeName: this.schemeName });
    this.purchaseTransaction.controls.schemePurchase.disable();
    this.filterSchemeList = of([{ schemeName: this.schemeName }]);
    Object.assign(this.folioDetails, { folioNumber: this.folioNumber });
    this.scheme.mutualFundSchemeMasterId = this.mutualFundData.schemeId
    const obj1 = {
      mutualFundSchemeMasterId: this.mutualFundData.schemeId,
      aggregatorType: this.mfDefault.defaultClient.aggregatorType,
      orderType: 'ORDER',
      userAccountType: this.mfDefault.defaultClient.accountType,
    };
    this.onlineTransact.getSchemeDetails(obj1).subscribe(
      data => this.getSchemeDetailsRes(data), (error) => {
        this.eventService.openSnackBar(error, 'Dismiss');
      }
    );
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

  getFormControl(): any {
    return this.purchaseTransaction.controls;
  }

  validateSinglePurchase() {
    if (this.purchaseTransaction.get('folioSelection').invalid) {
      this.purchaseTransaction.get('folioSelection').markAsTouched();
    } else if (this.purchaseTransaction.get('employeeContry').invalid) {
      this.purchaseTransaction.get('employeeContry').markAsTouched();
    } else if (this.reInvestmentOpt.length > 1 && this.purchaseTransaction.get('reinvest').invalid) {
      this.purchaseTransaction.get('reinvest').markAsTouched();
    } else if (this.ExistingOrNew == 1 && this.purchaseTransaction.get('investmentAccountSelection').invalid) {
      this.purchaseTransaction.get('investmentAccountSelection').markAsTouched();
    } else if (this.purchaseTransaction.controls.modeOfPaymentSelection.value == '2' && !this.selectedMandate) {
      this.eventService.openSnackBar('No mandate found. Please change payment mode.');
    } else {
      return true;
    }

    return false;
  }

  getSingleTransactionJson() {
    this.selectedMandate = this.transactionSummary.selectedMandate;
    const obj = {
      productDbId: (this.schemeDetails.id) ? this.schemeDetails.id : 999999,
      clientName: this.selectedFamilyMember,
      holdingType: this.getDataSummary.defaultClient.holdingType,
      mutualFundSchemeMasterId: (this.scheme) ? this.scheme.mutualFundSchemeMasterId : this.mutualFundData.schemeId,
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
      buySellType: (this.purchaseTransaction.controls.folioSelection.value == '1') ? 'ADDITIONAL' : 'FRESH',
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
      isException: true,
      tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId,
      schemeName: this.scheme.schemeName,
      amcId: (this.scheme) ? this.scheme.amcId : null,
      schemeSelection: this.purchaseTransaction.get('schemeSelection').value,
      folioSelection: this.purchaseTransaction.get('folioSelection').value,
      modeOfPaymentSelection: this.purchaseTransaction.get('modeOfPaymentSelection').value,
      scheme: this.scheme,
      schemeDetails: this.schemeDetails,
      reInvestmentOpt: this.reInvestmentOpt,
      folioDetails: this.folioDetails,
    };
    if (this.getDataSummary.defaultClient.aggregatorType == 1) {
      obj.mandateId = (this.selectedMandate == undefined) ? null : this.selectedMandate.id;
      obj.bankDetailId = this.bankDetails.id;
    }
    obj.nsePaymentMode = (this.purchaseTransaction.controls.modeOfPaymentSelection.value == 2) ? 'DEBIT_MANDATE' : 'ONLINE';
    if (this.platformType == 1 && obj.folioNo) {
      obj.folioNo = obj.folioNo.split('/')[0];
    }
    return obj;
  }

  purchase() {
    if (this.multiTransact == true) {
      const dialogRef = this.dialog.open(MultiTransactionPopupComponent, {
        width: '750px',
        data: { childTransactions: this.childTransactions, dataSource: this.dataSource.data }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == undefined) {
          return;
        }
        this.element = result;
        console.log('result', this.element);
        if (this.element == true) {
          let obj;
          obj = this.childTransactions[this.childTransactions.length - 1];
          obj.childTransactions = [];
          const myArray = this.childTransactions;
          const list = [];
          myArray.forEach(val => list.push(Object.assign({}, val)));
          this.childTransactions.forEach(singleTranJson => {
            this.removeUnnecessaryDataFromJson(singleTranJson);
          });
          this.barButtonOptions.active = true;
          obj.childTransactions = list;
          this.onlineTransact.transactionBSE(obj).subscribe(
            data => {
              this.purchaseRes(data);
              this.isSuccessfulTransaction = true;
            }, (error) => {
              this.barButtonOptions.active = false;
              this.eventService.openSnackBar(error, 'Dismiss', null, 60000);
            }
          );
        }
      });
    } else {
      if (this.validateSinglePurchase()) {
        if (this.barButtonOptions.active) {
          return;
        }
        this.barButtonOptions.active = true;
        const obj = this.getSingleTransactionJson();
        this.removeUnnecessaryDataFromJson(obj);
        console.log('purchase obj: ', JSON.stringify(obj));
        this.onlineTransact.transactionBSE(obj).subscribe(
          data => {
            this.purchaseRes(data);
            this.isSuccessfulTransaction = true;
          }, (error) => {
            this.barButtonOptions.active = false;
            this.eventService.openSnackBar(error, 'Dismiss', null, 60000);
          }
        );

      }
    }

  }

  purchaseRes(data) {
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
    this.utilService.scrollToTopForRightSlider();
    if (this.validateSinglePurchase()) {
      if (this.isEdit != true) {
        this.id++;
      }
      this.multiTransact = true;
      Object.assign(this.transactionSummary, { multiTransact: this.multiTransact });

      if (this.scheme != undefined && this.schemeDetails != undefined) {

        if (this.isEdit == true) {
          this.childTransactions.forEach(element => {
            if (element.id == this.editedId) {
              element.id = this.editedId;
              element.amcId = (this.scheme) ? this.scheme.amcId : null;
              element.folioNo = this.purchaseTransaction.get('investmentAccountSelection').value;
              element.orderVal = this.purchaseTransaction.get('employeeContry').value;
              element.schemeSelection = this.purchaseTransaction.get('schemeSelection').value;
              element.folioSelection = this.purchaseTransaction.get('folioSelection').value;
              element.modeOfPaymentSelection = this.purchaseTransaction.get('modeOfPaymentSelection').value;
              element.schemeName = this.scheme.schemeName;
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
        if (this.childTransactions.length == 1) {
          this.schemeList = [];
          if (this.selectScheme == 1) {
            this.getExistingScheme();
          } else {
          }
        }
        this.dataSource.data = this.childTransactions;
        this.scheme = null;
        this.schemeDetails = null;
        this.reInvestmentOpt = [];
        this.folioDetails = null;
        this.folioList = [];
        this.onFolioChange(null);
        this.purchaseTransaction.controls.reinvest.setValue('');
        this.purchaseTransaction.controls.employeeContry.reset();
        this.purchaseTransaction.controls.investmentAccountSelection.reset();
        this.purchaseTransaction.controls.schemePurchase.reset();
        Object.assign(this.transactionSummary, { schemeName: '' }); // to disable scheme name from transaction summary
        Object.assign(this.transactionSummary, { folioNumber: '' });
        Object.assign(this.transactionSummary, { enteredAmount: '' });
      }
    }
  }

  removeUnnecessaryDataFromJson(singleTransactionJson) {
    singleTransactionJson.childTransactions = null;
    singleTransactionJson.schemeSelection = null;
    singleTransactionJson.folioSelection = null;
    singleTransactionJson.modeOfPaymentSelection = null;
    singleTransactionJson.scheme = null;
    singleTransactionJson.schemeDetails = null;
    singleTransactionJson.reInvestmentOpt = null;
    singleTransactionJson.folioDetails = null;

  }
}
