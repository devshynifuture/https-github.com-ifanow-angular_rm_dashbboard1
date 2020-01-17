import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { DatePipe } from '@angular/common';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { AuthService } from 'src/app/auth-service/authService';
import { UtilService } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-bank-accounts',
  templateUrl: './bank-accounts.component.html',
  styleUrls: ['./bank-accounts.component.scss'],
  providers: [
    [DatePipe],
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class BankAccountsComponent implements OnInit {
  ownerName: any;
  inputData: any;
  familyMemberId: any;
  isAccountType = false
  isBalanceAsOn = false;
  isAccountBalance = false;
  isInterestRate = false;
  isCompound = false;
  ownerData: any;
  bankAccounts: any;
  showHide = false;
  advisorId: any;
  clientId: any;
  nomineesListFM: any;

  constructor(private fb: FormBuilder, private custumService: CustomerService, public subInjectService: SubscriptionInject, private datePipe: DatePipe,public utils: UtilService,public eventService:EventService) { }

  @Input()
  set data(data) {
    this.inputData = data;
    this.getdataForm(data);
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getdataForm(this.inputData);

  }
  display(value) {
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.familyMemberId = value.id
  }
  lisNominee(value) {
    console.log(value)
    this.nomineesListFM = Object.assign([], value.familyMembersList);
  }
  showLess(value) {
    if (value == true) {
      this.showHide = false;
    } else {
      this.showHide = true;
    }
  }
  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close',refreshRequired:flag })
  }
  getdataForm(data) {
    if (data == undefined) {
      data = {}
    }
    this.bankAccounts = this.fb.group({
      ownerName: [(data == undefined) ? '' : data.ownerName, [Validators.required]],
      accountType: [(data.accountType == undefined) ? '' : (data.accountType) + "", [Validators.required]],
      bankName: [(data == undefined) ? '' : data.bankName, [Validators.required]],
      compound: [(data.interestCompounding == undefined) ? '' : (data.interestCompounding) + "", [Validators.required]],
      interestRate: [(data == undefined) ? '' : data.interestRate, [Validators.required]],
      balanceAsOn: [(data == undefined) ? '' : new Date(data.balanceAsOn), [Validators.required]],
      accountBalance: [(data == undefined) ? '' : data.accountBalance, [Validators.required]],
      bankAcNo: [(data == undefined) ? '' : data.bankAccountNumber, [Validators.required]],
      description: [(data == undefined) ? '' : data.description, [Validators.required]],
      id: [(data == undefined) ? '' : data.id, [Validators.required]],
      familyMemberId: [[(data == undefined) ? '' : data.familyMemberId], [Validators.required]]
    });
    this.ownerData = this.bankAccounts.controls;
    this.familyMemberId = this.bankAccounts.controls.familyMemberId.value
    this.familyMemberId = this.familyMemberId[0]
  }
  onChange(event) {
    if (parseInt(event.target.value) > 100) {
      event.target.value = "100";
      this.bankAccounts.get('interestRate').setValue(event.target.value);
    }
  }
  getFormControl(): any {
    return this.bankAccounts.controls;
  }
  saveCashInHand() {

    if (this.bankAccounts.get('accountType').invalid) {
      this.bankAccounts.get('accountType').markAsTouched();
      return;
    } else if (this.bankAccounts.get('ownerName').invalid) {
      this.bankAccounts.get('ownerName').markAsTouched();
      return
    } else if (this.bankAccounts.get('accountBalance').invalid) {
      this.bankAccounts.get('accountBalance').markAsTouched();
      return;
    } else if (this.bankAccounts.get('balanceAsOn').invalid) {
      this.bankAccounts.get('balanceAsOn').markAsTouched();
      return;
    } else if (this.bankAccounts.get('interestRate').invalid) {
      this.bankAccounts.get('interestRate').markAsTouched();
      return;
    } else if (this.bankAccounts.get('compound').invalid) {
      this.bankAccounts.get('compound').markAsTouched();
      return;
    }  else {
      let obj = {
        advisorId: this.advisorId,
        clientId: this.clientId,
        familyMemberId: this.familyMemberId,
        ownerName: (this.ownerName == undefined) ? this.bankAccounts.controls.ownerName.value : this.ownerName,
        accountType: this.bankAccounts.controls.accountType.value,
        balanceAsOn:this.datePipe.transform(this.bankAccounts.controls.balanceAsOn.value, 'yyyy-MM-dd'),
        bankName: this.bankAccounts.controls.bankName.value,
        interestCompounding: this.bankAccounts.controls.compound.value,
        interestRate: this.bankAccounts.controls.interestRate.value,
        accountBalance:this.bankAccounts.controls.accountBalance.value,
        accountNo: this.bankAccounts.controls.bankAcNo.value,
        description: this.bankAccounts.controls.description.value,
        id: this.bankAccounts.controls.id.value
      }
      if (this.bankAccounts.controls.id.value == undefined) {
        this.custumService.addBankAccounts(obj).subscribe(
          data => this.addBankAccountsRes(data)
        );
      } else {
        //edit call
        this.custumService.editBankAcounts(obj).subscribe(
          data => this.editBankAcountsRes(data)
        );
      }
    }
  }
  addBankAccountsRes(data) {
    console.log('addrecuringDepositRes', data)
    this.subInjectService.changeNewRightSliderState({flag:'addedbankAc', state: 'close', data,refreshRequired:true })
    this.eventService.openSnackBar('Bank account added successfully', 'OK');

  }
  editBankAcountsRes(data) {
    this.subInjectService.changeNewRightSliderState({flag:'addedbankAc', state: 'close', data,refreshRequired:true })
    this.eventService.openSnackBar('Bank account edited successfully', 'OK');

  }
}
