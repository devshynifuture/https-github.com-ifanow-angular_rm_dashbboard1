import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transaction-summary',
  templateUrl: './transaction-summary.component.html',
  styleUrls: ['./transaction-summary.component.scss']
})
export class TransactionSummaryComponent implements OnInit {
  selectedPlatform 

  constructor() { }
  showPlatform = false
  ngOnInit() {
  }
  setPlatform(value) {
    this.selectedPlatform = value.value
    this.showPlatform = false
  }
}
