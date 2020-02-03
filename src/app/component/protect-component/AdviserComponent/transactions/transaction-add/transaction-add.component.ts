import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from './../../Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';
import { ValidatorType } from 'src/app/services/util.service';

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

  validatorType = ValidatorType;
  schemes: string[] = [
    'Scheme 1',
    'Scheme 2',
    'Scheme 3',
    'Scheme 4'
  ]

  isSaveAndAddClicked: boolean = false;

  transactionAddForm: FormGroup = this.fb.group({
    'selectInvestor': [, Validators.required],
    'transactionType': [, Validators.required],
    'schemeType': [,],
    'scheme': [,],
    'folio': [,],
    'employeeContry': [, Validators.min(500)],
    'investmentAccountType': [,],
    'modeOfPayment': [,],
    'bankAccountType': [,],

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
    if (this.transactionAddForm.valid) {
      this.isSaveAndAddClicked = true;
      console.log(this.transactionAddForm);
    }
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
