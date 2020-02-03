import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from './../../Subscriptions/subscription-inject.service';
import { Component, OnInit, ElementRef, Input } from '@angular/core';
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
  familyMemberId: any;
  ownerName: any;
  nomineesListFM: any;
  ownerData: any;
  dataSource: any;
  inputData: any;
  isViewInitCalled: any;

  constructor(private subInjectService: SubscriptionInject,
    private fb: FormBuilder) {
  }

  @Input()
  set data(data) {
    this.inputData = data;
    console.log('This is Input data of FixedDepositComponent ', data);

    if (this.isViewInitCalled) {
      this.getdataForm(data);
    }
  }

  get data() {
    return this.inputData;
  }

  ngOnInit() {
    this.getdataForm(this.inputData)
  }


  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
  display(value) {
    console.log('value selected', value);
    this.ownerName = value.userName;
    this.familyMemberId = value.id;
  }
  ownerDetails(value) {
    this.familyMemberId = value.id;
  }
  lisNominee(value) {
    console.log(value)
    this.nomineesListFM = Object.assign([], value.familyMembersList);
  }
  getdataForm(data) {
    if (!data) {
      data = {};
    }
    if (this.dataSource) {
      data = this.dataSource;
    }
    this.transactionAddForm = this.fb.group({
      ownerName: [(!data) ? '' : data.ownerName, [Validators.required]],
      transactionType: [(!data) ? '' : data.transactionType, [Validators.required]],
      bankAccountSelection: [(!data) ? '' : data.bankAccountSelection, [Validators.required]],
    });

    this.ownerData = this.transactionAddForm.controls;
  }

  getFormControl(): any {
    return this.transactionAddForm.controls;
  }
  selectTransactionType(value: string) {
    // let obj = {
    //   'transactionType': value
    // }
    this.selectedDiv = value;
    this.transactionAddForm.controls.transactionType.setValue(value);

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
    if (this.transactionAddForm.get('ownerName').valid) {
      if (this.formStep == 'step-1') {
        this.formStep = 'step-2';
      } else if (this.transactionAddForm.get('transactionType').valid && this.formStep == 'step-2') {
        this.formStep = 'step-3';
      }
    } else {
      if (this.formStep == 'step-1') {
        this.transactionAddForm.get('ownerName').markAsTouched();
      } else if (this.formStep === 'step-2') {
        this.transactionAddForm.get('transactionType').markAsTouched();
      } else if (this.formStep === 'step-3') {

      }
    }
  }
}
