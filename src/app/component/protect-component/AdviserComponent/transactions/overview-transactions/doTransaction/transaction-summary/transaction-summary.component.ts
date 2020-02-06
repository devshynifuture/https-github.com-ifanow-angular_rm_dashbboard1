import { Component, OnInit, Input } from '@angular/core';
import { ProcessTransactionService } from '../process-transaction.service';

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
  platformType = 2
  transactionSummary: any;
  constructor(private processTransaction :ProcessTransactionService) { }
  showPlatform = false
  @Input()
  set data(data) {
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
    console.log('iinList == ',this.investorList)
    this.transactionSummary = this.inputData
    console.log('transactionSummary',this.transactionSummary)
   
  }
  setPlatform(value) {
    this.selectedPlatform = value.value
    this.showPlatform = false
  }
  setInvestor(value){
    this.selectedInvestor = value.value
    this.showInvestor = false
  }
}
