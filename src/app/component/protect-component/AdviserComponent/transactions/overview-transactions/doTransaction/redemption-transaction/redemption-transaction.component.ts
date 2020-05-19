import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { FormBuilder, Validators } from '@angular/forms';
import { OnlineTransactionService } from '../../../online-transaction.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ProcessTransactionService } from '../process-transaction.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { ValidatorType } from 'src/app/services/util.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-redemption-transaction',
  templateUrl: './redemption-transaction.component.html',
  styleUrls: ['./redemption-transaction.component.scss']
})
export class RedemptionTransactionComponent implements OnInit {
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
  dataSource: any;
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
  folioList: any;
  folioDetails: any;
  showUnits = false;
  bankDetails: any;
  showSpinnerFolio = false;
  platformType;
  currentValue: number;
  multiTransact = false;
  id = 0;
  isEdit = false;
  childTransactions = [];
  displayedColumns: string[] = ['no', 'folio', 'ownerName', 'amount', 'icons'];
  editedId: any;
  validatorType = ValidatorType;
  filterSchemeList: Observable<any[]>;
  folioNumberShow: any;

  constructor(private subInjectService: SubscriptionInject, private onlineTransact: OnlineTransactionService,
    private fb: FormBuilder, private eventService: EventService,
    public processTransaction: ProcessTransactionService) {
  }

  @Output() changedValue = new EventEmitter();

  @Input()
  set data(data) {
    this.inputData = data;
    this.transactionType = data.transactionType;
    this.selectedFamilyMember = data.selectedFamilyMember;
    console.log('This is Input data of FixedDepositComponent ', data);

    if (this.isViewInitCalled) {
      // this.getdataForm('');
    }
  }

  get data() {
    return this.inputData;
  }

  ngOnInit() {

    this.getdataForm(this.inputData, false);
    this.transactionSummary = {};
    this.childTransactions = [];
    this.reInvestmentOpt = [];
    Object.assign(this.transactionSummary, { familyMemberId: this.inputData.familyMemberId });
    Object.assign(this.transactionSummary, { clientId: this.inputData.clientId });
    Object.assign(this.transactionSummary, { allEdit: true });
    Object.assign(this.transactionSummary, { selectedFamilyMember: this.inputData.selectedFamilyMember });
    Object.assign(this.transactionSummary, { transactType: 'REDEEM' });
    Object.assign(this.transactionSummary, { isMultiTransact: false }); // when multi transact then disabled edit button in transaction summary
  }

  backToTransact() {
    this.changedValue.emit('step-2');
  }

  getDefaultDetails(data) {
    console.log('get defaul here yupeeee', data);
    this.getDataSummary = data;
    this.platformType = this.getDataSummary.defaultClient.aggregatorType;

    Object.assign(this.transactionSummary, { aggregatorType: this.getDataSummary.defaultClient.aggregatorType });
    this.getSchemeList();
    // this.redemptionTransaction.controls.investor.reset();
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
    }
    if (!data) {
      data = {};
    }
    if (this.dataSource) {
      data = this.dataSource;
    }
    this.redemptionTransaction = this.fb.group({
      ownerName: [(!data) ? '' : data.ownerName, [Validators.required]],
      transactionType: [(!data) ? '' : data.transactionType, [Validators.required]],
      bankAccountSelection: [(!data) ? '' : data.bankAccountSelection, [Validators.required]],
      schemeSelection: [(!data) ? '' : data.schemeSelection, [Validators.required]],
      balanceUnit:[(!data) ? '' : data.balanceUnit,],
      currentValue:[(!data) ? '' : data.currentValue,],
      // investor: [(!data) ? '' : this.scheme, [Validators.required]],
      employeeContry: [(!data) ? '' : data.orderVal, [Validators.required]],
      redeemType: [(data.redeemType) ? data.redeemType : '1', [Validators.required]],
      modeOfPaymentSelection: [(!data) ? '' : data.modeOfPaymentSelection, [Validators.required]],
      folioSelection: [(data.folioNo) ? data.folioNo : '', [Validators.required]],
      redeem: [(!data) ? '' : data.switchType, [Validators.required]],
      schemeRedeem: [(!data) ? '' : data.schemeName, [Validators.required]],

    });
    this.filterSchemeList = this.redemptionTransaction.controls.schemeRedeem.valueChanges.pipe(
      startWith(''),
      map(value => this.processTransaction.filterScheme(value + '', this.schemeList))
    );
    this.ownerData = this.redemptionTransaction.controls;
    if (data.folioNo) {
      this.scheme.mutualFundSchemeMasterId = data.mutualFundSchemeMasterId;
      this.getSchemeWiseFolios();
    }
  }

  enteredAmount(value) {
    Object.assign(this.transactionSummary, { enteredAmount: value });
  }

  getFormControl(): any {
    return this.redemptionTransaction.controls;
  }

  getSchemeList() {

    if (this.redemptionTransaction.get('schemeRedeem').invalid) {
      this.showSpinner = false;
      this.folioList = [];
      Object.assign(this.transactionSummary, { schemeName: '' });
      Object.assign(this.transactionSummary, { folioNumber: '' });
    }
    const obj = {
      bseOrderType: 'REDEMPTION',
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
        this.redemptionTransaction.get('schemeRedeem').setErrors({ setValue: error.message });
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
    console.log('bank details', bank[0]);
  }

  onFolioChange(folio) {
    this.redemptionTransaction.controls.folioSelection.setValue('');
  }

  selectedScheme(scheme) {
    this.scheme = scheme;
    Object.assign(this.transactionSummary, { schemeName: scheme.schemeName });
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
    console.log('getSchemeDetailsRes == ', data);
    this.maiSchemeList = data;
    this.schemeDetails = data[0];
    this.redemptionTransaction.controls.employeeContry.setValidators([Validators.min(this.schemeDetails.redemptionAmountMinimum)]);
    this.schemeDetails.selectedFamilyMember = this.selectedFamilyMember;
    if (data.length > 1) {
      this.reInvestmentOpt = data;
      console.log('reinvestment', this.reInvestmentOpt);
    }
    if (data.length == 1) {
      this.reInvestmentOpt = [];
    }
    this.getSchemeWiseFolios();
  }

  reinvest(scheme) {
    this.schemeDetails = scheme;
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
    console.log('res scheme folio', data);
    this.folioList = data;
    if(this.folioList.length == 1){
      this.folioNumberShow = this.folioList[0].folioNumber
    }
    if (this.redemptionTransaction.get('folioSelection').valid) {
      Object.assign(this.transactionSummary, { folioNumber: this.folioList[0].folioNumber });
    }
  }

  selectedFolio(folio) {
    this.showUnits = true;
    this.redemptionTransaction.controls.balanceUnit.setValue((folio.balanceUnit).toFixed(2))
    this.redemptionTransaction.controls.currentValue.setValue((this.processTransaction.calculateCurrentValue(this.navOfSelectedScheme, folio.balanceUnit)).toFixed(2))
    this.currentValue = this.processTransaction.calculateCurrentValue(this.navOfSelectedScheme, folio.balanceUnit);
    Object.assign(this.transactionSummary, { folioNumber: folio.folioNumber });
    Object.assign(this.transactionSummary, { mutualFundId: folio.id });
    Object.assign(this.transactionSummary, { tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId });
    this.transactionSummary = { ...this.transactionSummary };
    this.folioDetails = folio;
  }

  redeem() {

    if (this.redemptionTransaction.get('folioSelection').invalid) {
      this.redemptionTransaction.get('folioSelection').markAsTouched();
    } else if (this.redemptionTransaction.get('redeemType').invalid) {
      this.redemptionTransaction.get('redeemType').markAsTouched();
      return;

    } else if ((this.redemptionTransaction.get('redeemType').value) != '3' &&
      this.redemptionTransaction.get('employeeContry').invalid) {
      this.redemptionTransaction.get('employeeContry').markAsTouched();
    } else {
      const obj = {
        productDbId: this.schemeDetails.id,
        clientName: this.selectedFamilyMember,
        holdingNature: this.getDataSummary.defaultClient.holdingType,
        mutualFundSchemeMasterId: this.scheme.mutualFundSchemeMasterId,
        productCode: this.schemeDetails.schemeCode,
        isin: this.schemeDetails.isin,
        folioNo: (this.folioDetails == undefined) ? null : this.folioDetails.folioNumber,
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
        orderVal: this.redemptionTransaction.controls.employeeContry.value,
        amountType: (this.redemptionTransaction.controls.redeemType.value == 1) ? 'Amount' : 'Unit',
        qty: (this.redemptionTransaction.controls.redeemType.value == 1) ? 0 : (this.redemptionTransaction.controls.redeemType.value == 3) ? this.schemeDetails.balance_units : this.redemptionTransaction.controls.employeeContry.value,
        schemeCd: this.schemeDetails.schemeCode,
        euin: this.getDataSummary.euin.euin,
        bseDPTransType: 'PHYSICAL',
        aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
        allRedeem: (this.redemptionTransaction.controls.redeemType.value == 3) ? true : false,
        bankDetailId: null,
        nsePaymentMode: null,
        isException: true,
        childTransactions: [],
        tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId,

        // teamMemberSessionId: redemptionTransaction.localStorage.mm.mainDetail.userDetails.teamMemberSessionId,
      };
      if (this.getDataSummary.defaultClient.aggregatorType == 1) {
        obj.bankDetailId = this.bankDetails.id;
        obj.nsePaymentMode = 'ONLINE';
      }
      console.log('redeem obj json', obj);
      if (this.multiTransact == true) {
        console.log('new purchase obj', this.childTransactions);
        this.AddMultiTransaction();
        obj.childTransactions = this.childTransactions;
      }
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
    console.log('redeem res', data);
    if (data == undefined) {

    } else {
      this.processTransaction.onAddTransaction('confirm', this.transactionSummary);
      Object.assign(this.transactionSummary, { allEdit: false });
    }
  }

  AddMultiTransaction() {
    Object.assign(this.transactionSummary, { isMultiTransact: true });

    if (this.isEdit != true) {
      this.id++;
    }
    if (this.reInvestmentOpt.length > 1) {
      if (this.redemptionTransaction.get('reinvest').invalid) {
        this.redemptionTransaction.get('reinvest').markAsTouched();
      }
    } else if (this.redemptionTransaction.get('schemeRedeem').invalid) {
      this.redemptionTransaction.get('schemeRedeem').markAsTouched();
      return;
    } else if (this.redemptionTransaction.get('folioSelection').invalid) {
      this.redemptionTransaction.get('folioSelection').markAsTouched();
      return;
    } else if (this.redemptionTransaction.get('redeemType').invalid) {
      this.redemptionTransaction.get('redeemType').markAsTouched();
      return;

    } else if (this.redemptionTransaction.get('employeeContry').invalid) {
      this.redemptionTransaction.get('employeeContry').markAsTouched();
    } else {
      this.multiTransact = true;
      if (this.scheme != undefined && this.schemeDetails != undefined && this.redemptionTransaction != undefined) {
        const obj = {
          id: this.id,
          amcId: this.scheme.amcId,
          productDbId: this.schemeDetails.id,
          mutualFundSchemeMasterId: this.scheme.mutualFundSchemeMasterId,
          folioNo: (this.folioDetails == undefined) ? null : this.folioDetails.folioNumber,
          productCode: this.schemeDetails.schemeCode,
          dividendReinvestmentFlag: this.schemeDetails.dividendReinvestmentFlag,
          orderVal: this.redemptionTransaction.controls.employeeContry.value,
          allRedeem: (this.redemptionTransaction.controls.redeemType.value == 3) ? true : false,
          amountType: (this.redemptionTransaction.controls.redeemType.value == 1) ? 'Amount' : 'Unit',
          qty: (this.redemptionTransaction.controls.redeemType.value == 1) ? 0 : (this.redemptionTransaction.controls.redeemType.value == 3) ? this.schemeDetails.balance_units : this.redemptionTransaction.controls.employeeContry.value,
          bankDetailId: this.bankDetails.id,
          schemeName: this.scheme.schemeName,
          redeemType: this.redemptionTransaction.get('redeemType').value

        };
        if (this.isEdit == true) {
          this.childTransactions.forEach(element => {
            if (element.id == this.editedId) {
              element.id = this.editedId;
              element.mutualFundSchemeMasterId = (this.scheme) ? this.scheme.mutualFundSchemeMasterId : null;
              element.folioNo = this.redemptionTransaction.get('folioSelection').value;
              element.orderVal = this.redemptionTransaction.get('employeeContry').value;
              element.schemeName = this.redemptionTransaction.get('schemeRedeem').value;
              element.redeemType = this.redemptionTransaction.get('redeemType').value;
            }
            console.log(element);
          });
          this.isEdit = false;
        } else {
          this.childTransactions.push(obj);
        }
        console.log(this.childTransactions);
        this.schemeList = [];
        this.redemptionTransaction.controls.employeeContry.reset();
        this.redemptionTransaction.controls.folioSelection.reset();
        this.redemptionTransaction.controls.schemeRedeem.reset();
        this.showUnits = false;
      }
    }
  }
}
