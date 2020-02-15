import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationTransactionComponent } from '../confirmation-transaction/confirmation-transaction.component';
import { UtilService } from 'src/app/services/util.service';
import { OnlineTransactionService } from '../../../online-transaction.service';

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

  constructor(private subInjectService: SubscriptionInject, private onlineTransact: OnlineTransactionService,
    private fb: FormBuilder) { }
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
    this.getdataForm(this.inputData)
    this.transactionSummary = {}
    Object.assign(this.transactionSummary, { allEdit: true });
    Object.assign(this.transactionSummary, {selectedFamilyMember: this.inputData.selectedFamilyMember  });
    Object.assign(this.transactionSummary, { transactType: 'REDEEM' });
  }
  getDefaultDetails(data) {
    console.log('get defaul here yupeeee', data)
    this.getDataSummary = data
  }
  redemptionType(value) {

  }
  onAddTransaction(value, data) {
    this.confirmTrasaction = true
    const fragmentData = {
      flag: 'addNsc',
      data,
      id: 1,
      state: 'open65',
      componentName: ConfirmationTransactionComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getNscSchemedata();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
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
      investor: [(!data) ? '' : data.investor, [Validators.required]],
      employeeContry: [(!data) ? '' : data.employeeContry, [Validators.required]],
      redeemType:[(!data) ? '' : data.redeemType ,[Validators.required]],
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
      holdingType:this.getDataSummary.defaultClient.holdingType,
      tpUserCredFamilyMappingId:this.getDataSummary.defaultClient.tpUserCredFamilyMappingId,
    }
    this.onlineTransact.getExistingSchemes(obj).subscribe(
      data => this.getExistingSchemesRes(data)
    );
  }
  getExistingSchemesRes(data) {
    this.schemeList = data
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
      data => this.getSchemeDetailsRes(data)
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
  getSchemeWiseFolios() {
    let obj1 = {
      mutualFundSchemeMasterId: this.scheme.mutualFundSchemeMasterId,
      advisorId: this.getDataSummary.defaultClient.advisorId,
      familyMemberId: this.getDataSummary.defaultClient.familyMemberId,
      clientId: this.getDataSummary.defaultClient.clientId,
      userAccountType: this.getDataSummary.defaultCredential.accountType,
      holdingType:this.getDataSummary.defaultClient.holdingType,
      aggregatorType: this.getDataSummary.defaultClient.aggregatorType,
    }
    this.onlineTransact.getSchemeWiseFolios(obj1).subscribe(
      data => this.getSchemeWiseFoliosRes(data)
    );
  }
  getSchemeWiseFoliosRes(data) {
    console.log('res scheme folio', data)
    this.folioList = data
  }
  selectedFolio(folio) {
    this.folioDetails = folio
    this.showUnits = true
    Object.assign(this.transactionSummary, { folioNumber: folio.folioNumber });
  }
  redeem() {
    let obj = {
      productDbId: this.schemeDetails.id,
      mutualFundSchemeMasterId: this.scheme.mutualFundSchemeMasterId,
      productCode: this.schemeDetails.schemeCode,
      isin: this.schemeDetails.isin,
      folioNo: (this.folioDetails == undefined) ? null : this.folioDetails.folioNumber,
      tpUserCredentialId: this.getDataSummary.defaultClient.tpUserCredentialId,
      tpSubBrokerCredentialId: this.getDataSummary.defaultCredential.tpSubBrokerCredentialId,
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
      euin: this.getDataSummary.defaultCredential.euin,
      bseDPTransType: 'PHYSICAL',
      allRedeem: (this.redemptionTransaction.controls.redeemType.value == 3) ? true : false,
      // teamMemberSessionId: redemptionTransaction.localStorage.mm.mainDetail.userDetails.teamMemberSessionId,
    }
    console.log('redeem obj json',obj)
    this.onlineTransact.transactionBSE(obj).subscribe(
      data => this.redeemBSERes(data)
    );
  }
  redeemBSERes(data){
    console.log('redeem res',data)
    if(data == undefined){

    }else{
    this.onAddTransaction('confirm',this.transactionSummary)
    }
  }
}
