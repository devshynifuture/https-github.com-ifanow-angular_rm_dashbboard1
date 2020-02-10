import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationTransactionComponent } from '../confirmation-transaction/confirmation-transaction.component';
import { UtilService } from 'src/app/services/util.service';
import { OnlineTransactionService } from '../../../online-transaction.service';

@Component({
  selector: 'app-sip-transaction',
  templateUrl: './sip-transaction.component.html',
  styleUrls: ['./sip-transaction.component.scss']
})
export class SipTransactionComponent implements OnInit {

  confirmTrasaction: boolean;
  dataSource: any;
  ownerData: any;
  sipTransaction: any;
  inputData: any;
  selectedFamilyMember: any;
  isViewInitCalled=false;
  transactionType: any;
  schemeDetails: any;
  transactionSummary: {};
  selectScheme = 2;
  schemeList: any;
  scheme: any;
  navOfSelectedScheme: any;
  maiSchemeList: any;
  reInvestmentOpt = [];

  constructor(private subInjectService: SubscriptionInject, private onlineTransact: OnlineTransactionService, 
    private fb: FormBuilder) { }
    @Input()
    set data(data) {
      this.inputData = data;
      this.transactionType =  data.transactionType
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
  }
  onAddTransaction(value,data){
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
  enteredAmount(value) {
    this.transactionSummary = { enteredAmount: value }
  }
  getSchemeList(value) {

    if (this.selectScheme == 2 && value.length > 2) {
      let obj = {
        searchQuery: value,
        bseOrderType: 'ORDER',
        aggregatorType: 2,
        advisorId: 414,
        tpUserCredentialId: 212,
      }
      this.onlineTransact.getNewSchemes(obj).subscribe(
        data => this.getNewSchemesRes(data)
      );
    } else {

    }
  }
  getNewSchemesRes(data) {
    console.log('new schemes', data)
    this.schemeList = data
  }
  selectedScheme(scheme) {
    this.scheme = scheme
    this.transactionSummary = { schemeName: scheme.schemeName }
    this.navOfSelectedScheme = scheme.nav
    let obj1 = {
      mutualFundSchemeMasterId: scheme.mutualFundSchemeMasterId,
      aggregatorType: 2,
      orderType: 'ORDER',
      userAccountType: 1,
    }
    this.onlineTransact.getSchemeDetails(obj1).subscribe(
      data => this.getSchemeDetailsRes(data)
    );
  }
  getSchemeDetailsRes(data) {
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
  }
  reinvest(scheme) {
    this.schemeDetails = scheme
    this.transactionSummary = {
      schemeName: scheme.schemeName
    }
    console.log('schemeDetails == ', this.schemeDetails)
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
    this.sipTransaction = this.fb.group({
      ownerName: [(!data) ? '' : data.ownerName, [Validators.required]],
      transactionType: [(!data) ? '' : data.transactionType, [Validators.required]],
      bankAccountSelection: [(!data) ? '' : data.bankAccountSelection, [Validators.required]],
      schemeSelection: [(!data) ? '' : data.schemeSelection, [Validators.required]],
      investor: [(!data) ? '' : data.investor, [Validators.required]],
      employeeContry: [(!data) ? '' : data.employeeContry, [Validators.required]],
      investmentAccountSelection: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      modeOfPaymentSelection: [(!data) ? '' : data.modeOfPaymentSelection, [Validators.required]],
      folioSelection: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
      selectInvestor: [(!data) ? '' : data.investmentAccountSelection, [Validators.required]],
    });

    this.ownerData = this.sipTransaction.controls;
  }

  getFormControl(): any {
    return this.sipTransaction.controls;
  }
}
