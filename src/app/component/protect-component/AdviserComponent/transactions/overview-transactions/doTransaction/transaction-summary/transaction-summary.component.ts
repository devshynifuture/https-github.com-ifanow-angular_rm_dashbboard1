import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProcessTransactionService } from '../process-transaction.service';
import { OnlineTransactionService } from '../../../online-transaction.service';

@Component({
  selector: 'app-transaction-summary',
  templateUrl: './transaction-summary.component.html',
  styleUrls: ['./transaction-summary.component.scss']
})
export class TransactionSummaryComponent implements OnInit {
  selectedPlatform
  selectedInvestor: any;
  showInvestor = false;
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
  constructor(private onlineTransact: OnlineTransactionService, private processTransaction: ProcessTransactionService) { }
  showPlatform = false;
  @Output() defaultDetails = new EventEmitter();
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
  }
  setPlatform(value) {
    this.selectedPlatform = value.value
    this.showPlatform = false
    this.getDefaultDetails(this.selectedPlatform)
  }
  setInvestor(value) {
    this.selectedInvestor = value.value
    this.allData.defaultCredential.clientCode = this.selectedInvestor
    this.defaultDetails.emit(this.allData);
    this.showInvestor = false
  }
}
