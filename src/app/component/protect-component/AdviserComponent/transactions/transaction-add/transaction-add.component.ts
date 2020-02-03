import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from './../../Subscriptions/subscription-inject.service';
import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-transaction-add',
  templateUrl: './transaction-add.component.html',
  styleUrls: ['./transaction-add.component.scss']
})
export class TransactionAddComponent implements OnInit {
  formStep: string = 'step-1';
  investorsArray: string[] = [
    'Rahul Jain',
    'ajdbvkja'
  ];

  isSaveAndAddClicked: boolean = false;

  transactionAddForm: FormGroup = this.fb.group({
    'selectInvestor': [, Validators.required],
    'transactionType': [, Validators.required],
    'schemeSelection': [,],
    'investor': [,],
    'folioSelection': [,],
    'employeeContry': [,],
    'investmentAccountSelection': [,],
    'modeOfPaymentSelection': [,],
    'bankAccountSelection': [,],

  })
  selectedDiv: string = 'div1';

  constructor(private subInjectService: SubscriptionInject,
    private fb: FormBuilder) {
  }

  ngOnInit() {
  }

  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

  selectTransactionType(value: string) {
    this.selectedDiv = value;
    this.transactionAddForm.patchValue({
      'transactionType': value
    });

    console.log(this.transactionAddForm);
  }

  saveAndAddAnother() {
    this.isSaveAndAddClicked = true;
    console.log(this.transactionAddForm);
  }

  onAddTransaction() {
    console.log(this.transactionAddForm);
  }

  saveAndNext() {
    console.log(this.formStep);
    if (this.transactionAddForm.get('selectInvestor').valid) {
      if (this.formStep == 'step-1') {
        this.formStep = 'step-2';
      } else if (this.transactionAddForm.get('transactionType').valid && this.formStep == 'step-2') {
        this.formStep = 'step-3';
      }
    } else {
      if (this.formStep == 'step-1') {
        this.transactionAddForm.get('selectInvestor').markAsTouched();
      } else if (this.formStep === 'step-2') {
        this.transactionAddForm.get('transactionType').markAsTouched();
      } else if (this.formStep === 'step-3') {

      }
    }
  }
}
