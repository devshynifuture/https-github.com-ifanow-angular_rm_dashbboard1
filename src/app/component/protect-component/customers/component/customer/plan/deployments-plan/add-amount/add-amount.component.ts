import { Component, OnInit, Inject, ViewChildren, QueryList } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatInput } from '@angular/material';
import { DialogData } from 'src/app/component/protect-component/AdviserComponent/Activities/calendar/calendar.component';
import { FormBuilder, Validators } from '@angular/forms';
import { EventService } from 'src/app/Data-service/event.service';
import { ValidatorType } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';
import { PlanService } from '../../plan.service';

@Component({
  selector: 'app-add-amount',
  templateUrl: './add-amount.component.html',
  styleUrls: ['./add-amount.component.scss']
})
export class AddAmountComponent implements OnInit {
  addAmount: any;
  schemeData: any;
  debtValue: any;
  equityValue: any;
  categoryData: any;
  maxValue: any;
  validatorType = ValidatorType

  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  clientId: any;
  advisorId: any;

  constructor(public dialogRef: MatDialogRef<AddAmountComponent>,@Inject(MAT_DIALOG_DATA) public data: DialogData, private fb: FormBuilder,private eventService: EventService,private planService:PlanService) { }

  ngOnInit() {
    console.log(this.data)
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.schemeData={
     schemeName:this.data.data.schemeName,
     schemeCode:this.data.data.schemeCode
    }
    this.categoryData=(this.data.data.schemeCategoryString=='DEBT')?this.data.dataForAddAmount.DEBT:this.data.dataForAddAmount.EQUITY
    this.maxValue=(this.categoryData[0].DEBT_TARGET)?this.categoryData[0].DEBT_TARGET:this.categoryData[0].EQT_TARGET
    this.getdataForm();
  }
  getdataForm() {
    this.addAmount = this.fb.group({
      amount:['', [Validators.required, Validators.max(this.maxValue)]]
    });
  }
  addAmountSubmit(){
    if (this.addAmount.invalid) {
      for (let element in this.addAmount.controls) {
        console.log(element)
        if (this.addAmount.get(element).invalid) {
          this.inputs.find(input => !input.ngControl.valid).focus();
          this.addAmount.controls[element].markAsTouched();
        }
      }
    }else{
      let deploymentList=[];
      this.data.deploymentList.forEach(element => {
        let obj={
          id:element
        }
        deploymentList.push(obj)
      });
      let obj = {
        "schemeCode": this.data.data.schemeCode,
        "clientId": this.clientId,
        "advisorId": this.advisorId,
        "amount":this.addAmount.controls.amount.value,
        "purchaseAmount":this.addAmount.controls.amount.value,
        "familyMemberId":this.data.data.familyMemberId,
        "deploymentList": deploymentList,
        "categoryId":(this.data.data.schemeCategoryString=='DEBT')?2:1

    }
    this.planService.addPurchaseScheme(obj).subscribe(
      data => {
        console.log(data)
      },
      err => this.eventService.openSnackBar(err, "Dismiss")
    )
    console.log(obj)
    this.eventService.openSnackBar("Manage exclusion edited", "Dismiss");
    this.close();
    }
  }
  close() {
    this.dialogRef.close()
  }
}
