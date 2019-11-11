import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../../customer.service';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { AuthService } from 'src/app/auth-service/authService';
import { DatePipe } from '@angular/common';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-fixed-deposit',
  templateUrl: './fixed-deposit.component.html',
  styleUrls: ['./fixed-deposit.component.scss'],
  providers: [
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
export class FixedDepositComponent implements OnInit {
  showHide = false;
  isownerName = false;
  isDescription = false;
  isBankACNo = false;
  isInterestRate = false;
  isFDType = false;
  isAmountInvest = false;
  isCommencementDate = false;
  isInterestDate = false;
  isCompound = false;
  isMaturity = false;
  isMaturityDate = false;
  isPayOpt = false;
  isOwnerType = false;
  isFdNo = false;
  isTenure = false;
  isInstitution = false;
  fixedDeposit: any;
  advisorId: any;
  dataSource: any;

  constructor(private fb: FormBuilder, private custumService : CustomerService,public subInjectService: SubscriptionInject,private datePipe: DatePipe) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.getdataForm()
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
  showLess(value){
    if(value  == true){
      this.showHide = false;
    }else{
      this.showHide = true;
    }
  }
  getdataForm(){
    if(this.dataSource != undefined){
      var data = this.dataSource
    }
    this.fixedDeposit = this.fb.group({
      ownerName: [(data == undefined)? '':data.ownerName, [Validators.required]],
      amountInvest: [(data ==undefined)? '':data.amountInvested, [Validators.required]],
      commencementDate: [(data ==undefined)? '' :data.commencementDate, [Validators.required]],
      interestRate: [(data ==undefined)? '' :data.interestRate, [Validators.required]],
      compound: [(data ==undefined)? '' :data.interestCompoundingId, [Validators.required]],
      institution: [(data ==undefined)? '' :data.institutionName, [Validators.required]],
      description: [(data ==undefined)? '' :data.description, [Validators.required]],
      tenure: [(data ==undefined)? '' :data.tenure, [Validators.required]],
      maturity: [(data ==undefined)? '' :data.frequencyOfPayoutPerYear, [Validators.required]],
      maturityDate: [(data ==undefined)? '' :data.maturityDate, [Validators.required]],
      payOpt: [(data ==undefined)? '' :data.interestPayoutOption, [Validators.required]],
      bankACNo: [(data ==undefined)? '' :data.bankACNo, [Validators.required]],
      ownerType: [(data ==undefined)? '' :data.ownerType, [Validators.required]],
      fdNo: [(data ==undefined)? '' :data.fdNumber, [Validators.required]],
      FDType:[(data ==undefined)? '' :data.fdType, [Validators.required]],
      id:[(data ==undefined)? '' :data.id, [Validators.required]]
    });
  
    this.getFormControl().ownerName.maxLength = 40;
      this.getFormControl().description.maxLength = 60;
      this.getFormControl().fdNo.maxLength = 10;
      this.getFormControl().bankACNo.maxLength = 15;
  }
  getFormControl():any {
    return this.fixedDeposit.controls;
  }
saveFixedDeposit(){

  if (this.fixedDeposit.controls.ownerName.invalid) {
    this.isownerName = true;
    return;
  } else if (this.fixedDeposit.controls.amountInvest.invalid) {
    this.isAmountInvest = true;
    return;
  }else if (this.fixedDeposit.controls.ownerType.invalid) {
    this.isOwnerType = true;
    return;
  } else if (this.fixedDeposit.controls.commencementDate.invalid) {
    this.isCommencementDate = true;
    return;
  } else if (this.fixedDeposit.controls.interestRate.invalid) {
    this.isInterestRate = true;
    return;
  } else if (this.fixedDeposit.controls.compound.invalid) {
    this.isCompound = true;
    return;
  } else if (this.fixedDeposit.controls.institution.invalid) {
    this.isInstitution = true;
    return;
  } else if (this.fixedDeposit.controls.description.invalid) {
    this.isDescription = true;
    return;
  } else if (this.fixedDeposit.controls.maturity.invalid) {
    this.isMaturity = true;
    return;
  } else if (this.fixedDeposit.controls.maturityDate.invalid) {
    this.isMaturityDate = true;
    return;
  }else if (this.fixedDeposit.controls.payOpt.invalid) {
    this.isPayOpt = true;
    return;
  }else if (this.fixedDeposit.controls.bankACNo.invalid) {
    this.isBankACNo = true;
    return;
  }else if (this.fixedDeposit.controls.fdNo.invalid) {
    this.isFdNo = true;
    return;
  }else if (this.fixedDeposit.controls.FDType.invalid) {
    this.isFDType = true;
    return;
  }  else {
  
    let obj = {
      advisorId:this.advisorId,
      clientId:998877,
      familyMemberId:554466,
      ownerName: this.fixedDeposit.controls.ownerName.value,
      amountInvested: this.fixedDeposit.controls.amountInvest.value,
      ownerType: this.fixedDeposit.controls.ownerType.value,
      interestRate : this.fixedDeposit.controls.interestRate.value,
      commencementDate: this.datePipe.transform(this.fixedDeposit.controls.commencementDate.value, 'yyyy-MM-dd'),
      institutionName: this.fixedDeposit.controls.institution.value,
      description: this.fixedDeposit.controls.description.value,
      frequencyOfPayoutPerYear: this.fixedDeposit.controls.maturity.value,
      maturityDate: this.datePipe.transform(this.fixedDeposit.controls.maturityDate.value, 'yyyy-MM-dd'),
      interestPayoutOption: this.fixedDeposit.controls.payOpt.value,
      bankACNo: this.fixedDeposit.controls.bankACNo.value,
      fdNumber: this.fixedDeposit.controls.fdNo.value,
      fdType: this.fixedDeposit.controls.FDType.value,
      interestCompoundingId:this.fixedDeposit.controls.compound.value
    }
    console.log('fixedDeposit',obj)
    this.dataSource = obj
    this.getdataForm();
    if(this.fixedDeposit.controls.id.value == undefined){
      this.custumService.addFixedDeposit(obj).subscribe(
        data => this.addFixedDepositRes(data)
      );
    }else{
      //edit call
      this.custumService.editFixedDeposit(obj).subscribe(
        data => this.editFixedDepositRes(data)
      );
    }
 
  }
}
addFixedDepositRes(data){
console.log('addFixedDepositRes',data)
this.subInjectService.changeNewRightSliderState({state:'close',data})
}
editFixedDepositRes(data){
  this.subInjectService.changeNewRightSliderState({state:'close',data})
}
}
