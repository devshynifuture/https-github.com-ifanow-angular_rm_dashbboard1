import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SubscriptionInject} from '../../../../Subscriptions/subscription-inject.service';
import {FormBuilder, Validators} from '@angular/forms';
import {OnlineTransactionService} from '../../../online-transaction.service';
import {EventService} from 'src/app/Data-service/event.service';
import {ProcessTransactionService} from '../process-transaction.service';
import {MatProgressButtonOptions} from 'src/app/common/progress-button/progress-button.component';
import {UtilService, ValidatorType} from 'src/app/services/util.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-redemption-transaction',
  templateUrl: './redemption-transaction.component.html',
  styleUrls: ['./redemption-transaction.component.scss']
})
export class RedemptionTransactionComponent implements OnInit {

  oldDefaultData;

  constructor(private subInjectService: SubscriptionInject, private onlineTransact: OnlineTransactionService,
              private fb: FormBuilder, private eventService: EventService,
              public processTransaction: ProcessTransactionService) {
  }

  get data() {
    return this.inputData;
  }

  amcId;
  isSuccessfulTransaction = false;

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
  ownerData: any;
  redemptionTransaction: any;
  inputData: any;
  selectedFamilyMember: any;
  isViewInitCalled = false;
  showSpinner = false;
  transactionType: any;
  getDataSummary: any;
  schemeList: any;
  scheme: any;
  maiSchemeList: any;
  reInvestmentOpt: [];
  schemeDetails: any;
  navOfSelectedScheme: any;
  transactionSummary: {};
  folioList: any = [];
  folioDetails: any;
  showUnits = false;
  bankDetails: any;
  showSpinnerFolio = false;
  platformType;
  currentValue;
  multiTransact = false;
  id = 0;
  isEdit = false;
  childTransactions = [];
  dataSource = new MatTableDataSource(this.childTransactions);
  displayedColumns: string[] = ['no', 'folio', 'ownerName', 'amount', 'icons'];
  editedId: any;
  validatorType = ValidatorType;
  filterSchemeList: Observable<any[]>;
  folioNumberShow: any;

  @Output() changedValue = new EventEmitter();

  @Input()
  set data(data) {
    this.inputData = data;
    this.transactionType = data.transactionType;
    this.selectedFamilyMember = data.selectedFamilyMember;

    if (this.isViewInitCalled) {
      // this.getdataForm('');
    }
  }

  ngOnInit() {

    this.getdataForm(this.inputData, false);
    this.transactionSummary = {};
    this.childTransactions = [];
    this.reInvestmentOpt = [];
    Object.assign(this.transactionSummary, {familyMemberId: this.inputData.familyMemberId});
    Object.assign(this.transactionSummary, {clientId: this.inputData.clientId});
    Object.assign(this.transactionSummary, {allEdit: true});
    Object.assign(this.transactionSummary, {selectedFamilyMember: this.inputData.selectedFamilyMember});
    Object.assign(this.transactionSummary, {transactType: 'REDEEM'});
    Object.assign(this.transactionSummary, {multiTransact: false}); // when multi transact then disabled edit button in transaction summary
  }

  backToTransact() {
    this.changedValue.emit('step-2');
  }

  getDefaultDetails(data) {
    this.getDataSummary = data;
    this.platformType = this.getDataSummary.defaultClient.aggregatorType;

    Object.assign(this.transactionSummary, {aggregatorType: this.getDataSummary.defaultClient.aggregatorType});
    if (this.oldDefaultData) {
      this.checkAndResetForm(this.oldDefaultData, this.getDataSummary);
    } else {
      this.getSchemeList();
    }
    this.oldDefaultData = data;

    // this.redemptionTransaction.controls.investor.reset();
  }

  checkAndResetForm(oldData, newData) {
    if (oldData.defaultCredential.accountType != newData.defaultCredential.accountType) {
      this.resetForm();
      this.getSchemeList();
    } else if (oldData.defaultClient.holdingType != newData.defaultClient.holdingType) {
      this.resetForm();
      this.getSchemeList();
    } else if (oldData.defaultClient.aggregatorType != newData.defaultClient.aggregatorType) {
    }
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
    (this.schemeDetails) ? (this.schemeDetails.minAmount = 0) : 0;
    Object.assign(this.transactionSummary, {schemeName: ''}); // to disable scheme name from transaction summary
    Object.assign(this.transactionSummary, {folioNumber: ''});
    this.redemptionTransaction.controls.employeeContry.reset();
    this.redemptionTransaction.controls.investmentAccountSelection.reset();
    this.redemptionTransaction.controls.schemeRedeem.reset();
  }

  redemptionType(value) {

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
      this.folioDetails = data.folioDetails;
      this.navOfSelectedScheme = this.scheme.nav;
      this.currentValue = this.processTransaction.calculateCurrentValue(this.navOfSelectedScheme, this.folioDetails.balanceUnit).toFixed(2);
    }
    if (!data) {
      data = {};
    }
    this.redemptionTransaction = this.fb.group({
      ownerName: [(!data) ? '' : data.ownerName, [Validators.required]],
      transactionType: [(!data) ? '' : data.transactionType, [Validators.required]],
      bankAccountSelection: [(!data) ? '' : data.bankAccountSelection, [Validators.required]],
      schemeSelection: [(!data) ? '' : data.schemeSelection, [Validators.required]],
      // investor: [(!data) ? '' : this.scheme, [Validators.required]],
      employeeContry: [(!data) ? '' : data.orderVal, [Validators.required]],
      redeemType: [(data.redeemType) ? data.redeemType : '1', [Validators.required]],
      modeOfPaymentSelection: [(!data) ? '' : data.modeOfPaymentSelection, [Validators.required]],
      investmentAccountSelection: [(data.folioNo) ? data.folioNo : '', [Validators.required]],
      redeem: [(!data) ? '' : data.switchType, [Validators.required]],
      schemeRedeem: [(!data) ? '' : data.scheme, [Validators.required]],

    });
    this.filterSchemeList = this.redemptionTransaction.controls.schemeRedeem.valueChanges.pipe(
      startWith(''),
      map(value => this.processTransaction.filterScheme(value + '', this.schemeList))
    );
    this.ownerData = this.redemptionTransaction.controls;
    if (data.folioNo) {
      this.selectedFolio(this.folioDetails);
      this.getSchemeWiseFolios();
    }
  }

  deleteChildTran(element) {
    UtilService.deleteRow(element, this.childTransactions);
    this.dataSource.data = this.childTransactions;
    if (this.childTransactions.length == 0) {
      this.multiTransact = false;
      this.resetForm();
      this.getSchemeList();
    }
  }

  enteredAmount(value) {
    Object.assign(this.transactionSummary, {enteredAmount: value});
  }

  getFormControl(): any {
    return this.redemptionTransaction.controls;
  }

  getSchemeList() {

    if (this.redemptionTransaction.get('schemeRedeem').invalid) {
      this.showSpinner = false;
      this.folioList = [];
      Object.assign(this.transactionSummary, {schemeName: ''});
      Object.assign(this.transactionSummary, {folioNumber: ''});
    }
    let amcId = 0;
    if (this.childTransactions && this.childTransactions.length > 0) {
      amcId = this.childTransactions[0].amcId;
    }
    const obj = {
      bseOrderType: 'REDEMPTION',
      amcId,
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      advisorId: this.getDataSummary.defaultClient.advisorId,
      showOnlyNonZero: true,
      tpUserCredentialId: this.getDataSummary.defaultClient.tpUserCredentialId,
      familyMemberId: this.getDataSummary.defaultClient.familyMemberId,
      clientId: this.getDataSummary.defaultClient.clientId,
      userAccountType: this.getDataSummary.defaultCredential.accountType,
      holdingType: this.getDataSummary.defaultClient.holdingType,
      tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId,
    };
    this.showSpinner = true;
    this.onlineTransact.getExistingSchemes(obj).subscribe(
      data => this.getExistingSchemesRes(data), (error) => {
        this.showSpinner = false;
        this.redemptionTransaction.get('schemeRedeem').setErrors({setValue: error.message});
        this.redemptionTransaction.get('schemeRedeem').markAsTouched();
        // this.eventService.openSnackBar(error, 'Dismiss');
      }
    );
  }

  getExistingSchemesRes(data) {
    this.showSpinner = false;
    this.schemeList = data;
    this.redemptionTransaction.controls.schemeRedeem.setValue('');
  }

  getbankDetails(bank) {
    this.bankDetails = bank[0];
  }

  onFolioChange(folio) {
    this.redemptionTransaction.controls.investmentAccountSelection.setValue('');
  }

  selectedScheme(scheme) {
    this.scheme = scheme;
    this.folioList = [];
    this.folioDetails = null;
    this.reInvestmentOpt = [];
    this.schemeDetails = null;
    this.onFolioChange(null);
    Object.assign(this.transactionSummary, {schemeName: scheme.schemeName});
    this.navOfSelectedScheme = scheme.nav;

    const obj1 = {
      mutualFundSchemeMasterId: scheme.mutualFundSchemeMasterId,
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      orderType: 'REDEMPTION',
      userAccountType: this.getDataSummary.defaultCredential.accountType,
    };
    this.onlineTransact.getSchemeDetails(obj1).subscribe(
      data => this.getSchemeDetailsRes(data), (error) => {
        this.eventService.openSnackBar(error, 'Dismiss');
      }
    );
  }

  getSchemeDetailsRes(data) {
    this.maiSchemeList = data;
    this.schemeDetails = data[0];
    this.redemptionTransaction.controls.employeeContry.setValidators([Validators.required, Validators.min(this.schemeDetails.redemptionAmountMinimum)]);
    this.schemeDetails.selectedFamilyMember = this.selectedFamilyMember;
    if (data.length > 1) {
      this.reInvestmentOpt = [];
    }
    if (data.length == 1) {
      this.reInvestmentOpt = [];
    }
    this.getSchemeWiseFolios();
  }

  reinvest(scheme) {
    this.schemeDetails = scheme;
    Object.assign(this.transactionSummary, {schemeName: scheme.schemeName});
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
      showOnlyNonZero: true,
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
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
      this.redemptionTransaction.controls.investmentAccountSelection.setValue(this.folioList[0].folioNumber);
      this.selectedFolio(this.folioList[0]);
      if (this.redemptionTransaction.get('investmentAccountSelection').valid) {
        Object.assign(this.transactionSummary, {folioNumber: this.folioList[0].folioNumber});
      }
    } else {
      // this.onFolioChange(null);
    }

  }

  selectedFolio(folio) {
    this.showUnits = true;
    folio.balanceUnit = parseFloat(folio.balanceUnit).toFixed(2);
    this.currentValue = this.processTransaction.calculateCurrentValue(this.navOfSelectedScheme, folio.balanceUnit).toFixed(2);
    Object.assign(this.transactionSummary, {folioNumber: folio.folioNumber});
    Object.assign(this.transactionSummary, {mutualFundId: folio.id});
    Object.assign(this.transactionSummary, {tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId});
    this.transactionSummary = {...this.transactionSummary};
    this.folioDetails = folio;
  }

  validateSingleTransaction() {
    if (this.redemptionTransaction.get('schemeRedeem').invalid) {
      this.redemptionTransaction.get('schemeRedeem').markAsTouched();
    } else if (this.redemptionTransaction.get('investmentAccountSelection').invalid) {
      this.redemptionTransaction.get('investmentAccountSelection').markAsTouched();
    } else if (this.redemptionTransaction.get('redeemType').invalid) {
      this.redemptionTransaction.get('redeemType').markAsTouched();
    } else if ((this.redemptionTransaction.get('redeemType').value) != '3' &&
      this.redemptionTransaction.get('employeeContry').invalid) {
      this.redemptionTransaction.get('employeeContry').markAsTouched();
    } else {
      return true;
    }
    return false;
  }

  getSingleTransactionJson() {
    const allRedeem = (this.redemptionTransaction.controls.redeemType.value == 3) ? true : false;
    let amountType = (this.redemptionTransaction.controls.redeemType.value == 1) ? 'Amount' : 'Unit';

    let orderVal: any = '0';
    let qty: any = '0';
    if (allRedeem) {
      amountType = 'Unit';
      orderVal = this.folioDetails.balanceUnit + '';
      qty = orderVal;
    } else {
      orderVal = Object.assign(orderVal, this.redemptionTransaction.controls.employeeContry.value);
      if (amountType == 'Amount') {
        qty = '0';
      } else {
        qty = orderVal;
      }
    }
    const obj = {
      productDbId: this.schemeDetails.id,
      clientName: this.selectedFamilyMember,
      holdingType: this.getDataSummary.defaultClient.holdingType,
      mutualFundSchemeMasterId: this.scheme.mutualFundSchemeMasterId,
      productCode: this.schemeDetails.schemeCode,
      isin: this.schemeDetails.isin,
      folioNo: this.folioDetails.folioNumber,
      tpUserCredentialId: this.getDataSummary.defaultClient.tpUserCredentialId,
      tpSubBrokerCredentialId: this.getDataSummary.euin.id,
      familyMemberId: this.getDataSummary.defaultClient.familyMemberId,
      adminAdvisorId: this.getDataSummary.defaultClient.advisorId,
      clientId: this.getDataSummary.defaultClient.clientId,
      orderType: 'REDEMPTION',
      buySell: 'REDEMPTION',
      transCode: 'NEW',
      buySellType: 'FRESH',
      dividendReinvestmentFlag: this.schemeDetails.dividendReinvestmentFlag,
      clientCode: this.getDataSummary.defaultClient.clientCode,
      orderVal,
      amountType,
      qty,
      schemeCd: this.schemeDetails.schemeCode,
      euin: this.getDataSummary.euin.euin,
      bseDPTransType: 'PHYSICAL',
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      allRedeem,
      bankDetailId: null,
      nsePaymentMode: null,
      isException: true,
      childTransactions: [],
      tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId,

      schemeName: this.scheme.schemeName,
      amcId: (this.scheme) ? this.scheme.amcId : null,
      scheme: this.scheme,
      schemeDetails: this.schemeDetails,
      folioDetails: this.folioDetails,
      redeemType: this.redemptionTransaction.controls.redeemType.value,
    };
    if (this.getDataSummary.defaultClient.aggregatorType == 1) {
      obj.bankDetailId = this.bankDetails.id;
      obj.nsePaymentMode = 'ONLINE';
    }
    return obj;
  }

  redeem() {
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
          this.redeemBSERes(data);
          this.isSuccessfulTransaction = true;

        }, (error) => {
          this.barButtonOptions.active = false;
          this.eventService.openSnackBar(error, 'Dismiss');
        }
      );
    }
  }

  redeemBSERes(data) {
    this.barButtonOptions.active = false;
    if (data == undefined) {

    } else {
      this.processTransaction.onAddTransaction('confirm', this.transactionSummary);
      Object.assign(this.transactionSummary, {allEdit: false});
    }
  }

  AddMultiTransaction() {

    if (this.validateSingleTransaction()) {
      this.multiTransact = true;
      if (this.isEdit != true) {
        this.id++;
      }
      Object.assign(this.transactionSummary, {multiTransact: this.multiTransact});

      if (this.scheme != undefined && this.schemeDetails != undefined && this.redemptionTransaction != undefined) {
        if (this.isEdit == true) {
          this.childTransactions.forEach(element => {
            if (element.id == this.editedId) {
              element.id = this.editedId;
              element.mutualFundSchemeMasterId = (this.scheme) ? this.scheme.mutualFundSchemeMasterId : null;
              element.folioNo = this.redemptionTransaction.get('investmentAccountSelection').value;
              element.orderVal = this.redemptionTransaction.get('employeeContry').value;
              element.redeemType = this.redemptionTransaction.controls.redeemType.value;
              element.schemeName = this.scheme.schemeName;
              element.scheme = this.scheme;
              element.schemeDetails = this.schemeDetails;
              element.folioDetails = this.folioDetails;
            }
          });
          this.isEdit = false;
        } else {
          const obj = this.getSingleTransactionJson();
          this.childTransactions.push(obj);
        }
        this.dataSource.data = this.childTransactions;
        if (this.childTransactions.length == 1) {
          this.getSchemeList();
        }
        this.amcId = this.scheme.amcId;
        this.scheme = null;
        this.schemeDetails = null;
        this.navOfSelectedScheme = 0;
        this.folioDetails = null;
        this.folioList = [];
        this.redemptionTransaction.controls.employeeContry.reset();
        this.redemptionTransaction.controls.investmentAccountSelection.setValue('');
        this.redemptionTransaction.controls.schemeRedeem.reset();
        this.showUnits = false;
      }
    }
  }

  removeUnnecessaryDataFromJson(singleTransactionJson) {
    singleTransactionJson.schemeSelection = undefined;
    singleTransactionJson.folioSelection = undefined;
    singleTransactionJson.modeOfPaymentSelection = undefined;
    singleTransactionJson.scheme = undefined;
    singleTransactionJson.schemeDetails = undefined;
    singleTransactionJson.reInvestmentOpt = undefined;
    singleTransactionJson.folioDetails = undefined;
  }
}
