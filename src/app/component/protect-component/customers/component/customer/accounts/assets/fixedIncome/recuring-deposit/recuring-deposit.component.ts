import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { DatePipe } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-recuring-deposit',
  templateUrl: './recuring-deposit.component.html',
  styleUrls: ['./recuring-deposit.component.scss'],providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    // {
    //   provide: DateAdapter,
    //   useClass: MomentDateAdapter,
    //   deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    // },
    // { provide: MAT_DATE_LOCALE, useValue: 'en' },
    [DatePipe],
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2},
  ],
})
export class RecuringDepositComponent implements OnInit {
  advisorId: any;
  showHide = false;
  dataSource: any;
  recuringDeposit: any;
  isownerName = false;
  isMonthlyContribution = false;
  isOwnerType = false;
  isCommencementDate = false;
  isInterestRate = false;
  isCompound = false;
  isLinkBankAc = false;
  isFDType = false;
  isBankName = false;
  isPayOpt = false;
  isMaturityDate = false;
  isMaturity = false;
  isDescription = false;
  isTenure = false;
  inputData: any;
  ownerName: any;
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
    // this.getdataForm()
  }
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  Close(){
    this.subInjectService.changeNewRightSliderState({state:'close'})
  }
  display(value){
    console.log('value selected', value)
    this.ownerName = value.userName;
  }
  showLess(value){
    if(value  == true){
      this.showHide = false;
    }else{
      this.showHide = true;
    }
  }
  getdataForm(data){
    if(data == undefined){
      data = {}
    }
    this.recuringDeposit = this.fb.group({
      ownerName: [(data == undefined)? '':data.ownerName, [Validators.required]],
      monthlyContribution: [(data ==undefined)? '':data.monthlyContribution, [Validators.required]],
      commencementDate: [(data ==undefined)? '' :data.commencementDate, [Validators.required]],
      interestRate: [(data ==undefined)? '' :data.interestRate, [Validators.required]],
      compound: [(data ==undefined)? '' :(data.interestCompounding)+"", [Validators.required]],
      linkBankAc: [(data ==undefined)? '' :data.linkBankAc, [Validators.required]],
      tenure:[(data ==undefined)? '' :data.tenure, [Validators.required]],
      description: [(data ==undefined)? '' :data.description, [Validators.required]],
      bankName: [(data ==undefined)? '' :data.bankName, [Validators.required]],
      ownerType: [(data ==undefined)? '' :(data.ownershipType)+"", [Validators.required]],
      rdNo: [(data ==undefined)? '' :data.rdNumber, [Validators.required]],
      id:[(data ==undefined)? '' :data.id, [Validators.required]]
    });
  
    this.getFormControl().ownerName.maxLength = 40;
      this.getFormControl().description.maxLength = 60;
      this.getFormControl().rdNo.maxLength = 10;
      this.getFormControl().bankName.maxLength = 15;
  }
  getFormControl():any {
    return this.recuringDeposit.controls;
  }
  saveRecuringDeposit(){

  if (this.recuringDeposit.controls.ownerName.invalid) {
    this.isownerName = true;
    return;
  } else if (this.recuringDeposit.controls.mothmonthlyContribution.invalid) {
    this.isMonthlyContribution = true;
    return;
  }else if (this.recuringDeposit.controls.ownerType.invalid) {
    this.isOwnerType = true;
    return;
  } else if (this.recuringDeposit.controls.commencementDate.invalid) {
    this.isCommencementDate = true;
    return;
  } else if (this.recuringDeposit.controls.interestRate.invalid) {
    this.isInterestRate = true;
    return;
  } else if (this.recuringDeposit.controls.compound.invalid) {
    this.isCompound = true;
    return;
  } else if (this.recuringDeposit.controls.linkBankAc.invalid) {
    this.isLinkBankAc = true;
    return;
  } else if (this.recuringDeposit.controls.description.invalid) {
    this.isDescription = true;
    return;
  }else if (this.recuringDeposit.controls.bankName.invalid) {
    this.isBankName = true;
    return;
  }  else {
  
    let obj = {
      advisorId:this.advisorId,
      clientId:998877,
      familyMemberId:554466,
      ownerName: this.recuringDeposit.controls.ownerName.value,
      amountInvested: this.recuringDeposit.controls.monthlyContribution.value,
      ownerType: this.recuringDeposit.controls.ownerType.value,
      interestRate : this.recuringDeposit.controls.interestRate.value,
      commencementDate: this.datePipe.transform(this.recuringDeposit.controls.commencementDate.value, 'yyyy-MM-dd'),
      linkBankAc: this.recuringDeposit.controls.linkBankAc.value,
      description: this.recuringDeposit.controls.description.value,
      frequencyOfPayoutPerYear: this.recuringDeposit.controls.maturity.value,
      maturityDate: this.datePipe.transform(this.recuringDeposit.controls.maturityDate.value, 'yyyy-MM-dd'),
      interestPayoutOption: this.recuringDeposit.controls.payOpt.value,
      bankName: this.recuringDeposit.controls.bankName.value,
      rdNumber: this.recuringDeposit.controls.rdNo.value,
      // fdType: this.recuringDeposit.controls.FDType.value,
      interestCompounding:this.recuringDeposit.controls.compound.value
    }
    console.log('recuringDeposit',obj)
    this.dataSource = obj
    // if(this.recuringDeposit.controls.id.value == undefined){
    //   this.custumService.addrecuringDeposit(obj).subscribe(
    //     data => this.addrecuringDepositRes(data)
    //   );
    // }else{
    //   //edit call
    //   this.custumService.editrecuringDeposit(obj).subscribe(
    //     data => this.editrecuringDepositRes(data)
    //   );
    // }
 
  }
}
// addrecuringDepositRes(data){
// console.log('addrecuringDepositRes',data)
// this.subInjectService.changeNewRightSliderState({state:'close',data})
// }
// editrecuringDepositRes(data){
//   this.subInjectService.changeNewRightSliderState({state:'close',data})
// }
}
