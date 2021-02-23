import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { OnlineTransactionService } from '../../../online-transaction.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ProcessTransactionService } from '../process-transaction.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { AuthService } from 'src/app/auth-service/authService';
import { ValidatorType } from 'src/app/services/util.service';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MultiTransactionPopupComponent } from '../multi-transaction-popup/multi-transaction-popup.component';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { EnumDataService } from "../../../../../../../services/enum-data.service";

@Component({
  selector: 'app-switch-transaction',
  templateUrl: './switch-transaction.component.html',
  styleUrls: ['./switch-transaction.component.scss']
})
export class SwitchTransactionComponent implements OnInit {

  showSpinnerEx = false;
  isSuccessfulTransaction = false;
  folioNumberShow: any;

  oldDefaultData;

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
  confirmTrasaction: boolean;
  switchTransaction: any;
  ownerData: any;
  selectedFamilyMember: any;
  inputData: any;
  isViewInitCalled = false;
  transactionType: any;
  selectScheme = 2;
  navOfSelectedScheme: any;
  transactionSummary: any;
  schemeDetails: any;
  maiSchemeList: any;
  reInvestmentOpt = [];
  // schemeList: any;
  existingSchemeList = [];
  showUnits = false;
  getDataSummary: any;
  folioList = [];
  showSpinner = false;
  scheme: any;
  schemeName: any;
  mutualFundData: any;
  mfDefault: any;
  folioNumber: any;
  element: any;
  platformType: any;
  bankDetails: any;

  constructor(private subInjectService: SubscriptionInject,
    private onlineTransact: OnlineTransactionService,
    private fb: FormBuilder,
    private eventService: EventService,
    public dialog: MatDialog,
    public processTransaction: ProcessTransactionService,
    public enumDataService: EnumDataService) {
  }

  folioDetails: any;
  schemeTransfer: any;
  schemeDetailsTransfer: any;
  schemeListTransfer: any;
  showSpinnerFolio = false;
  showSpinnerTran = false;
  currentValue: number;
  multiTransact = false;
  childTransactions = [];
  dataSource = new MatTableDataSource(this.childTransactions);
  displayedColumns: string[] = ['no', 'folio', 'ownerName', 'amount', 'icons'];

  advisorId: any;
  isEdit = false;
  editedId: any;
  id = 0;
  navOfSelectedSchemeSwitchIn: any;
  validatorType = ValidatorType;

  get data() {
    return this.inputData;
  }

  filterSchemeList: Observable<any[]>;
  filterNewSchemeList: Observable<any[]>;

  @Output() changedValue = new EventEmitter();

  @Input()
  set data(data) {
    this.folioList = [];
    this.reInvestmentOpt = [];
    this.advisorId = AuthService.getAdvisorId();
    this.inputData = data;
    this.transactionType = data.transactionType;
    this.selectedFamilyMember = data.selectedFamilyMember;
    this.getDataSummary = this.inputData.transactionData;
    this.platformType = this.getDataSummary.defaultClient.aggregatorType;
    if (data.mutualFundData) {
      this.schemeName = data.mutualFundData.schemeName;
      this.folioNumber = data.mutualFundData.folioNumber;
      this.mfDefault = data.transactionData;
      const foilo = { folioNumber: this.folioNumber };
      this.folioList.push(foilo);
      // this.schemeList.push({'schemeName': this.schemeName})
      this.filterSchemeList = of([{ schemeName: this.schemeName }]);
      this.mutualFundData = data.mutualFundData;
    }
    if (this.isViewInitCalled) {
      this.getdataForm('', false);
    }
  }

  ngOnInit() {
    this.transactionSummary = {};
    this.childTransactions = [];
    this.getdataForm(this.inputData, false);
    Object.assign(this.transactionSummary, { familyMemberId: this.inputData.familyMemberId });
    Object.assign(this.transactionSummary, { clientId: this.inputData.clientId });
    Object.assign(this.transactionSummary, { transactType: 'SWITCH' });
    Object.assign(this.transactionSummary, { changeDetails: this.inputData.transactionData });
    Object.assign(this.transactionSummary, { isAdvisorSection: this.inputData.isAdvisorSection });
    Object.assign(this.transactionSummary, { allEdit: true });
    Object.assign(this.transactionSummary, { selectedFamilyMember: this.inputData.selectedFamilyMember });
    Object.assign(this.transactionSummary, { multiTransact: false });
  }

  backToTransact() {
    this.changedValue.emit('step-2');
  }

  getDefaultDetails(data) {
    this.getDataSummary = data;
    this.platformType = this.getDataSummary.defaultClient.aggregatorType;
    if (this.oldDefaultData) {
      this.checkAndResetForm(this.oldDefaultData, this.getDataSummary);
    } else if (!this.mutualFundData) {
      this.getSchemeList();
    }
    this.oldDefaultData = data;
    Object.assign(this.transactionSummary, { aggregatorType: this.getDataSummary.defaultClient.aggregatorType });
    this.switchTransaction.controls.transferIn.reset();
  }

  checkAndResetForm(oldData, newData) {
    if (oldData.defaultCredential.accountType != newData.defaultCredential.accountType) {
      if (!this.mutualFundData) {
        this.resetForm();
        this.getSchemeList();
      } else {
        this.mfDefault = newData;
        this.getdataForm(this.inputData, true);
      }
    } else if (oldData.defaultClient.holdingType != newData.defaultClient.holdingType) {
      this.resetForm();
      this.getSchemeList();
    } else if (oldData.defaultClient.aggregatorType != newData.defaultClient.aggregatorType) {
    }
  }

  resetForm() {
    this.scheme = null;
    this.existingSchemeList = null;
    this.reInvestmentOpt = [];
    this.schemeListTransfer = [];
    this.schemeDetailsTransfer = undefined;
    this.schemeDetails = null;
    this.folioList = [];
    this.folioDetails = null;
    this.onFolioChange(null);
    this.navOfSelectedScheme = 0;
    (this.schemeDetails) ? (this.schemeDetails.minAmount = 0) : 0;
    Object.assign(this.transactionSummary, { schemeName: '' }); // to disable scheme name from transaction summary
    Object.assign(this.transactionSummary, { folioNumber: '' });
    Object.assign(this.transactionSummary, { schemeNameTranfer: '' });

    this.switchTransaction.controls.employeeContry.reset();
    this.switchTransaction.controls.investmentAccountSelection.reset();
    this.switchTransaction.controls.schemeSwitch.reset();
  }

  getSchemeList() {

    if (this.switchTransaction.get('schemeSwitch').invalid) {
      // this.showSpinner = false;
      Object.assign(this.transactionSummary, { schemeName: '' });
      Object.assign(this.transactionSummary, { folioNumber: '' });
      (this.schemeDetails) ? (this.schemeDetails.minimumPurchaseAmount = 0) : 0; // if scheme not present then min amt is 0
    }
    if (this.selectScheme == 2 && !this.mutualFundData) {
      this.showSpinnerEx = true;
      const obj = {
        // searchQuery: (data == '') ? '' : data.target.value,
        bseOrderType: 'SWITCH',
        aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
        advisorId: this.advisorId,
        tpUserCredentialId: this.getDataSummary.defaultClient.tpUserCredentialId,
        familyMemberId: this.getDataSummary.defaultClient.familyMemberId,
        clientId: this.getDataSummary.defaultClient.clientId,
        userAccountType: this.getDataSummary.defaultClient.accountType,
        holdingType: this.getDataSummary.defaultClient.holdingType,
        showOnlyNonZero: true,
        tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId,
      };
      this.onlineTransact.getExistingSchemes(obj).subscribe(
        data => this.getExistingSchemesRes(data), (error) => {
          this.showSpinnerEx = false;
          this.switchTransaction.get('schemeSwitch').setErrors({ setValue: error });
          this.switchTransaction.get('schemeSwitch').markAsTouched();
          (this.schemeDetails) ? (this.schemeDetails.minimumPurchaseAmount = 0) : 0; // if scheme not present then min amt is 0
          // this.eventService.openSnackBar(error, 'Dismiss');
        }
      );
    } else {

    }
  }

  getExistingSchemesRes(data) {
    this.showSpinner = false;
    this.showSpinnerEx = false;
    this.existingSchemeList = data;
    if (this.switchTransaction.controls.schemeSwitch.value && this.switchTransaction.controls.schemeSwitch.value.length > 1) {
      this.switchTransaction.controls.schemeSwitch.setValue(this.switchTransaction.controls.schemeSwitch.value);
    } else {
      this.switchTransaction.controls.schemeSwitch.setValue('');
    }
  }

  onFolioChange(folio) {
    this.switchTransaction.controls.investmentAccountSelection.setValue('');
  }

  selectedFolio(folio) {
    this.folioDetails = folio;
    this.switchTransaction.controls.currentValue.setValue((this.processTransaction.calculateCurrentValue(this.navOfSelectedScheme, folio.balanceUnit)).toFixed(2));
    this.currentValue = this.processTransaction.calculateCurrentValue(this.navOfSelectedScheme, folio.balanceUnit);
    this.switchTransaction.controls.balanceUnit.setValue((folio.balanceUnit).toFixed(2));
    this.showUnits = true;
    Object.assign(this.transactionSummary, { folioNumber: folio.folioNumber });
    Object.assign(this.transactionSummary, { mutualFundId: folio.id });
    Object.assign(this.transactionSummary, { tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId });
    this.transactionSummary = { ...this.transactionSummary };
  }

  selectedScheme(scheme) {
    console.log('Switch selected scheme : ', scheme);
    this.showSpinner = true;
    this.scheme = scheme;
    this.showUnits = true;
    this.folioList = [];
    this.schemeDetails = null;
    this.onFolioChange(null);
    Object.assign(this.transactionSummary, { schemeName: scheme.schemeName });
    this.navOfSelectedScheme = scheme.nav;
    const obj1 = {
      mutualFundSchemeMasterId: scheme.mutualFundSchemeMasterId,
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      orderType: 'SWITCH',
      userAccountType: this.getDataSummary.defaultClient.accountType,
    };
    this.onlineTransact.getSchemeDetails(obj1).subscribe(
      data => this.getSchemeDetailsRes(data), (error) => {
        this.eventService.openSnackBar(error, 'Dismiss');
      }
    );
  }

  getbankDetails(event) {
    this.bankDetails = event;
  }

  getSchemeDetailsRes(data) {
    if (!data) {
      this.eventService.openSnackBarNoDuration('Not able to find MF scheme details, Please contact with support team', 'DISMISS');
    }
    this.showSpinner = false;
    this.maiSchemeList = data;
    this.schemeDetails = data[0];
    // Object.assign(this.transactionSummary, x this.schemeDetails.schemeName});
    Object.assign(this.transactionSummary, { folioNumber: this.folioNumber });
    // Object.assign(this.transactionSummary, {schemeName: this.schemeName});
    this.schemeDetails.selectedFamilyMember = this.selectedFamilyMember;
    if (!this.mutualFundData) {
      this.getSchemeWiseFolios();
    }

  }

  reinvest(scheme) {
    // this.schemeDetails = scheme;
    this.schemeDetailsTransfer = scheme;

    Object.assign(this.transactionSummary, { schemeName: scheme.schemeName });
  }

  getSchemeWiseFolios() {
    this.showSpinnerFolio = true;
    const obj1 = {
      mutualFundSchemeMasterId: this.scheme.mutualFundSchemeMasterId,
      advisorId: this.getDataSummary.defaultClient.advisorId,
      familyMemberId: this.getDataSummary.defaultClient.familyMemberId,
      clientId: this.getDataSummary.defaultClient.clientId,
      userAccountType: this.getDataSummary.defaultClient.accountType,
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
      this.switchTransaction.controls.investmentAccountSelection.setValue(this.folioList[0].folioNumber);
      this.selectedFolio(this.folioList[0]);
      if (this.switchTransaction.controls.investmentAccountSelection.valid) {
        Object.assign(this.transactionSummary, { folioNumber: this.folioList[0].folioNumber });
      }
    }
  }

  close() {
    this.subInjectService.changeNewRightSliderState({
      state: 'close',
      refreshRequired: this.isSuccessfulTransaction
    });
  }

  selectedSchemeTransfer(schemeTransfer) {
    this.showSpinnerTran = true;
    this.schemeTransfer = schemeTransfer;
    Object.assign(this.transactionSummary, { schemeNameTranfer: schemeTransfer.schemeName });
    this.navOfSelectedSchemeSwitchIn = schemeTransfer.nav;
    const obj1 = {
      mutualFundSchemeMasterId: schemeTransfer.mutualFundSchemeMasterId,
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      orderType: 'SWITCH',
      userAccountType: this.getDataSummary.defaultClient.accountType,
    };
    this.onlineTransact.getSchemeDetails(obj1).subscribe(
      data => this.getSchemeDetailsTranferRes(data), (error) => {
        this.eventService.openSnackBar(error, 'Dismiss');
      }
    );
  }

  getSchemeDetailsTranferRes(data) {
    this.showSpinnerTran = false;
    // this.maiSchemeList = data
    this.schemeDetailsTransfer = data[0];
    if (data.length > 1) {
      this.reInvestmentOpt = data;
    } else if (data.length == 1) {
      this.reInvestmentOpt = [];
    }
    this.switchType(this.switchTransaction.controls.switchType.value);
  }

  getSchemeListTranfer(inputData) {
    if (inputData == '') {
      this.schemeTransfer = undefined;
      // this.schemeListTransfer = undefined;
      return;
    }
    if (this.switchTransaction.get('transferIn').invalid) {
      this.showSpinnerTran = false;
      Object.assign(this.transactionSummary, { schemeNameTranfer: '' });
    }
    if (this.selectScheme == 2 && inputData.length > 2) {
      this.showSpinnerTran = true;
      this.reInvestmentOpt = [];

      const obj = {
        searchQuery: inputData,
        bseOrderType: 'SWITCH',
        amcId: this.scheme.amcId,
        aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
        advisorId: this.advisorId,
        tpUserCredentialId: this.getDataSummary.defaultClient.tpUserCredentialId,
        familyMemberId: this.getDataSummary.defaultClient.familyMemberId,
        clientId: this.getDataSummary.defaultClient.clientId,
        userAccountType: this.getDataSummary.defaultClient.accountType,
        holdingType: this.getDataSummary.defaultClient.holdingType,
        tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId,
      };
      this.onlineTransact.getNewSchemes(obj).subscribe(
        responseData => this.getNewSchemesRes(responseData, inputData), (error) => {
          this.showSpinnerTran = false;
          this.switchTransaction.get('transferIn').setErrors({ setValue: error.message });
          this.switchTransaction.get('transferIn').markAsTouched();
          // this.eventService.openSnackBar(error, 'Dismiss');
        }
      );
    }
  }

  switchType(eventValue) {
    if (eventValue == '3') {
      this.switchTransaction.controls.employeeContry.setValidators([]);
      this.switchTransaction.controls.employeeContry.clearValidators();
    } else if (eventValue == '2') {
      if (this.schemeDetails) {
        this.switchTransaction.controls.employeeContry.setValidators([Validators.min(this.schemeDetails.minimumRedemptionQty), Validators.required]);
      }
    } else if (eventValue == '1') {
      if (this.schemeDetailsTransfer) {
        this.switchTransaction.controls.employeeContry.setValidators([Validators.min(this.schemeDetailsTransfer.minimumPurchaseAmount), Validators.required]);
      }
    }
    this.switchTransaction.controls.employeeContry.updateValueAndValidity();

  }

  enteredAmount(value, switchType) {
    if (switchType == 2) {
      Object.assign(this.transactionSummary, { enteredUnits: value });
      Object.assign(this.transactionSummary, { Ttype: switchType });
    } else {
      Object.assign(this.transactionSummary, { enteredAmount: value });
      Object.assign(this.transactionSummary, { Ttype: switchType });
    }
  }

  getNewSchemesRes(data, inputData) {
    this.showSpinnerTran = false;
    this.schemeListTransfer = data;
    if (this.switchTransaction.controls.transferIn.value) {
      this.filterNewSchemeList = of(this.processTransaction.filterScheme(this.switchTransaction.controls.transferIn.value, this.schemeListTransfer));
    } else {
      this.switchTransaction.controls.transferIn.setValue('');
    }
  }

  getdataForm(data, isEdit) {
    if (isEdit == true) {
      this.isEdit = isEdit;
      this.editedId = data.id;
    }
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
      reinvest: [(data.reinvest) ? data.reinvest : '', [Validators.required]],
      employeeContry: [(!data) ? '' : data.orderVal, []],
      currentValue: [(!data) ? '' : data.currentValue,],
      balanceUnit: [(!data) ? '' : data.balanceUnit,],
      investmentAccountSelection: [(data.folioNumber) ? data.folioNumber : (this.mutualFundData) ? this.mutualFundData.folioNumber : '', [Validators.required]],
      modeOfPaymentSelection: [(!data) ? '' : data.modeOfPaymentSelection, [Validators.required]],
      folioSelection: [(data.folioSelection) ? data.folioSelection : '', [Validators.required]],
      selectInvestor: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      tenure: [(data.tenure) ? data.tenure : '', [Validators.required]],
      schemeSwitch: [(!data) ? '' : (this.mutualFundData) ? this.mutualFundData.schemeName : '', [Validators.required]],
      transferIn: [(!data) ? '' : data.transferIn, [Validators.required]],
      switchType: [(data.switchType) ? data.switchType : '', [Validators.required]],
    });
    this.filterSchemeList = this.switchTransaction.controls.schemeSwitch.valueChanges.pipe(
      startWith(''),
      map(value => this.processTransaction.filterScheme(value + '', this.existingSchemeList))
    );
    this.switchTransaction.controls.transferIn.valueChanges.subscribe((newValue) => {
      this.filterNewSchemeList = of(this.processTransaction.filterScheme(newValue + '', this.schemeListTransfer));
    });
    this.ownerData = this.switchTransaction.controls;
    if (data.folioNo) {
      this.scheme.mutualFundSchemeMasterId = data.mutualFundSchemeMasterId;
      this.getSchemeWiseFolios();
    }
    if (this.mutualFundData) {
      this.folioDetails = {};
      this.navOfSelectedScheme = this.mutualFundData.nav;
      this.switchTransaction.controls.schemeSelection.setValue('1');
      this.switchTransaction.controls.folioSelection.setValue('1');
      this.switchTransaction.controls.schemeSwitch.setValue({ schemeName: this.schemeName });
      this.switchTransaction.controls.schemeSwitch.disable();
      this.currentValue = this.processTransaction.calculateCurrentValue(this.mutualFundData.nav, this.mutualFundData.balanceUnit);
      this.currentValue = Math.round(this.currentValue);
      this.switchTransaction.controls.currentValue.setValue(this.mutualFundData.currentValue);
      this.switchTransaction.controls.balanceUnit.setValue(this.mutualFundData.balanceUnit);
      this.mutualFundData.balanceUnit = parseFloat(this.mutualFundData.balanceUnit).toFixed(2);
      this.showUnits = true;
      this.filterSchemeList = of([{ schemeName: this.schemeName }]);
      Object.assign(this.folioDetails, { folioNumber: this.folioNumber });
      this.scheme = {
        schemeName: this.schemeName,
        mutualFundSchemeMasterId: this.mutualFundData.schemeId
      };
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
    if (!this.mutualFundData) {
      this.getSchemeList();
    }
  }

  getFormControl(): any {
    return this.switchTransaction.controls;
  }

  switch() {
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
          obj.childTransactions = list;
          this.onlineTransact.transactionBSE(obj).subscribe(
            data => {
              this.switchBSERes(data);
              this.isSuccessfulTransaction = true;
            }, (error) => {
              this.barButtonOptions.active = false;
              this.eventService.openSnackBar(error, 'Dismiss', null, 60000);
            }
          );
        }
      });
    } else {
      if (this.mutualFundData) {
        this.switchTransaction.controls.investmentAccountSelection.setValue(this.folioNumber);
      }
      if (this.reInvestmentOpt.length > 1 && this.switchTransaction.controls.reinvest.invalid) {
        this.switchTransaction.get('reinvest').markAsTouched();
        // } else if (this.switchTransaction.get('folioSelection').value == 1) {
        //   if (this.switchTransaction.get('investmentAccountSelection').invalid) {
        //     this.switchTransaction.get('investmentAccountSelection').markAsTouched();
        //     return;
        //   }
      } else if (this.switchTransaction.get('switchType').value != 3 && this.switchTransaction.get('employeeContry').invalid) {
        this.switchTransaction.get('employeeContry').markAsTouched();
        return;
      } else if (this.switchTransaction.get('switchType').invalid) {
        this.switchTransaction.get('switchType').markAsTouched();
        return;
      } else {
        if (this.barButtonOptions.active) {
          return;
        }
        this.barButtonOptions.active = true;
        const obj = this.getSingleTransactionJson();
        this.onlineTransact.transactionBSE(obj).subscribe(
          data => {
            this.isSuccessfulTransaction = true;

            this.switchBSERes(data);
          }, (error) => {
            this.barButtonOptions.active = false;
            this.eventService.openSnackBar(error, 'Dismiss', null, 60000);
          }
        );
      }
    }

  }

  switchBSERes(data) {
    this.barButtonOptions.active = false;
    if (data == undefined) {

    } else {
      this.processTransaction.onAddTransaction('confirm', this.transactionSummary);
      Object.assign(this.transactionSummary, { allEdit: false });
    }
  }

  getSingleTransactionJson() {
    const obj = {

      productDbId: (this.schemeDetails.id) ? this.schemeDetails.id : 999999,
      clientName: this.selectedFamilyMember,
      holdingType: this.getDataSummary.defaultClient.holdingType,
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
      toIsin: this.schemeDetailsTransfer.isin,
      schemeCd: this.schemeDetails.schemeCode,
      euin: this.getDataSummary.euin.euin,
      qty: (this.switchTransaction.controls.switchType.value == '1') ? 0 : (this.switchTransaction.controls.switchType.value == '3') ? this.schemeDetails.balance_units : this.switchTransaction.controls.employeeContry.value,
      allUnits: (this.switchTransaction.controls.switchType.value == '3') ? true : false,
      orderType: 'SWITCH',
      buySell: 'SWITCH_OUT',
      transCode: 'NEW',
      buySellType: 'FRESH',
      amountType: (this.switchTransaction.controls.switchType.value == 1) ? 'Amount' : 'Unit',
      dividendReinvestmentFlag: this.schemeDetailsTransfer.dividendReinvestmentFlag,
      clientCode: this.getDataSummary.defaultClient.clientCode,
      orderVal: this.switchTransaction.controls.employeeContry.value,
      bseDPTransType: 'PHYSICAL',
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      mandateId: undefined,
      bankDetailId: undefined,
      nsePaymentMode: undefined,
      childTransactions: [],
      isException: true,
      tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId,
      scheme: this.schemeTransfer,
      schemeName: this.schemeTransfer.schemeName,
      schemeDetails: this.schemeDetailsTransfer,
    };
    if (this.getDataSummary.defaultClient.aggregatorType == 1) {
      // obj.mandateId = (this.achMandateNSE == undefined) ? null : this.achMandateNSE.id;
      obj.bankDetailId = this.bankDetails.id;
      obj.orderVal = (this.switchTransaction.controls.switchType.value == '2') ? null : this.switchTransaction.controls.employeeContry.value;
    }
    if (this.platformType == 1 && obj.folioNo) {
      obj.folioNo = obj.folioNo.split('/')[0];
    }
    return obj;
  }

  AddMultiTransaction() {
    if (this.barButtonOptions.active) {
      return;
    }
    if (this.switchTransaction.get('schemeSwitch').invalid) {
      this.switchTransaction.get('schemeSwitch').markAsTouched();
      return;
    } else if (this.switchTransaction.get('investmentAccountSelection').invalid) {
      this.switchTransaction.get('investmentAccountSelection').markAsTouched();
      return;
    } else if (this.switchTransaction.get('transferIn').invalid) {
      this.switchTransaction.get('transferIn').markAsTouched();
      return;
    } else if (this.switchTransaction.get('switchType').invalid) {
      this.switchTransaction.get('switchType').markAsTouched();
      return;
    } else if (this.switchTransaction.get('employeeContry').invalid) {
      this.switchTransaction.get('employeeContry').markAsTouched();
      return;
    } else {
      this.multiTransact = true;
      if (this.scheme && this.schemeDetails != undefined && this.switchTransaction != undefined) {
        if (this.isEdit != true) {
          this.id++;
        }
        if (this.isEdit == true) {
          this.childTransactions.forEach(element => {
            if (element.id == this.editedId) {
              element.mutualFundSchemeMasterId = this.scheme.mutualFundSchemeMasterId;
              element.id = this.editedId;
              element.folioNo = this.switchTransaction.get('investmentAccountSelection').value;
              element.orderVal = this.switchTransaction.get('employeeContry').value;
              element.schemeName = this.switchTransaction.get('schemeSwitch').value;
              element.switchType = this.switchTransaction.get('switchType').value;
              element.modeOfPaymentSelection = this.switchTransaction.get('modeOfPaymentSelection').value;
            }
          });
          this.isEdit = false;
        } else {
          const obj = this.getSingleTransactionJson();
          this.childTransactions.push(obj);
          this.dataSource.data = this.childTransactions;
        }
        // this.schemeList = [];
        this.showUnits = false;
        this.switchTransaction.controls.switchType.reset();
        this.switchTransaction.controls.employeeContry.reset();
        this.switchTransaction.controls.investmentAccountSelection.reset();
        this.switchTransaction.controls.schemeSwitch.reset();
        this.switchTransaction.controls.transferIn.reset();
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
