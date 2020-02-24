import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationTransactionComponent } from '../confirmation-transaction/confirmation-transaction.component';
import { UtilService } from 'src/app/services/util.service';
import { OnlineTransactionService } from '../../../online-transaction.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ProcessTransactionService } from '../process-transaction.service';

@Component({
  selector: 'app-redemption-transaction',
  templateUrl: './redemption-transaction.component.html',
  styleUrls: ['./redemption-transaction.component.scss']
})
export class RedemptionTransactionComponent implements OnInit {
  confirmTrasaction: boolean;
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
  showUnits = false
  bankDetails: any;
  showSpinnerFolio = false;
  achMandateNSE: any;
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
      // this.getdataForm('');
    }
  }

  get data() {
    return this.inputData;
  }

  ngOnInit() {
    this.getdataForm(this.inputData)
    this.transactionSummary = {}
    this.childTransactions = []
    this.reInvestmentOpt = [];
    Object.assign(this.transactionSummary, { allEdit: true });
    Object.assign(this.transactionSummary, { selectedFamilyMember: this.inputData.selectedFamilyMember });
    Object.assign(this.transactionSummary, { transactType: 'REDEEM' });
  }
  getDefaultDetails(data) {
    console.log('get defaul here yupeeee', data)
    this.getDataSummary = data
    Object.assign(this.transactionSummary, { aggregatorType: this.getDataSummary.defaultClient.aggregatorType });
    //this.redemptionTransaction.controls.investor.reset();
  }
  redemptionType(value) {

  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
  getdataForm(data) {
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
      //investor: [(!data) ? '' : this.scheme, [Validators.required]],
      employeeContry: [(!data) ? '' : data.employeeContry, [Validators.required]],
      redeemType: [(!data) ? '' : data.redeemType, [Validators.required]],
      investmentAccountSelection: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      modeOfPaymentSelection: [(!data) ? '' : data.modeOfPaymentSelection, [Validators.required]],
      folioSelection: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      selectInvestor: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
    });

    this.ownerData = this.redemptionTransaction.controls;
  }
  enteredAmount(value) {
    Object.assign(this.transactionSummary, { enteredAmount: value });
  }
  getFormControl(): any {
    return this.redemptionTransaction.controls;
  }
  getSchemeList(value) {
    this.showSpinner = true
    let obj = {
      searchQuery: value,
      bseOrderType: 'ORDER',
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
      advisorId: 414,
      showOnlyNonZero: true,
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
  }
  getExistingSchemesRes(data) {
    this.showSpinner = false
    this.schemeList = data
  }
  getbankDetails(bank) {
    this.bankDetails = bank[0]
    console.log('bank details', bank[0])
  }
  onFolioChange(folio) {
    this.redemptionTransaction.controls.investmentAccountSelection.reset()
  }
  selectedScheme(scheme) {
    this.scheme = scheme
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
  getSchemeDetailsRes(data) {
    console.log('getSchemeDetailsRes == ', data)
    this.maiSchemeList = data
    this.schemeDetails = data[0]
    this.redemptionTransaction.controls["employeeContry"].setValidators([Validators.min(this.schemeDetails.redemptionAmountMinimum)])
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
      showOnlyNonZero: true,
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
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
  selectedFolio(folio) {
    this.showUnits = true
    this.currentValue = this.processTransaction.calculateCurrentValue(this.navOfSelectedScheme, folio.balanceUnit)
    Object.assign(this.transactionSummary, { folioNumber: folio.folioNumber });
    Object.assign(this.transactionSummary, { mutualFundId: folio.id });
    Object.assign(this.transactionSummary, { tpUserCredFamilyMappingId: this.getDataSummary.defaultClient.tpUserCredFamilyMappingId });
    this.transactionSummary = { ...this.transactionSummary };
    this.folioDetails = folio
  }
  redeem() {

    if (this.reInvestmentOpt.length > 1) {
      if (this.redemptionTransaction.get('reinvest').invalid) {
        this.redemptionTransaction.get('reinvest').markAsTouched();
      }
    } else if (this.redemptionTransaction.get('folioSelection').value == 1) {
      if (this.redemptionTransaction.get('investmentAccountSelection').invalid) {
        this.redemptionTransaction.get('investmentAccountSelection').markAsTouched();
        return;
      }
    } else if (this.redemptionTransaction.get('redeemType').invalid) {
      this.redemptionTransaction.get('redeemType').markAsTouched();
      return;

    } else if (this.redemptionTransaction.get('employeeContry').invalid) {
      this.redemptionTransaction.get('employeeContry').markAsTouched();
    } else {
      let obj = {
        productDbId: this.schemeDetails.id,
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
        childTransactions: [],

        // teamMemberSessionId: redemptionTransaction.localStorage.mm.mainDetail.userDetails.teamMemberSessionId,
      }
      if (this.getDataSummary.defaultClient.aggregatorType == 1) {
        obj.bankDetailId = this.bankDetails.id
        obj.nsePaymentMode = 'ONLINE'
      }
      console.log('redeem obj json', obj)
      if (this.multiTransact == true) {
        console.log('new purchase obj', this.childTransactions)
        obj.childTransactions = this.childTransactions
      }
      this.onlineTransact.transactionBSE(obj).subscribe(
        data => this.redeemBSERes(data), (error) => {
          this.eventService.showErrorMessage(error);
        }
      );
    }
  }
  redeemBSERes(data) {
    console.log('redeem res', data)
    if (data == undefined) {

    } else {
      this.processTransaction.onAddTransaction('confirm', this.transactionSummary)
      Object.assign(this.transactionSummary, { allEdit: false });
    }
  }
  AddMultiTransaction() {
    if (this.reInvestmentOpt.length > 1) {
      if (this.redemptionTransaction.get('reinvest').invalid) {
        this.redemptionTransaction.get('reinvest').markAsTouched();
      }
    } else if (this.redemptionTransaction.get('investmentAccountSelection').invalid) {
        this.redemptionTransaction.get('investmentAccountSelection').markAsTouched();
        return;
    } else if (this.redemptionTransaction.get('redeemType').invalid) {
      this.redemptionTransaction.get('redeemType').markAsTouched();
      return;

    } else if (this.redemptionTransaction.get('employeeContry').invalid) {
      this.redemptionTransaction.get('employeeContry').markAsTouched();
    } else {
      this.multiTransact = true
      if (this.scheme != undefined && this.schemeDetails != undefined && this.redemptionTransaction != undefined) {
        let obj = {
          amc: this.scheme.amcId,
          productDbId: this.schemeDetails.id,
          folioNo: (this.folioDetails == undefined) ? null : this.folioDetails.folioNumber,
          productCode: this.schemeDetails.schemeCode,
          dividendReinvestmentFlag: this.schemeDetails.dividendReinvestmentFlag,
          orderVal: this.redemptionTransaction.controls.employeeContry.value,
          allRedeem: (this.redemptionTransaction.controls.redeemType.value == 3) ? true : false,
          amountType: (this.redemptionTransaction.controls.redeemType.value == 1) ? 'Amount' : 'Unit',
          qty: (this.redemptionTransaction.controls.redeemType.value == 1) ? 0 : (this.redemptionTransaction.controls.redeemType.value == 3) ? this.schemeDetails.balance_units : this.redemptionTransaction.controls.employeeContry.value,
          bankDetailId: this.bankDetails.id,
          schemeName: this.scheme.schemeName,
        }
        this.childTransactions.push(obj)
        console.log(this.childTransactions)
        this.schemeList = [];
        this.redemptionTransaction.controls.employeeContry.reset()
        this.redemptionTransaction.controls.investmentAccountSelection.reset()
      }
    }
  }
}
