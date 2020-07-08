import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mobile-transactions',
  templateUrl: './mobile-transactions.component.html',
  styleUrls: ['./mobile-transactions.component.scss']
})
export class MobileTransactionsComponent implements OnInit {
  openMenue: boolean=false;
  inputData: any;
  option;
  constructor() { }
  @Input()
  set data(data) {
    this.inputData = data;
    console.log('This is Input data of proceed ', data);
  }
  get data() {
    return this.inputData;
  }
  ngOnInit() {
  }
  openMenu(flag) {
    if (flag == false) {
      this.openMenue = true
    } else {
      this.openMenue = false
    }
  }
}
