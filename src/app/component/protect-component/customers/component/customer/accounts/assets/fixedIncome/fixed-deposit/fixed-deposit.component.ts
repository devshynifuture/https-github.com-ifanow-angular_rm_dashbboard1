import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-fixed-deposit',
  templateUrl: './fixed-deposit.component.html',
  styleUrls: ['./fixed-deposit.component.scss']
})
export class FixedDepositComponent implements OnInit {
  showHide = false;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }
  showLess(value){
    if(value  == true){
      this.showHide = false;
    }else{
      this.showHide = true;
    }
  }
  fixedDeposit = this.fb.group({
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
}
