import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material';
import { TransactionBottomButtonComponent } from './transaction-bottom-button/transaction-bottom-button.component';

@Component({
  selector: 'app-transaction-mobile-view',
  templateUrl: './transaction-mobile-view.component.html',
  styleUrls: ['./transaction-mobile-view.component.scss']
})
export class TransactionMobileViewComponent implements OnInit {

  constructor(private _bottomSheet: MatBottomSheet) { }

  ngOnInit() {
  }
  openBottomSheet(): void {
    this._bottomSheet.open(TransactionBottomButtonComponent);
  }
}
