import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mutual-fund-details',
  templateUrl: './mutual-fund-details.component.html',
  styleUrls: ['./mutual-fund-details.component.scss']
})
export class MutualFundDetailsComponent implements OnInit {
  inputData: any;
  backToMf;
  mutualFundSchemeMaster: any;
  mutualFund: any;
  showDetails: boolean;
  mutualFundTransactions: any;
  mutualFundData: any;

  constructor() { }
  @Input()
  set data(data) {
    this.inputData = data;
    this.mutualFundData = data
    this.mutualFundTransactions = data.mutualFundTransactions
    console.log('This is Input data of proceed ', data);
  }
  get data() {
    return this.inputData;
  }
  ngOnInit() {
  }
  showDetailsFun(flag){
    if(flag == true){
      this.showDetails = false
    }else{
      this.showDetails = true
    }
  }
}
