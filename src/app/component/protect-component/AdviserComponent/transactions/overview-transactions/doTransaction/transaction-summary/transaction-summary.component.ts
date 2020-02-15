import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProcessTransactionService } from '../process-transaction.service';
import { OnlineTransactionService } from '../../../online-transaction.service';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-transaction-summary',
  templateUrl: './transaction-summary.component.html',
  styleUrls: ['./transaction-summary.component.scss']
})
export class TransactionSummaryComponent implements OnInit {
  selectedPlatform
  selectedInvestor: any;
  showInvestor = false;
  showbank= false
  investorList: void;
  inputData: any;
  isViewInitCalled: any;
  selectedFamilyMember: any;
  platformType
  transactionSummary: any;
  defaultCredential: any;
  defaultClient: any;
  allData: any;
  clientDataList: any;
  bankDetails: any;
  achMandateNSE: any;
  showBankEdit=false;
  constructor(private onlineTransact: OnlineTransactionService, private processTransaction: ProcessTransactionService,
    private subInjectService: SubscriptionInject, ) { }
  showPlatform = false;
  @Output() defaultDetails = new EventEmitter();
  @Output() bankDetailsSend = new EventEmitter();
  @Output() achmandateDetails = new EventEmitter();
  @Input() set data(data) {
    this.inputData = data;
    console.log('This is Input data of FixedDepositComponent ', data);
    this.transactionSummary = data
    if (this.isViewInitCalled) {
      // this.getdataForm('');
    }
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
    this.investorList = this.processTransaction.getIINList()
    console.log('iinList == ', this.investorList)
    this.transactionSummary = this.inputData
    console.log('transactionSummary', this.transactionSummary)
    this.getDefaultDetails(null)
  }
  getBankDetails() {
    let obj = {
      tpUserCredFamilyMappingId:this.defaultClient.tpUserCredFamilyMappingId
    }
    this.onlineTransact.getBankDetailsNSE(obj).subscribe(
      data => this.getBankDetailsNSERes(data)
    );
  }
  getBankDetailsNSERes(data) {
    console.log('bank res',data)
    this.bankDetails = data[0]
    this.bankDetailsSend.emit(this.bankDetails);
    if(this.bankDetails.length > 1){
      this.showBankEdit = true
    }
   
  }
  getNSEAchmandate(){
    let obj1 = {
      tpUserCredFamilyMappingId:this.defaultClient.tpUserCredFamilyMappingId
    }
    this.onlineTransact.getNSEAchmandate(obj1).subscribe(
      data => this.getNSEAchmandateRes(data)
    );
  }
  getNSEAchmandateRes(data){
    console.log('getNSEAchmandateRes',data)
    this.achMandateNSE = data[0]
    this.achmandateDetails.emit(this.bankDetails);
  }
  selectBank(bank){
    this.bankDetailsSend.emit(bank);
  }
  selectUmrn(umrn){
    this.achmandateDetails.emit(umrn);
  }

  getDefaultDetails(platform) {
    let obj = {
      advisorId: 414,
      familyMemberId: 112166,
      clientId: 53637,
      aggregatorType: platform
    }
    this.onlineTransact.getDefaultDetails(obj).subscribe(
      data => this.getDefaultDetailsRes(data)
    );
  }
  getDefaultDetailsRes(data) {
    console.log('deault', data)
    this.defaultDetails.emit(data);
    this.allData = data
    this.clientDataList = data.clientDataList
    this.defaultCredential = data.defaultCredential
    this.defaultClient = data.defaultClient
    this.selectedPlatform = this.defaultCredential.aggregatorType
    if (this.selectedPlatform == 1) {
      this.getBankDetails()
      this.getIINDetails()
    }
  }
  getIINDetails(){
    let obj1 = {
      tpUserCredFamilyMappingId:this.defaultClient.tpUserCredFamilyMappingId
    }
    this.onlineTransact.getIINDetails(obj1).subscribe(
      data => this.getIINDetailsRes(data)
    );
  }
  getIINDetailsRes(data){
    console.log('IIN Details',data)
  }
  setPlatform(value) {
    this.selectedPlatform = value.value
    this.showPlatform = false
    this.getDefaultDetails(this.selectedPlatform)
  }
  setInvestor(value) {
    this.selectedInvestor = value
    this.allData.defaultClient = this.selectedInvestor
    this.defaultDetails.emit(this.allData);
    this.showInvestor = false
  }
}
