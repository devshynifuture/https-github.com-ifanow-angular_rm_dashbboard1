import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-cash-and-bank',
  templateUrl: './cash-and-bank.component.html',
  styleUrls: ['./cash-and-bank.component.scss']
})
export class CashAndBankComponent implements OnInit {
  inputData: any;
  assetData: any;
  cashAndBank;
  backToMf;
  bankAccData;
  constructor() { }
  @Input()
  set data(data) {
    this.inputData = data.assetType;
    this.assetData = data.data.assetList
    console.log('This is Input data of proceed ', data);
  }
  ngOnInit() {
  }

}
