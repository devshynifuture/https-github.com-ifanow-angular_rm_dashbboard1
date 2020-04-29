import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SubscriptionInject} from '../../../../Subscriptions/subscription-inject.service';
import {FormBuilder, Validators} from '@angular/forms';
import {OnlineTransactionService} from '../../../online-transaction.service';
import {ProcessTransactionService} from '../process-transaction.service';
import {EventService} from 'src/app/Data-service/event.service';
import {MatProgressButtonOptions} from 'src/app/common/progress-button/progress-button.component';
import {UtilService} from '../../../../../../../services/util.service';

@Component({
  selector: 'app-sip-transaction',
  templateUrl: './sip-transaction.component.html',
  styleUrls: ['./sip-transaction.component.scss']
})
export class SipTransactionComponent implements OnInit {
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
  scheme: any;
  navOfSelectedScheme: any;
  maiSchemeList: any;
  reInvestmentOpt = [];
  getDataSummary: any;
  folioList: any;
  folioDetails: any;
  ExistingOrNew: any = 2;
  sipFrequency: any;
  dateDisplay: any;
  sipDate: any;
  dates: any;
  showSpinner = false;
  showUnits = false;
  mandateDetails: any;
  frequency: any;
  fre: any;
  achMandateNSE: any;
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

  constructor(private subInjectService: SubscriptionInject, private onlineTransact: OnlineTransactionService,
              private processTransaction: ProcessTransactionService, private fb: FormBuilder,
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
      this.getdataForm('', false);
    }
  }

  get data() {
    return this.inputData;
  }

  ngOnInit() {
    this.getdataForm(this.inputData, false);
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
  }

  getSchemeList(value) {
    this.showSpinner = true;
    if (this.sipTransaction.get('schemeSip').invalid) {
      this.showSpinner = false;
      Object.assign(this.transactionSummary, {schemeName: ''});
      Object.assign(this.transactionSummary, {folioNumber: ''});
      // if scheme not present then min amt is 0
      (this.schemeDetails) ? (this.schemeDetails.minAmount = 0) : 0;
    }
    const obj = {
      searchQuery: value,
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
    if (value.length > 2) {
      if (this.selectScheme == 2) {
        this.onlineTransact.getNewSchemes(obj).subscribe(
          data => this.getNewSchemesRes(data), (error) => {
            this.showSpinner = false;
            this.sipTransaction.get('schemeSip').setErrors({setValue: error.message});
            this.sipTransaction.get('schemeSip').markAsTouched();
            (this.schemeDetails) ? (this.schemeDetails.minAmount = 0) : 0;
            // this.eventService.showErrorMessage(error);
          }
        );
      } else {
        this.onlineTransact.getExistingSchemes(obj).subscribe(
          data => this.getExistingSchemesRes(data), (error) => {
            this.showSpinner = false;
            this.sipTransaction.get('schemeSip').setErrors({setValue: error.message});
            this.sipTransaction.get('schemeSip').markAsTouched();
            (this.schemeDetails) ? (this.schemeDetails.minAmount = 0) : 0;
            // this.eventService.showErrorMessage(error);
          }
        );
      }
    }
  }

  getNewSchemesRes(data) {
    this.getNSEAchmandate();
    this.showSpinner = false;
    console.log('new schemes', data);
    this.schemeList = data;
  }

  getExistingSchemesRes(data) {
    this.getNSEAchmandate();
    this.showSpinner = false;
    this.schemeList = data;
  }

  getDefaultDetails(data) {
    console.log('get defaul here yupeeee', data);
    this.getDataSummary = data;
    // this.sipTransaction.controls.investor.reset();
    this.platformType = this.getDataSummary.defaultClient.aggregatorType;
    Object.assign(this.transactionSummary, {aggregatorType: this.platformType});
  }

  selectPaymentMode(value) {
    Object.assign(this.transactionSummary, {paymentMode: value});
    if (value == 2) {
      Object.assign(this.transactionSummary, {getAch: true});
      this.getNSEAchmandate();
    }
  }

  selectedScheme(scheme) {
    this.scheme = scheme;
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
        this.eventService.showErrorMessage(error);
      }
    );
  }

  getSchemeDetailsRes(data) {
    console.log('getSchemeDetailsRes == ', data);
    this.maiSchemeList = data;
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
    if (this.getDataSummary.defaultClient.aggregatorType == 2) {
      this.getMandateDetails();
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

  getNSEAchmandate() {
    this.showSpinnerMandate = true;
    const obj1 = {
      tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId
    };
    this.onlineTransact.getMandateList(obj1).subscribe(
      data => this.getNSEAchmandateRes(data), (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }

  getNSEAchmandateRes(data) {
    this.showSpinnerMandate = false;
    this.umrn = data[0].umrnNo;
    console.log('getNSEAchmandateRes', data);
    if (data.length > 1) {
      Object.assign(this.transactionSummary, {showUmrnEdit: true});
    }
    this.achMandateNSE = data.filter(element => element.statusString == 'ACCEPTED');
    console.log('this.achMandateNSE', this.achMandateNSE);
    this.achMandateNSE = this.achMandateNSE[0];
    Object.assign(this.transactionSummary, {umrnNo: this.achMandateNSE.umrnNo});
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
    this.sipFrequency = data;
    this.sipFrequency = data.filter(function(element) {
      return element.frequency;
    });
  }

  selectedFrequency(getFrerq) {
    this.fre = getFrerq;
    this.frequency = getFrerq.frequency;
    this.sipTransaction.controls.employeeContry.setValidators([Validators.min(getFrerq.additionalPurchaseAmount)]);
    this.dateArray(getFrerq.sipDates);
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

  getbankDetails(value) {
    this.bankDetails = value[0];
    console.log('bank details', value);
  }

  onFolioChange(folio) {
    this.sipTransaction.controls.investmentAccountSelection.reset();
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
    console.log('mandate details :', data[0]);
    this.mandateDetails = data;
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
          this.sipTransaction.get('folioSelection').setValue(2);
          this.ExistingOrNew = 2;
          this.eventService.showErrorMessage(error);
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
          this.sipTransaction.get('folioSelection').setValue(2);
          this.ExistingOrNew = 2;
          this.eventService.showErrorMessage(error);
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
    this.sipTransaction = this.fb.group({
      ownerName: [(!data) ? '' : data.ownerName, [Validators.required]],
      transactionType: [(!data) ? '' : data.transactionType, [Validators.required]],
      bankAccountSelection: [(!data) ? '' : data.bankAccountSelection, [Validators.required]],
      schemeSelection: ['2'],
      // investor: [(!data) ? '' : data.investor, [Validators.required]],
      reinvest: [(!data) ? '' : data.reinvest, [Validators.required]],
      employeeContry: [(!data) ? '' : data.orderVal, [Validators.required]],
      frequency: [(!data) ? '' : data.frequencyType, [Validators.required]],
      investmentAccountSelection: [(!data) ? '' : data.folioNo, [Validators.required]],
      // modeOfPaymentSelection: ['1'],
      modeOfPaymentSelection: [(!data.modeOfPaymentSelection) ? '1' : data.modeOfPaymentSelection],
      folioSelection: [(!data.folioSelection) ? '2' : data.folioSelection],
      selectInvestor: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      date: [(!data) ? '' : data.date, [Validators.required]],
      tenure: [(!data) ? '' : data.tenure, [Validators.required]],
      installment: [(!data) ? '' : data.noOfInstallments, [Validators.required]],
      schemeSip: [(!data) ? '' : data.schemeName, [Validators.required]],

    });
    this.ownerData = this.sipTransaction.controls;
    if (data.folioNo) {
      this.scheme.amcId = data.scheme.amcId;
      this.schemeDetails.isin = data.isIn;
      this.selectedScheme(data.scheme);
      // this.getFrequency()
      // this.getAmcWiseFolio()
    }
  }

  getFormControl(): any {
    return this.sipTransaction.controls;
  }

  sip() {
    if (this.reInvestmentOpt.length > 1) {
      if (this.sipTransaction.get('reinvest').invalid) {
        this.sipTransaction.get('reinvest').markAsTouched();
        return;
      }
    } else if (this.sipTransaction.get('folioSelection').value == 1 && this.sipTransaction.get('investmentAccountSelection').invalid) {
      this.sipTransaction.get('investmentAccountSelection').markAsTouched();
      return;
    } else if (this.sipTransaction.get('employeeContry').invalid) {
      this.sipTransaction.get('employeeContry').markAsTouched();
      return;
    } else if (this.sipTransaction.get('date').invalid) {
      this.sipTransaction.get('date').markAsTouched();
      return;
    } else if (this.sipTransaction.get('frequency').invalid) {
      this.sipTransaction.get('frequency').markAsTouched();
      return;
    } else {

      let obj = {
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
        startDate: Number(UtilService.getEndOfDay(UtilService.getEndOfDay(new Date(this.sipTransaction.controls.date.value.replace(/"/g, ''))))),
        frequencyType: this.frequency,
        noOfInstallments: this.sipTransaction.controls.installment.value,
        orderType: 'SIP', // (this.mandateDetails==undefined)?null:this.mandateDetails[0].mandateType,
        mandateType: (this.mandateDetails == undefined) ? null : this.mandateDetails[0].mandateType,
        buySell: 'PURCHASE',
        transCode: 'NEW',
        buySellType: 'FRESH',
        dividendReinvestmentFlag: this.schemeDetails.dividendReinvestmentFlag,
        amountType: 'Amount',
        clientCode: this.getDataSummary.defaultClient.clientCode,
        orderVal: this.sipTransaction.controls.employeeContry.value,
        euin: this.getDataSummary.euin.euin,
        xSipMandateId: (this.mandateDetails == undefined) ? null : this.mandateDetails[0].mandateId,
        aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
        schemeCd: this.schemeDetails.schemeCode,
        transMode: 'PHYSICAL',
        bseDPTransType: 'PHYSICAL',
        mandateId: null,
        bankDetailId: null,
        nsePaymentMode: null,
        childTransactions: []
        // teamMemberSessionId: sipTransaction.localStorage.mm.mainDetail.userDetails.teamMemberSessionId,
      };
      if (this.getDataSummary.defaultClient.aggregatorType == 1) {
        obj.mandateId = (this.achMandateNSE == undefined) ? null : this.achMandateNSE.id;
        obj.bankDetailId = this.bankDetails.id;
        obj.nsePaymentMode = (this.sipTransaction.controls.modeOfPaymentSelection.value == 2) ? 'DEBIT_MANDATE' : 'ONLINE';
      }
      console.log('sip json', obj);
      const tenure = this.sipTransaction.controls.tenure.value;
      const installment = this.sipTransaction.controls.installment.value;
      obj = this.processTransaction.checkInstallments(obj, tenure, installment);

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

          this.eventService.showErrorMessage(error);
        }
      );
    }
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
          mandateId: this.achMandateNSE.id,
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
        obj = this.processTransaction.checkInstallments(obj, tenure, installment);
        if (this.isEdit == true) {
          this.childTransactions.forEach(element => {
            if (element.id == this.editedId) {
              element.id = this.editedId;
              element.date = this.sipTransaction.controls.date.value,
                element.mutualFundSchemeMasterId = this.scheme.mutualFundSchemeMasterId,
                element.amc = (this.scheme) ? this.scheme.amcId : null;
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
}
