import { FormGroup, FormBuilder } from '@angular/forms';
import { SubscriptionInject } from './../../Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transaction-add',
  templateUrl: './transaction-add.component.html',
  styleUrls: ['./transaction-add.component.scss']
})
export class TransactionAddComponent implements OnInit {
  myControl;
  option;

  transactionAddForm: FormGroup = this.fb.group({
    'schemeSelection': [,],
    'investor': [,],
    'folioSelection': [,],
    'employeeContry': [,],
    'investmentAccountSelection': [,],
    'modeOfPaymentSelection': [,],
    'bankAccountSelection': [,],

  })

  constructor(private subInjectService: SubscriptionInject,
    private fb: FormBuilder) {
  }

  ngOnInit() {
  }

  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
