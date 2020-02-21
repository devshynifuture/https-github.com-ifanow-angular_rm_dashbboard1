import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { ConfirmationTransactionComponent } from '../confirmation-transaction/confirmation-transaction.component';
import { UtilService } from 'src/app/services/util.service';
import { OnlineTransactionService } from '../../../online-transaction.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ProcessTransactionService } from '../process-transaction.service';

@Component({
  selector: 'app-switch-transaction',
  templateUrl: './switch-transaction.component.html',
  styleUrls: ['./switch-transaction.component.scss']
})
export class SwitchTransactionComponent implements OnInit {
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
  schemeList: any;
  showUnits = false;
  getDataSummary: any;
  showSpinner = false;
  scheme: any;
  folioList: any;
  folioDetails: any;
  schemeTransfer: any;
  schemeDetailsTransfer: any;
  schemeListTransfer: any;
  showSpinnerFolio = false
  showSpinnerTran = false;
  currentValue: number;
  multiTransact = false;
  childTransactions = [];
  displayedColumns: string[] = ['no', 'folio', 'ownerName', 'amount'];
  constructor(private subInjectService: SubscriptionInject, private onlineTransact: OnlineTransactionService,
    private fb: FormBuilder, private eventService: EventService, private processTransaction: ProcessTransactionService) { }
  @Input()
  set data(data) {
    this.inputData = data;
    this.transactionType = data.transactionType
    this.selectedFamilyMember = data.selectedFamilyMember
    console.log('This is Input data of FixedDepositComponent ', data);

    if (this.isViewInitCalled) {
      this.getdataForm('');
    }
  }

  get data() {
    return this.inputData;
  }

  ngOnInit() {
    this.transactionSummary = {}
    this.childTransactions = []
    this.getdataForm(this.inputData)
    Object.assign(this.transactionSummary, { transactType: 'SWITCH' });
    Object.assign(this.transactionSummary, { allEdit: true });
    Object.assign(this.transactionSummary, { selectedFamilyMember: this.inputData.selectedFamilyMember });
  }
  getDefaultDetails(data) {
    console.log('get defaul here yupeeee', data)
    this.getDataSummary = data
    Object.assign(this.transactionSummary, { aggregatorType: this.getDataSummary.defaultClient.aggregatorType });
    this.switchTransaction.controls.transferIn.reset();
  }
  getSchemeList(value) {
    this.showSpinner = true
    if (this.selectScheme == 2 && value.length > 2) {
      let obj = {
        searchQuery: value,
        bseOrderType: 'ORDER',
        aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
        advisorId: 414,
        tpUserCredentialId: this.getDataSummary.defaultClient.tpUserCredentialId,
        familyMemberId: this.getDataSummary.defaultClient.familyMemberId,
        clientId: this.getDataSummary.defaultClient.clientId,
        userAccountType: this.getDataSummary.defaultCredential.accountType,
        holdingType: this.getDataSummary.defaultClient.holdingType,
        tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId,
      }
      this.onlineTransact.getExistingSchemes(obj).subscribe(
        data => this.getExistingSchemesRes(data), (error) => {
          this.eventService.showErrorMessage(error);
        }
      );
    } else {

    }
  }
  getExistingSchemesRes(data) {
    this.showSpinner = false
    this.schemeList = data
  }
  onFolioChange(folio) {
    this.switchTransaction.controls.folioSelection.reset()
  }
  selectedFolio(folio) {
    this.folioDetails = folio
    this.currentValue = this.processTransaction.calculateCurrentValue(this.navOfSelectedScheme, folio.balanceUnit)
    this.showUnits = true
    Object.assign(this.transactionSummary, { folioNumber: folio.folioNumber });
    Object.assign(this.transactionSummary, { mutualFundId: folio.id });
    Object.assign(this.transactionSummary, { tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId });
    this.transactionSummary = { ...this.transactionSummary };
  }
  selectedScheme(scheme) {
    this.showSpinner = true
    this.scheme = scheme
    this.showUnits = true
    Object.assign(this.transactionSummary, { schemeName: scheme.schemeName });
    this.navOfSelectedScheme = scheme.nav
    let obj1 = {
      mutualFundSchemeMasterId: scheme.mutualFundSchemeMasterId,
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      orderType: 'ORDER',
      userAccountType: this.getDataSummary.defaultCredential.accountType,
    }
    this.onlineTransact.getSchemeDetails(obj1).subscribe(
      data => this.getSchemeDetailsRes(data), (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  getbankDetails(event) {
    console.log(event);
  }

  getSchemeDetailsRes(data) {
    this.showSpinner = false
    console.log('getSchemeDetailsRes == ', data)
    this.maiSchemeList = data
    this.schemeDetails = data[0]
    this.schemeDetails.selectedFamilyMember = this.selectedFamilyMember;
    if (data.length > 1) {
      this.reInvestmentOpt = data
      console.log('reinvestment', this.reInvestmentOpt)
    } if (data.length == 1) {
      this.reInvestmentOpt = []
    }
    this.getSchemeWiseFolios()
  }
  reinvest(scheme) {
    this.schemeDetails = scheme
    Object.assign(this.transactionSummary, { schemeName: scheme.schemeName });
    console.log('schemeDetails == ', this.schemeDetails)
  }
  getSchemeWiseFolios() {
    this.showSpinnerFolio = true
    let obj1 = {
      mutualFundSchemeMasterId: this.scheme.mutualFundSchemeMasterId,
      advisorId: this.getDataSummary.defaultClient.advisorId,
      familyMemberId: this.getDataSummary.defaultClient.familyMemberId,
      clientId: this.getDataSummary.defaultClient.clientId,
      userAccountType: this.getDataSummary.defaultCredential.accountType,
      holdingType: this.getDataSummary.defaultClient.holdingType,
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      showOnlyNonZero: true,
    }
    this.onlineTransact.getSchemeWiseFolios(obj1).subscribe(
      data => this.getSchemeWiseFoliosRes(data), (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  getSchemeWiseFoliosRes(data) {
    this.showSpinnerFolio = false
    console.log('res scheme folio', data)
    this.folioList = data
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
  selectedSchemeTransfer(schemeTransfer) {
    this.showSpinnerTran = true
    this.schemeTransfer = schemeTransfer
    Object.assign(this.transactionSummary, { schemeNameTranfer: schemeTransfer.schemeName });
    this.navOfSelectedScheme = schemeTransfer.nav
    let obj1 = {
      mutualFundSchemeMasterId: schemeTransfer.mutualFundSchemeMasterId,
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      orderType: 'ORDER',
      userAccountType: this.getDataSummary.defaultCredential.accountType,
    }
    this.onlineTransact.getSchemeDetails(obj1).subscribe(
      data => this.getSchemeDetailsTranferRes(data), (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  getSchemeDetailsTranferRes(data) {
    this.showSpinnerTran = false
    // this.maiSchemeList = data
    this.schemeDetailsTransfer = data[0]
  }
  getSchemeListTranfer(value) {
    this.showSpinnerTran = true
    if (this.selectScheme == 2 && value.length > 2) {
      let obj = {
        searchQuery: value,
        bseOrderType: 'ORDER',
        aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
        advisorId: 414,
        tpUserCredentialId: this.getDataSummary.defaultClient.tpUserCredentialId,
        familyMemberId: this.getDataSummary.defaultClient.familyMemberId,
        clientId: this.getDataSummary.defaultClient.clientId,
        userAccountType: this.getDataSummary.defaultCredential.accountType,
        holdingType: this.getDataSummary.defaultClient.holdingType,
        tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId,
      }
      this.onlineTransact.getNewSchemes(obj).subscribe(
        data => this.getNewSchemesRes(data), (error) => {
          this.eventService.showErrorMessage(error);
        }
      );
    }
  }
  switchType(value) {

  }
  enteredAmount(value) {
    Object.assign(this.transactionSummary, { enteredAmount: value });
  }
  getNewSchemesRes(data) {
    this.showSpinnerTran = false
    console.log('new schemes', data)
    this.schemeListTransfer = data
  }
  getdataForm(data) {
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
      // investor: [(!data) ? '' : data.investor, [Validators.required]],
      employeeContry: [(!data) ? '' : data.employeeContry, [Validators.required]],
      investmentAccountSelection: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      modeOfPaymentSelection: [(!data) ? '' : data.modeOfPaymentSelection, [Validators.required]],
      folioSelection: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      selectInvestor: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      installment: [(!data) ? '' : data.employeeContry, [Validators.required]],
      tenure: [(!data) ? '' : data.employeeContry, [Validators.required]],
      transferIn: [(!data) ? '' : data.employeeContry, [Validators.required]],
      switchType: [(!data) ? '' : data.employeeContry, [Validators.required]],
    });

    this.ownerData = this.switchTransaction.controls;
  }

  getFormControl(): any {
    return this.switchTransaction.controls;
  }
  switch() {
    if (this.reInvestmentOpt.length > 1) {
      if (this.switchTransaction.get('reinvest').invalid) {
        this.switchTransaction.get('reinvest').markAsTouched();
      }
    } else if (this.switchTransaction.get('folioSelection').value == 1) {
      if (this.switchTransaction.get('investmentAccountSelection').invalid) {
        this.switchTransaction.get('investmentAccountSelection').markAsTouched();
        return;
      }
    }  else if (this.switchTransaction.get('employeeContry').invalid) {
      this.switchTransaction.get('employeeContry').markAsTouched();
      return;
    } else if (this.switchTransaction.get('switchType').invalid) {
      this.switchTransaction.get('switchType').markAsTouched();
      return;
    } else {

      let obj = {

        productDbId: this.schemeDetails.id,
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
        orderType: "SWITCH",
        buySell: "SWITCH_OUT",
        transCode: "NEW",
        buySellType: "FRESH",
        amountType: (this.switchTransaction.controls.switchType.value == 1) ? 'Amount' : 'Unit',
        dividendReinvestmentFlag: this.schemeDetails.dividendReinvestmentFlag,
        clientCode: this.getDataSummary.defaultClient.clientCode,
        orderVal: this.switchTransaction.controls.employeeContry.value,
        bseDPTransType: "PHYSICAL",
        aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
        childTransactions: []

      }

      console.log('switch', obj)
      if (this.multiTransact == true) {
        console.log('new purchase obj', this.childTransactions)
        obj.childTransactions = this.childTransactions
      }
      this.onlineTransact.transactionBSE(obj).subscribe(
        data => this.switchBSERes(data), (error) => {
          this.eventService.showErrorMessage(error);
        }
      );
    }
  }
  switchBSERes(data) {
    console.log('switch res == ', data)
    if (data == undefined) {

    } else {
      this.processTransaction.onAddTransaction('confirm', this.transactionSummary)
      Object.assign(data, { allEdit: false });
    }
  }
  AddMultiTransaction() {
    this.multiTransact = true
    let obj = {
      amc: this.scheme.amcId,
      productDbId: this.schemeDetails.id,
      amountType: (this.switchTransaction.controls.switchType.value == 1) ? 'Amount' : 'Unit',
      toProductDbId: this.schemeDetailsTransfer.id,
      qty: (this.switchTransaction.controls.switchType.value == 1) ? 0 : (this.switchTransaction.controls.switchType.value == 3) ? this.schemeDetails.balance_units : this.switchTransaction.controls.employeeContry.value,
      allRedeem: (this.switchTransaction.controls.switchType.value == 3) ? true : false,
      toIsin: this.schemeDetailsTransfer.isin,
      isin: this.schemeDetails.isin,
      folioNo: (this.folioDetails == undefined) ? null : this.folioDetails.folioNumber,
      productCode: this.schemeDetails.schemeCode,
      dividendReinvestmentFlag: this.schemeDetails.dividendReinvestmentFlag,
      orderVal: this.switchTransaction.controls.employeeContry.value,

      schemeName: this.scheme.schemeName,
    }
    this.childTransactions.push(obj)
    console.log(this.childTransactions)
    this.schemeList = [];
    this.switchTransaction.controls.switchType.reset()
    this.switchTransaction.controls.employeeContry.reset()
    this.switchTransaction.controls.investmentAccountSelection.reset()
  }
}
