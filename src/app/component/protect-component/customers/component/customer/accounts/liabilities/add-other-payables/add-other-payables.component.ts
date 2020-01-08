import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-add-other-payables',
  templateUrl: './add-other-payables.component.html',
  styleUrls: ['./add-other-payables.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class AddOtherPayablesComponent implements OnInit {
  otherLiabilityForm: any;
  ownerData: any;
  _inputData: any;
  ownerName: any;
  selectedFamilyData: any;
  show: boolean;
  isdateValid: boolean;
  isCreditorName: boolean;
  isAmtBorrowed: boolean;
  isinterestRate: boolean;
  isDateOfRepayment: boolean;
  isBalance: boolean;
  advisorId: any;
  clientId: number;
  _data: any;
  interestRate: number;
  showError: boolean;

  constructor(private fb: FormBuilder, public subInjectService: SubscriptionInject, public custumService: CustomerService, public eventService: EventService) {
  }

  @Input()
  set data(inputData) {
    this._data = inputData;
    this.getOtherPayable(inputData);

  }

  get data() {
    return this._data;
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();

    this.show = false;
  }

  showMore() {
    this.show = true;
  }

  showLess() {
    this.show = false;
  }

  close() {
    // let data=this._inputData.loanTypeId;
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

  getOtherPayable(data) {
    if (data == undefined) {
      data = {};
    }
    this.otherLiabilityForm = this.fb.group({
      ownerName: [data.ownerName, [Validators.required]],
      dateOfReceipt: [new Date(data.dateOfReceived), [Validators.required]],
      creditorName: [data.creditorName, [Validators.required]],
      amtBorrowed: [data.amountBorrowed, [Validators.required]],
      interest: [data.interest, [Validators.required, Validators.min(1), Validators.max(100)]],

      dateOfRepayment: [new Date(data.dateOfRepayment), [Validators.required]],
      balance: [data.outstandingBalance, [Validators.required]],
      collateral: [data.collateral],
    });

    this.getFormControl().creditorName.maxLength = 20;
    this.getFormControl().amtBorrowed.maxLength = 20;
    this.getFormControl().interest.maxLength = 20;
    this.getFormControl().balance.maxLength = 20;
    this.getFormControl().collateral.maxLength = 20;
    this.ownerData = this.otherLiabilityForm.controls;

  }

  onChange(event) {
    if (parseInt(event.target.value) > 100) {
      event.target.value = "100";
      this.otherLiabilityForm.get('interest').setValue(event.target.value);
    }
  }
  onChangeGrowthRate(event) {
    if (parseInt(event.target.value) > 100) {
      event.target.value = "100";
      this.otherLiabilityForm.get('growthEmployer').setValue(event.target.value);
    }
  }
  getFormControl() {
    return this.otherLiabilityForm.controls;
  }

  display(value) {
    console.log('value selected', value);
    this.ownerName = value.userName;
    this.selectedFamilyData = value;
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  saveFormData(state) {
    if (this.otherLiabilityForm.controls.dateOfReceipt.invalid) {
      this.isdateValid = true;
      return;
    } else if (this.otherLiabilityForm.controls.creditorName.invalid) {
      this.isCreditorName = true;
      return;
    } else if (this.otherLiabilityForm.controls.amtBorrowed.invalid) {
      this.isAmtBorrowed = true;
      return;
    } else if (this.otherLiabilityForm.controls.interest.invalid) {
      this.isinterestRate = true;
      return;
    } else if (this.otherLiabilityForm.controls.dateOfRepayment.invalid) {
      this.isDateOfRepayment = true;
      return;
    } else if (this.otherLiabilityForm.controls.balance.invalid) {
      this.isBalance = true;
      return;
    } else {
      const obj = {
        ownerName: (this.ownerName == null) ? this.otherLiabilityForm.controls.ownerName.value : this.ownerName,
        dateOfReceipt: this.otherLiabilityForm.controls.dateOfReceipt.value,
        creditorName: this.otherLiabilityForm.controls.creditorName.value,
        amtBorrowed: this.otherLiabilityForm.controls.amtBorrowed.value,
        interest: this.otherLiabilityForm.controls.interest.value,
        dateOfRepayment: this.otherLiabilityForm.controls.dateOfRepayment.value,
        balance: this.otherLiabilityForm.controls.balance.value,
        collateral: this.otherLiabilityForm.controls.collateral.value,
      };
      obj.balance = parseInt(obj.balance);
      obj.amtBorrowed = parseInt(obj.amtBorrowed);
      obj.dateOfReceipt = obj.dateOfReceipt.toISOString().slice(0, 10);
      obj.dateOfRepayment = obj.dateOfRepayment.toISOString().slice(0, 10);
      obj.interest = parseInt(obj.interest);

      if (this._data == 'Add') {
        const objToSend = {
          advisorId: this.advisorId,
          clientId: this.clientId,
          familyMemberId: this.selectedFamilyData.id,
          ownerName: obj.ownerName,
          creditorName: obj.creditorName,
          collateral: obj.collateral,
          amountBorrowed: obj.amtBorrowed,
          interest: obj.interest,
          outstandingBalance: obj.balance,
          dateOfReceived: obj.dateOfReceipt,
          dateOfRepayment: obj.dateOfRepayment,
        };
        console.log('obj', obj);
        this.custumService.addOtherPayables(objToSend).subscribe(
          data => this.addOtherPayablesRes(data)
        );
      } else {
        const editObj = {
          familyMemberId: 160023,
          ownerName: obj.ownerName,
          creditorName: obj.creditorName,
          collateral: obj.collateral,
          amountBorrowed: obj.amtBorrowed,
          interest: obj.interest,
          outstandingBalance: obj.balance,
          dateOfReceived: obj.dateOfReceipt,
          dateOfRepayment: obj.dateOfRepayment,
          id: this._data.id,
        };
        this.custumService.editOtherPayables(editObj).subscribe(
          data => this.editOtherPayablesRes(data)
        );
      }


    }
  }

  addOtherPayablesRes(data) {
    console.log(data);
    if (data) {
      console.log(data);
      this.subInjectService.changeNewRightSliderState({ state: 'close' });
      this.eventService.openSnackBar('Liabilities added successfully', 'OK');
    } else {
      this.eventService.openSnackBar('Error', 'dismiss');

    }
  }

  editOtherPayablesRes(data) {
    console.log(data);
    if (data) {
      console.log(data);
      this.subInjectService.changeNewRightSliderState({ state: 'close' });
      this.eventService.openSnackBar('Liabilities edited successfully', 'OK');
    } else {
      this.eventService.openSnackBar('Error', 'dismiss');
    }
  }
}
