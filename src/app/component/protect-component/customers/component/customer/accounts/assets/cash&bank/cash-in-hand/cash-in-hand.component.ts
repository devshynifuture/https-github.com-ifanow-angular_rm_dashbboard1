import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { DatePipe } from '@angular/common';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-cash-in-hand',
  templateUrl: './cash-in-hand.component.html',
  styleUrls: ['./cash-in-hand.component.scss'],
  providers: [
    [DatePipe],
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class CashInHandComponent implements OnInit {
  inputData: any;
  ownerName: any;
  familyMemberId: any;
  isCahsBalance =false;
  isBalanceAsOn = false
  ownerData: any;
  cashInHand: any;
  showHide = false;
  advisorId: any;

  constructor(private fb: FormBuilder, private custumService : CustomerService,public subInjectService: SubscriptionInject,private datePipe: DatePipe) { }
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
  }
  display(value) {
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.familyMemberId = value.id
  }
  Close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' })
  }
  showLess(value) {
    if (value == true) {
      this.showHide = false;
    } else {
      this.showHide = true;
    }
  }
  getdataForm(data){
    if (data == undefined) {
      data = {}
    }
    this.cashInHand = this.fb.group({
      ownerName: [(data == undefined) ? '' : data.ownerName, [Validators.required]],
      balanceAsOn: [(data == undefined) ? '' : new Date(data.balanceAsOn), [Validators.required]],
      cashBalance: [(data == undefined) ? '' : data.cashValue, [Validators.required]],
      bankAcNo: [(data == undefined) ? '' : data.bankAccountNumber, [Validators.required]],
      description: [(data == undefined) ? '' : data.description, [Validators.required]],
      id: [(data == undefined) ? '' : data.id, [Validators.required]],
      familyMemberId: [[(data == undefined) ? '' : data.familyMemberId], [Validators.required]]
    });
    this.ownerData = this.cashInHand.controls;
    this.familyMemberId = this.cashInHand.controls.familyMemberId.value
    this.familyMemberId = this.familyMemberId[0]
  }
  getFormControl(): any {
    return this.cashInHand.controls;
  }
  saveCashInHand(){
    
      if (this.cashInHand.controls.balanceAsOn.invalid) {
        this.isBalanceAsOn = true;
        return;
      } else if (this.cashInHand.controls.cashBalance.invalid) {
        this.isCahsBalance = true;
        return;
      } else {
        let obj = {
          advisorId: this.advisorId,
          clientId: 2978,
          familyMemberId: this.familyMemberId,
          ownerName: (this.ownerName == undefined) ? this.cashInHand.controls.ownerName.value : this.ownerName,
          balanceAsOn:this.datePipe.transform(this.cashInHand.controls.balanceAsOn.value, 'yyyy-MM-dd'),
          cashValue: this.cashInHand.controls.cashBalance.value,
          bankAccountNumber: this.cashInHand.controls.bankAcNo.value,
          description: this.cashInHand.controls.description.value,
          id: this.cashInHand.controls.id.value
        }
        if (this.cashInHand.controls.id.value == undefined) {
          this.custumService.addCashInHand(obj).subscribe(
            data => this.addCashInHandRes(data)
          );
        } else {
          //edit call
          this.custumService.editCashInHand(obj).subscribe(
            data => this.editCashInHandRes(data)
          );
        }
      }
    }
    addCashInHandRes(data) {
      console.log('addrecuringDepositRes', data)
      this.subInjectService.changeNewRightSliderState({ state: 'close', data })
    }
    editCashInHandRes(data) {
      this.subInjectService.changeNewRightSliderState({ state: 'close', data })
    }

}
