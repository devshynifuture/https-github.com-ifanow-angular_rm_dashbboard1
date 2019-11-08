import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../../customer.service';

@Component({
  selector: 'app-fixed-deposit',
  templateUrl: './fixed-deposit.component.html',
  styleUrls: ['./fixed-deposit.component.scss']
})
export class FixedDepositComponent implements OnInit {
  showHide = false;
  isownerName = false;
  isDescription = false;
  isBankACNo = false;
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
  isInstitution = false;
  fixedDeposit: any;
  constructor(private fb: FormBuilder, private custumService : CustomerService) { }

  ngOnInit() {
    this.getdataForm()
  }
  showLess(value){
    if(value  == true){
      this.showHide = false;
    }else{
      this.showHide = true;
    }
  }
  getdataForm(){
    this.fixedDeposit = this.fb.group({
      ownerName: [, [Validators.required]],
      amountInvest: [, [Validators.required]],
      commencementDate: [, [Validators.required]],
      interestDate: [, [Validators.required]],
      compound: [, [Validators.required]],
      institution: [, [Validators.required]],
      description: [, [Validators.required]],
      maturity: [, [Validators.required]],
      maturityDate: [, [Validators.required]],
      payOpt: [, [Validators.required]],
      bankACNo: [, [Validators.required]],
      ownerType: [, [Validators.required]],
      fdNo: [, [Validators.required]],
      FDType:[, [Validators.required]]
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
  } else if (this.fixedDeposit.controls.interestDate.invalid) {
    this.isInterestDate = true;
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
      ownerName: this.fixedDeposit.controls.ownerName.value,
      amountInvest: this.fixedDeposit.controls.amountInvest.value,
      ownerType: this.fixedDeposit.controls.ownerType.value,
      commencementDate: this.fixedDeposit.controls.commencementDate.value,
      compound: this.fixedDeposit.controls.compound.value,
      interestDate: this.fixedDeposit.controls.interestDate.value,
      institution: this.fixedDeposit.controls.institution.value,
      description: this.fixedDeposit.controls.description.value,
      maturity: this.fixedDeposit.controls.maturity.value,
      maturityDate: this.fixedDeposit.controls.maturityDate.value,
      payOpt: this.fixedDeposit.controls.payOpt.value,
      bankACNo: this.fixedDeposit.controls.bankACNo.value,
      fdNo: this.fixedDeposit.controls.fdNo.value,
      FDType: this.fixedDeposit.controls.FDType.value,
    }
    console.log('fixedDeposit',obj)
    this.custumService.addFixedDeposit(obj).subscribe(
      data => this.addFixedDepositRes(data)
    );
  }
}
addFixedDepositRes(data){
console.log('addFixedDepositRes',data)
}
}
