import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { DatePipe } from '@angular/common';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-gold',
  templateUrl: './gold.component.html',
  styleUrls: ['./gold.component.scss'],
  providers: [
    [DatePipe],
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class GoldComponent implements OnInit {
  inputData: any;
  familyMemberId: any;
  ownerName: any;
  gold: any;
  ownerData: any;
  iAppPurValue = false;
  isTotalsGrams = false
  isBalanceAsOn = false
  isNoTolasGramsPur = false
  isPurchaseYear = false
  isCarats = false
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
    this.advisorId = AuthService.getAdvisorId()
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
    this.gold = this.fb.group({
      ownerName: [(data == undefined) ? '' : data.ownerName, [Validators.required]],
      appPurValue:[(data == undefined) ? '' : (data.accountType)+"", [Validators.required]],
      totalsGrams:[(data == undefined) ? '' : (data.bankName)+"", [Validators.required]],
      noTolasGramsPur:[(data == undefined) ? '' : (data.bankName)+"", [Validators.required]],
      compound:[(data == undefined) ? '' : (data.intrestCompoundingId)+"", [Validators.required]],
      interestRate:[(data == undefined) ? '' : data.interestRate, [Validators.required]],
      purchaseYear: [(data == undefined) ? '' : (data.purchaseYear), [Validators.required]],
      balanceAsOn:[(data == undefined) ? '' : new Date(data.balanceAsOn), [Validators.required]],
      carats: [(data == undefined) ? '' : data.accountBalance, [Validators.required]],
      bankAcNo: [(data == undefined) ? '' : data.bankAccountNumber, [Validators.required]],
      description: [(data == undefined) ? '' : data.description, [Validators.required]],
      id: [(data == undefined) ? '' : data.id, [Validators.required]],
      familyMemberId: [[(data == undefined) ? '' : data.familyMemberId], [Validators.required]]
    });
    this.ownerData = this.gold.controls;
    this.familyMemberId = this.gold.controls.familyMemberId.value
    this.familyMemberId = this.familyMemberId[0]
  }
  getFormControl(): any {
     return this.gold.controls;
  }
  saveGold(){
    if (this.gold.controls.balanceAsOn.invalid) {
      this.isBalanceAsOn = true;
      return;
    } else if (this.gold.controls.totalsGrams.invalid) {
      this.isTotalsGrams = true;
      return;
    } else if (this.gold.controls.appPurValue.invalid) {
      this.iAppPurValue = true;
      return;
    } else if (this.gold.controls.noTolasGramsPur.invalid) {
      this.isNoTolasGramsPur = true;
      return;
    } else if (this.gold.controls.purchaseYear.invalid) {
      this.isPurchaseYear = true;
      return;
    } else if (this.gold.controls.carats.invalid) {
      this.isCarats = true;
      return;
    } else {
      let obj = {
        advisorId: this.advisorId,
        clientId: 2978,
        familyMemberId: this.familyMemberId,
        ownerName: (this.ownerName == undefined) ? this.gold.controls.ownerName.value : this.ownerName,
        appPurValue:this.gold.controls.appPurValue.value,
        noTolasGramsPur:this.gold.controls.noTolasGramsPur.value,
        totalsGrams:this.gold.controls.totalsGrams.value,
        interestRate:this.gold.controls.interestRate.value,
        purchaseYear:this.gold.controls.purchaseYear.value,
        carats:this.gold.controls.carats.value,
        balanceAsOn: this.gold.controls.balanceAsOn.value,
        bankAccountNumber: this.gold.controls.bankAcNo.value,
        description: this.gold.controls.description.value,
        id: this.gold.controls.id.value
      }
      if (this.gold.controls.id.value == undefined) {
        this.custumService.addGold(obj).subscribe(
          data => this.addGoldRes(data)
        );
      } else {
        //edit call
        this.custumService.editGold(obj).subscribe(
          data => this.editGoldRes(data)
        );
      }
    }
  }
  addGoldRes(data) {
    console.log('addrecuringDepositRes', data)
    this.subInjectService.changeNewRightSliderState({ state: 'close', data })
  }
  editGoldRes(data) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', data })
  }

}
