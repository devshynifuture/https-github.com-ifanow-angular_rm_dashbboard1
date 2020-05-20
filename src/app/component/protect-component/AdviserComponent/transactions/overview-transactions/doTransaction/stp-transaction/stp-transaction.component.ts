import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {SubscriptionInject} from '../../../../Subscriptions/subscription-inject.service';
import {OnlineTransactionService} from '../../../online-transaction.service';
import {ProcessTransactionService} from '../process-transaction.service';
import {EventService} from 'src/app/Data-service/event.service';
import {MatProgressButtonOptions} from 'src/app/common/progress-button/progress-button.component';
import {UtilService, ValidatorType} from '../../../../../../../services/util.service';
import {Observable, of} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-stp-transaction',
  templateUrl: './stp-transaction.component.html',
  styleUrls: ['./stp-transaction.component.scss']
})
export class StpTransactionComponent implements OnInit {

  isSuccessfulTransaction = false;
  folioNumberShow: any;
  defaultFrequency: any;

  constructor(private subInjectService: SubscriptionInject, private onlineTransact: OnlineTransactionService,
              public processTransaction: ProcessTransactionService, private eventService: EventService,
              private fb: FormBuilder) {
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
  existingSchemeList = [];
  schemeListTransfer: any;
  schemeDetailsTransfer: any;
  schemeTransfer: any;
  bankDetails: any;
  showSpinnerFolio = false;
  showSpinnerTrans = false;
  currentValue: number;
  multiTransact = false;
  childTransactions = [];
  displayedColumns: string[] = ['no', 'folio', 'ownerName', 'amount'];
  validatorType = ValidatorType;
  filterSchemeList: Observable<any[]>;
  filterNewSchemeList: Observable<any[]>;

  @Output() changedValue = new EventEmitter();

  @Input()
  set data(data) {
    this.inputData = data;
    this.transactionType = data.transactionType;
    this.selectedFamilyMember = data.selectedFamilyMember;
    console.log('This is Input data of FixedDepositComponent ', data);

    if (this.isViewInitCalled) {
      this.getDataForm('');
    }
  }

  ngOnInit() {
    this.getDataForm(this.inputData);
    this.childTransactions = [];
    this.transactionSummary = {};
    Object.assign(this.transactionSummary, {familyMemberId: this.inputData.familyMemberId});
    Object.assign(this.transactionSummary, {clientId: this.inputData.clientId});
    Object.assign(this.transactionSummary, {allEdit: true});
    Object.assign(this.transactionSummary, {transactType: 'STP'});
    Object.assign(this.transactionSummary, {selectedFamilyMember: this.inputData.selectedFamilyMember});
    Object.assign(this.transactionSummary, {multiTransact: false});
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
    if (!(this.existingSchemeList && this.existingSchemeList.length > 0)) {
      this.getSchemeList();
    }
    this.stpTransaction.controls.transferIn.reset();
  }

  onFolioChange(folio) {
    this.stpTransaction.controls.folioSelection.reset();
  }

  getSchemeListTranfer(value) {
    // this.getNewSchemesRes([]);
    if (this.stpTransaction.get('transferIn').invalid) {
      this.showSpinnerTrans = false;
      Object.assign(this.transactionSummary, {schemeNameTranfer: ''});
    }
    if (this.selectScheme == 2 && value.length > 2) {
      this.showSpinnerTrans = true;
      const obj = {
        amcId: this.scheme.amcId,
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
          // this.eventService.openSnackBar(error, 'Dismiss');
        }
      );
    }
  }

  getNewSchemesRes(data) {
    this.showSpinnerTrans = false;
    console.log('new schemes', data);
    this.schemeListTransfer = data;
    if (this.stpTransaction.controls.transferIn.valueChanges) {
      this.filterNewSchemeList = of(this.processTransaction.filterScheme(this.stpTransaction.controls.transferIn.value, this.schemeListTransfer));
    } else {
      this.stpTransaction.controls.transferIn.setValue('');
    }

  }

  getSchemeList() {
    if (this.stpTransaction.get('schemeStp').invalid) {
      this.showSpinner = true;
      Object.assign(this.transactionSummary, {schemeName: ''});
      Object.assign(this.transactionSummary, {folioNumber: ''});
      (this.schemeDetails) ? (this.schemeDetails.minimumPurchaseAmount = 0) : 0; // if scheme not present then min amt is 0
    }
    if (this.selectScheme == 2) {
      this.showSpinner = true;
      const obj = {
        // searchQuery: (value == '') ? '' : value.target.value,
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
          // this.eventService.openSnackBar(error, 'Dismiss');
        }
      );
    } else {

    }
  }

  getExistingSchemesRes(data) {
    this.showSpinner = false;
    this.existingSchemeList = data;
    console.log('data schemelist res', data);
    this.stpTransaction.controls.schemeStp.setValue('');

  }

  selectedFolio(folio) {
    this.folioDetails = folio;
    this.stpTransaction.controls.balanceUnit.setValue((folio.balanceUnit).toFixed(2));
    this.stpTransaction.controls.currentValue.setValue((this.processTransaction.calculateCurrentValue(this.navOfSelectedScheme, folio.balanceUnit)).toFixed(2));
    this.currentValue = this.processTransaction.calculateCurrentValue(this.navOfSelectedScheme, folio.balanceUnit);
    this.showUnits = true;
    Object.assign(this.transactionSummary, {folioNumber: folio.folioNumber});
    Object.assign(this.transactionSummary, {mutualFundId: folio.id});
    this.transactionSummary = {...this.transactionSummary};
  }

  selectedSchemeTransfer(schemeTransfer) {
    this.showSpinnerTrans = true;
    this.schemeTransfer = schemeTransfer;
    this.switchFrequency = [];
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
        this.eventService.openSnackBar(error, 'Dismiss');
      }
    );
  }

  getSchemeDetailsTranferRes(data) {
    console.log('getSchemeDetailsTranferRes detail : ', data);

    // this.maiSchemeList = data
    this.showSpinnerTrans = false;
    this.schemeDetailsTransfer = data[0];
    this.setMinAmount();

    if (data.length > 1) {
      this.reInvestmentOpt = data;
      console.log('reinvestment', this.reInvestmentOpt);
    }
    if (data.length == 1) {
      this.reInvestmentOpt = [];
    }
    // if (this.getDataSummary.defaultClient.aggregatorType == 2) {
    //   this.getMandateDetails();
    // }
    this.getFrequency();

  }

  reinvest(scheme) {
    this.schemeDetailsTransfer = scheme;
    this.setMinAmount();
    Object.assign(this.transactionSummary, {schemeName: scheme.schemeName});
    console.log('schemeDetails == ', this.schemeDetails);
  }

  selectedScheme(scheme) {
    this.scheme = scheme;
    this.showUnits = true;
    this.showSpinner = true;
    this.folioList = [];
    this.schemeDetails = null;
    this.onFolioChange(null);
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
        this.eventService.openSnackBar(error, 'Dismiss');
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
    if (this.folioList.length == 1) {
      this.folioNumberShow = this.folioList[0].folioNumber;
    }
    if (this.stpTransaction.get('investmentAccountSelection').valid) {
      Object.assign(this.transactionSummary, {folioNumber: this.folioList[0].folioNumber});
    }
  }

  getFrequency() {
    const obj = {
      isin: this.schemeDetailsTransfer.isin,
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      orderType: 'STP'
    };
    this.onlineTransact.getSipFrequency(obj).subscribe(
      data => this.getSipFrequencyRes(data), (error) => {
        this.eventService.openSnackBar(error, 'Dismiss');
      }
    );
  }

  getSipFrequencyRes(data) {
    console.log('isin Frequency ----', data);
    // this.switchFrequency = data;
    this.switchFrequency = this.processTransaction.filterFrequencyList(data);
    if (this.switchFrequency) {
      this.switchFrequency.forEach(singleFrequency => {
        if (singleFrequency.frequency == 'MONTHLY') {
          this.defaultFrequency = singleFrequency.frequency;
          this.stpTransaction.controls.frequency.setValue(singleFrequency.frequency);
          this.selectedFrequency(singleFrequency);
        }
      });
    }
  }

  selectedFrequency(getFrerq) {
    // this.fre = getFrerq
    console.log('selected freq : ', getFrerq);
    this.frequency = getFrerq.frequency;
    // this.stpTransaction.controls.employeeContry.setValidators([Validators.min(getFrerq.sipMinimumInstallmentAmount)]);
    if (this.getDataSummary.defaultClient.aggregatorType == 1) {
      this.dateArray(getFrerq.stpDates);
    } else {
      this.dateArray(getFrerq.sipDates);
    }
  }

  setMinAmount() {
    if (this.schemeDetailsTransfer) {
      this.stpTransaction.controls.employeeContry.setValidators([Validators.required, Validators.min(this.schemeDetailsTransfer.minimumPurchaseAmount)]);
      this.stpTransaction.controls.employeeContry.updateValueAndValidity();
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
    this.subInjectService.changeNewRightSliderState({
      state: 'close',
      refreshRequired: this.isSuccessfulTransaction
    });
  }

  enteredAmount(value) {
    Object.assign(this.transactionSummary, {enteredAmount: value});
  }

  getbankDetails(value) {
    this.bankDetails = value[0];
    console.log('bank details', value);
  }

  getDataForm(data) {
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
      reinvest: [(data.reinvest) ? data.reinvest : '', [Validators.required]],
      currentValue: [data.currentValue],
      balanceUnit: [data.balanceUnit],
      employeeContry: [(!data) ? '' : data.employeeContry, [Validators.required]],
      frequency: [(data.frequency) ? data.frequency : '', [Validators.required]],
      investmentAccountSelection: [(data.investmentAccountSelection) ? data.investmentAccountSelection : '', [Validators.required]],
      modeOfPaymentSelection: [(!data) ? '' : data.modeOfPaymentSelection, [Validators.required]],
      folioSelection: [(data.folioSelection) ? data.folioSelection : '', [Validators.required]],
      selectInvestor: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      date: [(data.date) ? data.date : '', [Validators.required]],
      tenure: [(data.tenure) ? data.tenure : '', [Validators.required]],
      installment: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      STPType: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      schemeStp: [null, [Validators.required]],
      transferIn: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
    });
    this.filterSchemeList = this.stpTransaction.controls.schemeStp.valueChanges.pipe(
      startWith(''),
      map(value => this.processTransaction.filterScheme(value + '', this.existingSchemeList))
    );
    this.stpTransaction.controls.transferIn.valueChanges.subscribe((newValue) => {
      this.filterNewSchemeList = of(this.processTransaction.filterScheme(newValue + '', this.schemeListTransfer));
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
      const startDate = Number(UtilService.getEndOfDay(UtilService.getEndOfDay(new Date(this.stpTransaction.controls.date.value.replace(/"/g, '')))));
      const tenure = this.stpTransaction.controls.tenure.value;
      const noOfInstallments = this.stpTransaction.controls.installment.value;
      let obj: any = this.processTransaction.calculateInstallmentAndEndDateNew(startDate, this.frequency, tenure, noOfInstallments);

      obj = {
        ...obj,
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
        orderType: 'STP',
        buySell: 'PURCHASE',
        transCode: 'NEW',
        buySellType: 'FRESH',
        dividendReinvestmentFlag: this.schemeDetailsTransfer.dividendReinvestmentFlag,
        amountType: 'Amount',
        clientCode: this.getDataSummary.defaultClient.clientCode,
        orderVal: this.stpTransaction.controls.employeeContry.value,
        bseDPTransType: 'PHYSICAL',
        aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
        mandateId: null,
        bankDetailId: null,
        nsePaymentMode: null,
        isException: true,
        childTransactions: [],
        tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId,

      };
      if (this.getDataSummary.defaultClient.aggregatorType == 1) {
        // obj.mandateId = (this.achMandateNSE == undefined) ? null : this.achMandateNSE.id;
        obj.bankDetailId = this.bankDetails.id;
        obj.nsePaymentMode = (this.stpTransaction.controls.modeOfPaymentSelection.value == 2) ? 'DEBIT_MANDATE' : 'ONLINE';
      }
      console.log('json stp', obj);
      if (this.multiTransact == true) {
        console.log('new purchase obj', this.childTransactions);
        this.AddMultiTransaction();
        obj.childTransactions = this.childTransactions;
      }
      this.barButtonOptions.active = true;
      this.onlineTransact.transactionBSE(obj).subscribe(
        data => {
          this.stpBSERes(data);
          this.isSuccessfulTransaction = true;
        }, (error) => {
          this.barButtonOptions.active = false;
          this.eventService.openSnackBar(error, 'Dismiss');
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
          amcId: this.scheme.amcId,
          folioNo: (this.folioDetails == undefined) ? null : this.folioDetails.folioNumber,
          productCode: this.schemeDetails.schemeCode,
          dividendReinvestmentFlag: this.schemeDetails.dividendReinvestmentFlag,
          orderVal: this.stpTransaction.controls.employeeContry.value,
          bankDetailId: this.bankDetails.id,
          toIsin: this.schemeDetailsTransfer.isin,
          schemeName: this.scheme.schemeName,
          // mandateId: (this.achMandateNSE) ? this.achMandateNSE.id : null,
          productDbId: this.schemeDetails.id,
          frequencyType: this.frequency,
          startDate: Number(UtilService.getEndOfDay(new Date(this.stpTransaction.controls.date.value.replace(/"/g, '')))),
        };
        const tenure = this.stpTransaction.controls.tenure.value;
        const installment = this.stpTransaction.controls.installment.value;
        obj = this.processTransaction.calculateInstallmentAndEndDate(obj, tenure, installment);
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
