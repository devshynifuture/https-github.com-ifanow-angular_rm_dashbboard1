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

@Component({
  selector: 'app-sip-transaction',
  templateUrl: './sip-transaction.component.html',
  styleUrls: ['./sip-transaction.component.scss']
})
export class SipTransactionComponent implements OnInit {
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
  dataSource: any;
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
  fre: any;
  selectedMandate: any;
  platformType: any;
  bankDetails: any;
  showSpinnerFolio = false;
  showSpinnerMandate = false;
  multiTransact = false;
  childTransactions = [];
  id = 0;
  isEdit = false;
  editedId: any;
  displayedColumns: string[] = ['no', 'folio', 'ownerName', 'amount', 'icons'];
  umrn: any;
  validatorType = ValidatorType;
  filterSchemeList: Observable<any[]>;

  constructor(private subInjectService: SubscriptionInject, private onlineTransact: OnlineTransactionService,
              public processTransaction: ProcessTransactionService, private fb: FormBuilder,
              private eventService: EventService) {
  }

  @Output() changedValue = new EventEmitter();

  @Input()
  set data(data) {
    this.inputData = data;
    this.transactionType = data.transactionType;
    this.selectedFamilyMember = data.selectedFamilyMember;
    console.log('This is Input data of FixedDepositComponent ', data);

    if (this.isViewInitCalled) {
      this.getDataForm('', false);
    }
  }

  get data() {
    return this.inputData;
  }

  ngOnInit() {
    this.getDataForm(this.inputData, false);
    this.childTransactions = [];
    this.transactionSummary = {};
    Object.assign(this.transactionSummary, {familyMemberId: this.inputData.familyMemberId});
    Object.assign(this.transactionSummary, {clientId: this.inputData.clientId});
    Object.assign(this.transactionSummary, {transactType: 'SIP'});
    Object.assign(this.transactionSummary, {paymentMode: 1});
    Object.assign(this.transactionSummary, {allEdit: true});
    Object.assign(this.transactionSummary, {isMultiTransact: false}); // when multi transact then disabled edit button in transaction summary
    Object.assign(this.transactionSummary, {selectedFamilyMember: this.inputData.selectedFamilyMember});
  }

  backToTransact() {
    this.changedValue.emit('step-2');
  }

  enteredAmount(value) {
    Object.assign(this.transactionSummary, {enteredAmount: value});
  }

  selectExistingOrNew(value) {
    if (value == '2') {
      this.setMinAmount();
      Object.assign(this.transactionSummary, {folioNumber: ''});
    } else {
      this.getFolioList();
    }
    this.ExistingOrNew = value;
  }

  selectSchemeOption(value) {
    console.log('value selction scheme', value);
    this.sipTransaction.controls.schemeSip.reset();
    this.folioList = [];
    this.navOfSelectedScheme = 0;
    this.schemeDetails.minAmount = 0;
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
    const obj = {
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
            this.sipTransaction.get('schemeSip').setErrors({setValue: error.message});
            this.sipTransaction.get('schemeSip').markAsTouched();
            (this.schemeDetails) ? (this.schemeDetails.minAmount = 0) : 0;
            // this.eventService.openSnackBar(error, 'dismiss');
          });
      } else {

      }
    }
  }

  getNewSchemesRes(responseData, inputData) {
    this.showSchemeSpinner = false;
    console.log('new schemes', responseData);
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

    const obj = {
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
        this.sipTransaction.get('schemeSip').setErrors({setValue: error.message});
        this.sipTransaction.get('schemeSip').markAsTouched();
        (this.schemeDetails) ? (this.schemeDetails.minAmount = 0) : 0;
        // this.eventService.openSnackBar(error, 'dismiss');
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
    console.log('get defaul here yupeeee', data);
    this.getDataSummary = data;
    // this.sipTransaction.controls.investor.reset();
    this.platformType = this.getDataSummary.defaultClient.aggregatorType;
    Object.assign(this.transactionSummary, {aggregatorType: this.platformType});
    if (this.selectScheme == 1 && !(this.existingSchemeList && this.existingSchemeList.length > 0)) {
      this.getExistingScheme();
    }
    if (this.sipTransaction.controls.modeOfPaymentSelection.value == '2') {
      this.getMandateDetails();
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
    this.schemeDetails = null;
    this.sipFrequency = [];
    this.onFolioChange(null);
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
        this.eventService.openSnackBar(error, 'dismiss');
      }
    );
  }

  getSchemeDetailsRes(data) {
    console.log('getSchemeDetailsRes == ', data);
    this.schemeDetails = data[0];
    this.setMinAmount();
    this.schemeDetails.selectedFamilyMember = this.selectedFamilyMember;
    if (data.length > 1) {
      this.reInvestmentOpt = data;
      console.log('reinvestment', this.reInvestmentOpt);
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
    if (this.sipTransaction.get('schemeSelection').value == '2') {
      this.schemeDetails.minAmount = this.schemeDetails.minimumPurchaseAmount;
    } else if (this.ExistingOrNew == 1) {
      this.schemeDetails.minAmount = this.schemeDetails.additionalPurchaseAmount;
    } else {
      this.schemeDetails.minAmount = this.schemeDetails.minimumPurchaseAmount;
    }
    this.sipTransaction.controls.employeeContry.setValidators([Validators.min(this.schemeDetails.minAmount)]);

  }

  // getNSEAchmandate() {
  //   this.showSpinnerMandate = true;
  //   const obj1 = {
  //     tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId
  //   };
  //   this.onlineTransact.getMandateList(obj1).subscribe(
  //     data => this.getNSEAchmandateRes(data), (error) => {
  //       this.eventService.openSnackBar(error, 'dismiss');
  //     }
  //   );
  // }

  getMandateDetailsRes(data) {
    this.showSpinnerMandate = false;
    console.log('getNSEAchmandateRes', data);
    if (data.length > 1) {
      Object.assign(this.transactionSummary, {showUmrnEdit: true});
    }
    this.mandateDetails = this.processTransaction.filterMandateData(data);
    console.log('this.achMandateNSE', this.selectedMandate);
    this.selectedMandate = this.processTransaction.getMaxAmountMandate(this.mandateDetails);
    if (this.selectedMandate) {
      Object.assign(this.transactionSummary, {umrnNo: this.selectedMandate.umrnNo});
      Object.assign(this.transactionSummary, {selectedMandate: this.selectedMandate});
      if (this.sipTransaction.controls.modeOfPaymentSelection.value == '2') {
        // max
        this.sipTransaction.controls.employeeContry.setValidators([Validators.max(this.selectedMandate.amount)]);
        this.sipTransaction.controls.employeeContry.updateValueAndValidity();
        this.mandateAmountErrorMessage = 'Sip amount connot be greater than mandate amount';
      }
    }
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
    console.log('isin Frequency ----', data);
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
    this.fre = getFrerq;
    this.frequency = getFrerq.frequency;
    this.sipTransaction.controls.employeeContry.setValidators([Validators.min(getFrerq.additionalPurchaseAmount)]);
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
    console.log('dateDisplay = ', this.dateDisplay);
  }

  getBankDetails(value) {
    if (value && value.length > 0) {
      this.bankDetails = value[0];
      console.log('bank details', value);
    } else {
      this.eventService.openSnackBar('Bank detail not found', 'dismiss');
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
        this.showSpinnerMandate = false;
        this.mandateDetails = [];
        this.selectedMandate = null;
        this.eventService.openSnackBar('No mandate found', 'dismiss');
        this.sipTransaction.controls.modeOfPaymentSelection.setValue('1');
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
          this.sipTransaction.get('folioSelection').setValue(2);
          this.ExistingOrNew = 2;
          this.eventService.openSnackBar(error, 'dismiss');
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
          this.showSpinnerFolio = false;
          this.sipTransaction.get('folioSelection').setValue(2);
          this.ExistingOrNew = 2;
          this.eventService.openSnackBar(error, 'dismiss');
          this.setMinAmount();

        }
      );
    }
  }

  getFoliosAmcWiseRes(data) {
    this.showSpinnerFolio = false;
    console.log('getFoliosAmcWiseRes', data);
    this.folioList = data;
    if (this.sipTransaction.get('investmentAccountSelection').valid) {
      Object.assign(this.transactionSummary, {folioNumber: this.folioList[0].folioNumber});
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
    console.log('schemeDetails == ', this.schemeDetails);
  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }

  getDataForm(data, isEdit) {
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
    this.sipTransaction = this.fb.group({
      ownerName: [(!data) ? '' : data.ownerName, [Validators.required]],
      transactionType: [(!data) ? '' : data.transactionType, [Validators.required]],
      bankAccountSelection: [(!data) ? '' : data.bankAccountSelection, [Validators.required]],
      schemeSelection: ['2'],
      // investor: [(!data) ? '' : data.investor, [Validators.required]],
      reinvest: [(data.reinvest) ? data.reinvest : '', [Validators.required]],
      employeeContry: [(!data) ? '' : data.orderVal, [Validators.required]],
      frequency: [(data.frequencyType) ? data.frequencyType : '', [Validators.required]],
      investmentAccountSelection: [(data.folioNo) ? data.folioNo : '', [Validators.required]],
      // modeOfPaymentSelection: ['1'],
      modeOfPaymentSelection: [(!data.modeOfPaymentSelection) ? '1' : data.modeOfPaymentSelection],
      folioSelection: [(!data.folioSelection) ? '2' : data.folioSelection],
      selectInvestor: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      date: [(data.date) ? data.date : '', [Validators.required]],
      tenure: [(data.tenure) ? data.tenure : '3', [Validators.required]],
      installment: [(!data) ? '' : data.noOfInstallments, [Validators.required]],
      schemeSip: [(!data) ? '' : data.schemeName, [Validators.required]],
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
      this.scheme.amcId = data.scheme.amcId;
      this.schemeDetails.isin = data.isIn;
      this.selectedScheme(data.scheme);
    }
  }

  getFormControl(): any {
    return this.sipTransaction.controls;
  }

  sip() {
    if (this.validateSingleTransaction()) {
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
        holdingNature: this.getDataSummary.defaultClient.holdingType,
        mutualFundSchemeMasterId: this.scheme.mutualFundSchemeMasterId,
        productCode: this.schemeDetails.schemeCode,
        isin: this.schemeDetails.isin,
        umrn: this.umrn,
        folioNo: (this.folioDetails == undefined) ? null : this.folioDetails.folioNumber,
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
        mandateId: null,
        bankDetailId: null,
        nsePaymentMode: null,
        mandateType: null,
        xSipMandateId: null,
        childTransactions: [],
        tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId,

        // teamMemberSessionId: sipTransaction.localStorage.mm.mainDetail.userDetails.teamMemberSessionId,
      };
      // const tenure = this.sipTransaction.controls.tenure.value;
      // const installment = this.sipTransaction.controls.installment.value;
      // obj = this.processTransaction.checkInstallments(obj, tenure, installment);

      if (this.getDataSummary.defaultClient.aggregatorType == 1) {
        obj.mandateId = (this.selectedMandate) ? this.selectedMandate.id : null;
        obj.bankDetailId = this.bankDetails.id;
        obj.nsePaymentMode = (this.sipTransaction.controls.modeOfPaymentSelection.value == '2') ? 'DEBIT_MANDATE' : 'ONLINE';
      } else {
        obj.mandateType = (this.selectedMandate) ? this.selectedMandate.mandateType : null;
        obj.xSipMandateId = (this.selectedMandate) ? this.selectedMandate.mandateId : null;
      }


      console.log('sip json', obj);

      if (this.multiTransact == true) {
        console.log('new purchase obj', this.childTransactions);
        this.AddMultiTransaction();
        obj.childTransactions = this.childTransactions;
      }
      this.barButtonOptions.active = true;
      this.onlineTransact.transactionBSE(obj).subscribe(
        data => {
          this.sipBSERes(data);
        }, (error) => {
          this.barButtonOptions.active = false;
          this.eventService.openSnackBar(error, 'dismiss');
        }
      );
    }
  }


  validateSingleTransaction() {
    if (this.reInvestmentOpt.length > 1 && this.sipTransaction.get('reinvest').invalid) {
      this.sipTransaction.get('reinvest').markAsTouched();
    } else if (this.sipTransaction.get('folioSelection').value == 1 && this.sipTransaction.get('investmentAccountSelection').invalid) {
      this.sipTransaction.get('investmentAccountSelection').markAsTouched();
    } else if (this.sipTransaction.get('employeeContry').invalid) {
      this.sipTransaction.get('employeeContry').markAsTouched();
    } else if (this.sipTransaction.get('date').invalid) {
      this.sipTransaction.get('date').markAsTouched();
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
    console.log('sip', data);
    if (data == undefined) {

    } else {
      this.processTransaction.onAddTransaction('confirm', this.transactionSummary);
      Object.assign(this.transactionSummary, {allEdit: false});
    }
  }

  AddMultiTransaction() {
    Object.assign(this.transactionSummary, {isMultiTransact: true});
    if (this.isEdit != true) {
      this.id++;
    }
    if (this.reInvestmentOpt.length > 1) {
      if (this.sipTransaction.get('reinvest').invalid) {
        this.sipTransaction.get('reinvest').markAsTouched();
      }
    } else if (this.sipTransaction.get('schemeSip').invalid) {
      this.sipTransaction.get('schemeSip').markAsTouched();
      return;
    } else if (this.ExistingOrNew == 1 && this.sipTransaction.get('investmentAccountSelection').invalid) {
      this.sipTransaction.get('investmentAccountSelection').markAsTouched();
      return;
    } else if (this.sipTransaction.get('frequency').invalid) {
      this.sipTransaction.get('frequency').markAsTouched();
      return;
    } else if (this.sipTransaction.get('employeeContry').invalid) {
      this.sipTransaction.get('employeeContry').markAsTouched();
      return;
    } else if (this.sipTransaction.get('date').invalid) {
      this.sipTransaction.get('date').markAsTouched();
      return;
    } else if (this.sipTransaction.get('tenure').invalid) {
      this.sipTransaction.get('tenure').markAsTouched();
      return;
    } else if (this.sipTransaction.get('installment').invalid) {
      this.sipTransaction.get('installment').markAsTouched();
      return;
    } else {
      this.multiTransact = true;
      if (this.scheme != undefined && this.schemeDetails != undefined && this.sipTransaction != undefined) {
        let obj = {
          id: this.id,
          amc: this.scheme.amcId,
          folioNo: (this.folioDetails == undefined) ? null : this.folioDetails.folioNumber,
          scheme: this.scheme,
          productCode: this.schemeDetails.schemeCode,
          dividendReinvestmentFlag: this.schemeDetails.dividendReinvestmentFlag,
          orderVal: this.sipTransaction.controls.employeeContry.value,
          bankDetailId: (this.bankDetails) ? this.bankDetails.id : null,
          schemeName: this.scheme.schemeName,
          mandateId: this.selectedMandate.id,
          noOfInstallments: this.sipTransaction.controls.installment.value,
          productDbId: this.schemeDetails.id,
          frequencyType: this.frequency,
          startDate: Number(UtilService.getEndOfDay(new Date(this.sipTransaction.controls.date.value.replace(/"/g, '')))),
          schemeSelection: this.sipTransaction.get('schemeSelection').value,
          folioSelection: this.sipTransaction.get('folioSelection').value,
          modeOfPaymentSelection: this.sipTransaction.get('modeOfPaymentSelection').value,
          tenure: this.sipTransaction.controls.tenure.value,
          isIn: this.schemeDetails.isin,
          date: this.sipTransaction.controls.date.value
        };
        const tenure = this.sipTransaction.controls.tenure.value;
        const installment = this.sipTransaction.controls.installment.value;
        obj = this.processTransaction.calculateInstallmentAndEndDate(obj, tenure, installment);
        if (this.isEdit == true) {
          this.childTransactions.forEach(element => {
            if (element.id == this.editedId) {
              element.id = this.editedId;
              element.date = this.sipTransaction.controls.date.value;
              element.mutualFundSchemeMasterId = this.scheme.mutualFundSchemeMasterId;
              element.amcId = (this.scheme) ? this.scheme.amcId : null;
              element.folioNo = this.sipTransaction.get('investmentAccountSelection').value;
              element.orderVal = this.sipTransaction.get('employeeContry').value;
              element.schemeName = this.sipTransaction.get('schemeSip').value;
              element.schemeSelection = this.sipTransaction.get('schemeSelection').value;
              element.folioSelection = this.sipTransaction.get('folioSelection').value;
              element.modeOfPaymentSelection = this.sipTransaction.get('modeOfPaymentSelection').value;
            }
            console.log(element);
          });
          this.isEdit = false;
        } else {
          this.childTransactions.push(obj);
        }
        console.log(this.childTransactions);
        this.schemeList = [];
        this.sipTransaction.controls.date.reset();
        this.sipTransaction.controls.tenure.reset();
        this.sipTransaction.controls.installment.reset();
        this.sipTransaction.controls.frequency.reset();
        this.sipTransaction.controls.employeeContry.reset();
        this.sipTransaction.controls.investmentAccountSelection.reset();
        this.sipTransaction.controls.schemeSip.reset();
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
}
