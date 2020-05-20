import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {SubscriptionInject} from '../../../../Subscriptions/subscription-inject.service';
import {OnlineTransactionService} from '../../../online-transaction.service';
import {EventService} from 'src/app/Data-service/event.service';
import {ProcessTransactionService} from '../process-transaction.service';
import {MatProgressButtonOptions} from 'src/app/common/progress-button/progress-button.component';
import {AuthService} from 'src/app/auth-service/authService';
import {ValidatorType} from 'src/app/services/util.service';
import {Observable, of} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-switch-transaction',
  templateUrl: './switch-transaction.component.html',
  styleUrls: ['./switch-transaction.component.scss']
})
export class SwitchTransactionComponent implements OnInit {

  showSpinnerEx = false;
  isSuccessfulTransaction = false;
  folioNumberShow: any;

  constructor(private subInjectService: SubscriptionInject, private onlineTransact: OnlineTransactionService,
    private fb: FormBuilder, private eventService: EventService, public processTransaction: ProcessTransactionService) {
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
  confirmTrasaction: boolean;
  switchTransaction: any;
  dataSource: any;
  ownerData: any;
  selectedFamilyMember: any;
  inputData: any;
  isViewInitCalled = false;
  transactionType: any;
  selectScheme = 2;
  navOfSelectedScheme: any;
  transactionSummary: {};
  schemeDetails: any;
  maiSchemeList: any;
  reInvestmentOpt = [];
  // schemeList: any;
  existingSchemeList = [];
  showUnits = false;
  getDataSummary: any;
  showSpinner = false;
  scheme: any;
  folioList: any;
  folioDetails: any;
  schemeTransfer: any;
  schemeDetailsTransfer: any;
  schemeListTransfer: any;
  showSpinnerFolio = false;
  showSpinnerTran = false;
  currentValue: number;
  multiTransact = false;
  childTransactions = [];
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
    this.advisorId = AuthService.getAdvisorId();
    this.inputData = data;
    this.transactionType = data.transactionType;
    this.selectedFamilyMember = data.selectedFamilyMember;
    console.log('This is Input data of FixedDepositComponent ', data);

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
    Object.assign(this.transactionSummary, { allEdit: true });
    Object.assign(this.transactionSummary, {selectedFamilyMember: this.inputData.selectedFamilyMember});
    Object.assign(this.transactionSummary, {multiTransact: false});
  }

  backToTransact() {
    this.changedValue.emit('step-2');
  }

  getDefaultDetails(data) {
    console.log('get defaul here yupeeee', data);
    this.getDataSummary = data;
    Object.assign(this.transactionSummary, { aggregatorType: this.getDataSummary.defaultClient.aggregatorType });
    this.switchTransaction.controls.transferIn.reset();
    if (!(this.existingSchemeList && this.existingSchemeList.length > 0)) {
      this.getSchemeList();
    }
  }

  getSchemeList() {

    if (this.switchTransaction.get('schemeSwitch').invalid) {
      // this.showSpinner = false;
      Object.assign(this.transactionSummary, { schemeName: '' });
      Object.assign(this.transactionSummary, { folioNumber: '' });
      (this.schemeDetails) ? (this.schemeDetails.minimumPurchaseAmount = 0) : 0; // if scheme not present then min amt is 0
    }
    if (this.selectScheme == 2) {
      this.showSpinnerEx = true;
      const obj = {
        // searchQuery: (data == '') ? '' : data.target.value,
        bseOrderType: 'SWITCH',
        aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
        advisorId: this.advisorId,
        tpUserCredentialId: this.getDataSummary.defaultClient.tpUserCredentialId,
        familyMemberId: this.getDataSummary.defaultClient.familyMemberId,
        clientId: this.getDataSummary.defaultClient.clientId,
        userAccountType: this.getDataSummary.defaultCredential.accountType,
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
    this.switchTransaction.controls.currentValue.setValue((this.processTransaction.calculateCurrentValue(this.navOfSelectedScheme, folio.balanceUnit)).toFixed(2))
    this.currentValue = this.processTransaction.calculateCurrentValue(this.navOfSelectedScheme, folio.balanceUnit);
    this.switchTransaction.controls.balanceUnit.setValue((folio.balanceUnit).toFixed(2))
    this.showUnits = true;
    Object.assign(this.transactionSummary, { folioNumber: folio.folioNumber });
    Object.assign(this.transactionSummary, { mutualFundId: folio.id });
    Object.assign(this.transactionSummary, { tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId });
    this.transactionSummary = { ...this.transactionSummary };
  }

  selectedScheme(scheme) {
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
      userAccountType: this.getDataSummary.defaultCredential.accountType,
    };
    this.onlineTransact.getSchemeDetails(obj1).subscribe(
      data => this.getSchemeDetailsRes(data), (error) => {
        this.eventService.openSnackBar(error, 'Dismiss');
      }
    );
  }

  getbankDetails(event) {
    console.log(event);
  }

  getSchemeDetailsRes(data) {
    this.showSpinner = false;
    console.log('getSchemeDetailsRes == ', data);
    this.maiSchemeList = data;
    this.schemeDetails = data[0];
    Object.assign(this.transactionSummary, { schemeName: this.schemeDetails.schemeName });

    this.schemeDetails.selectedFamilyMember = this.selectedFamilyMember;
    this.getSchemeWiseFolios();
  }

  reinvest(scheme) {
    // this.schemeDetails = scheme;
    this.schemeDetailsTransfer = scheme;

    Object.assign(this.transactionSummary, { schemeName: scheme.schemeName });
    console.log('schemeDetails == ', this.schemeDetails);
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
    console.log('res scheme folio', data);
    this.folioList = data;
    if(this.folioList.length == 1){
      this.folioNumberShow = this.folioList[0].folioNumber
    }
    if (this.switchTransaction.get('investmentAccountSelection').valid) {
      Object.assign(this.transactionSummary, { folioNumber: this.folioList[0].folioNumber });
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
      userAccountType: this.getDataSummary.defaultCredential.accountType,
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
      console.log('reinvestment', this.reInvestmentOpt);
    } else if (data.length == 1) {
      this.reInvestmentOpt = [];
    }
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
        userAccountType: this.getDataSummary.defaultCredential.accountType,
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

  switchType(event) {
    console.log('switch transaction switchType: ', event.value);
    if (event.value == '3') {
      this.switchTransaction.controls.employeeContry.setValidators([]);
    } else if (event.value == '2') {
      this.switchTransaction.controls.employeeContry.setValidators([Validators.min(this.schemeDetails.minimumRedemptionQty)]);
    } else if (event.value == '1') {
      this.switchTransaction.controls.employeeContry.setValidators([Validators.min(this.schemeDetails.minimumPurchaseAmount)]);
    }
  }

  enteredAmount(value) {
    Object.assign(this.transactionSummary, { enteredAmount: value });
  }

  getNewSchemesRes(data, inputData) {
    this.showSpinnerTran = false;
    console.log('new schemes', data);
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
      employeeContry: [(!data) ? '' : data.orderVal, [Validators.required]],
      currentValue:[(!data) ? '' : data.currentValue,],
      balanceUnit:[(!data) ? '' : data.balanceUnit,],
      investmentAccountSelection: [(data.investmentAccountSelection) ? data.investmentAccountSelection : '', [Validators.required]],
      modeOfPaymentSelection: [(!data) ? '' : data.modeOfPaymentSelection, [Validators.required]],
      folioSelection: [(data.folioSelection) ? data.folioSelection : '', [Validators.required]],
      selectInvestor: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      installment: [(!data) ? '' : data.employeeContry, [Validators.required]],
      tenure: [(data.tenure) ? data.tenure : '', [Validators.required]],
      schemeSwitch: [(!data) ? '' : data.schemeName, [Validators.required]],
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
  }

  getFormControl(): any {
    return this.switchTransaction.controls;
  }

  switch() {
    if (this.reInvestmentOpt.length > 1 && this.switchTransaction.controls.reinvest.invalid) {
      this.switchTransaction.get('reinvest').markAsTouched();
    } else if (this.switchTransaction.get('folioSelection').value == 1) {
      if (this.switchTransaction.get('investmentAccountSelection').invalid) {
        this.switchTransaction.get('investmentAccountSelection').markAsTouched();
        return;
      }
    } else if (this.switchTransaction.get('switchType').value != 3 && this.switchTransaction.get('employeeContry').invalid) {
      this.switchTransaction.get('employeeContry').markAsTouched();
      return;
    } else if (this.switchTransaction.get('switchType').invalid) {
      this.switchTransaction.get('switchType').markAsTouched();
      return;
    } else {

      const obj = {

        productDbId: this.schemeDetails.id,
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
        qty: (this.switchTransaction.controls.switchType.value == 1) ? 0 : (this.switchTransaction.controls.switchType.value == 3) ? this.schemeDetails.balance_units : this.switchTransaction.controls.employeeContry.value,
        allRedeem: (this.switchTransaction.controls.switchType.value == 3) ? true : false,
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
        childTransactions: [],
        isException: true,
        tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId,

      };

      console.log('switch', obj);
      if (this.multiTransact == true) {
        console.log('new purchase obj', this.childTransactions);
        this.AddMultiTransaction();
        obj.childTransactions = this.childTransactions;
      }
      this.barButtonOptions.active = true;
      this.onlineTransact.transactionBSE(obj).subscribe(
        data => {
          this.isSuccessfulTransaction = true;

          this.switchBSERes(data);
        }, (error) => {
          this.barButtonOptions.active = false;
          this.eventService.openSnackBar(error, 'Dismiss');
        }
      );
    }
  }

  switchBSERes(data) {
    this.barButtonOptions.active = false;
    console.log('switch res == ', data);
    if (data == undefined) {

    } else {
      this.processTransaction.onAddTransaction('confirm', this.transactionSummary);
      Object.assign(this.transactionSummary, { allEdit: false });
    }
  }

  AddMultiTransaction() {
    if (this.isEdit != true) {
      this.id++;
    }
    if (this.reInvestmentOpt.length > 1) {
      if (this.switchTransaction.get('reinvest').invalid) {
        this.switchTransaction.get('reinvest').markAsTouched();
      }
    } else if (this.switchTransaction.get('schemeSwitch').invalid) {
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
        const obj = {
          id: this.id,
          amcId: this.scheme.amcId,
          mutualFundSchemeMasterId: this.scheme.mutualFundSchemeMasterId,
          productDbId: this.schemeDetails.id,
          amountType: (this.switchTransaction.controls.switchType.value == 1) ? 'Amount' : 'Unit',
          toProductDbId: this.schemeDetailsTransfer.id,
          qty: (this.switchTransaction.controls.switchType.value == 1) ?
            0 : (this.switchTransaction.controls.switchType.value == 3) ?
              this.schemeDetails.balance_units : this.switchTransaction.controls.employeeContry.value,
          allRedeem: (this.switchTransaction.controls.switchType.value == 3) ? true : false,
          toIsin: this.schemeDetailsTransfer.isin,
          isin: this.schemeDetails.isin,
          folioNo: (this.folioDetails == undefined) ? null : this.folioDetails.folioNumber,
          productCode: this.schemeDetails.schemeCode,
          dividendReinvestmentFlag: this.schemeDetails.dividendReinvestmentFlag,
          orderVal: this.switchTransaction.controls.employeeContry.value,
          schemeName: this.scheme.schemeName,
          transferIn: this.switchTransaction.get('transferIn').value,
          switchType: this.switchTransaction.get('switchType').value

        };
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
            console.log(element);
          });
          this.isEdit = false;
        } else {
          this.childTransactions.push(obj);
        }
        console.log(this.childTransactions);
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
}
