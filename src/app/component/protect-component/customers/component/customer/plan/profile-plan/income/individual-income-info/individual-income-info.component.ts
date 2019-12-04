import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { AuthService } from 'src/app/auth-service/authService';
import { PlanService } from '../../../plan.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-individual-income-info',
  templateUrl: './individual-income-info.component.html',
  styleUrls: ['./individual-income-info.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ]
})
export class IndividualIncomeInfoComponent implements OnInit {
  individualIncomeData: any;
  finalIncomeAddList = [];
  addMoreFlag: boolean;
  incomeOption: any;
  singleIndividualIncome: any;
  singleIncomeType: any;
  incomePosition = 0;
  advisorId: any;
  clientId: any;
  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject,private planService:PlanService,private eventService:EventService) { }
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
  }
  incomeNetForm = this.fb.group({
    monthlyAmount: [, [Validators.required]],
    incomeStyle: [, [Validators.required]],
    continousTill: [String(1), [Validators.required]],
    continousTillYear: [, [Validators.required]],
    incomeGrowthRate: [, [Validators.required]],
    basicIncome: [, [Validators.required]],
    standardDeduction: [, [Validators.required]],
    dearnessAllowance: [, [Validators.required]],
    hraRecieved: [, [Validators.required]],
    totalRentPaid: [, [Validators.required]],
    incomeStartDate: [, [Validators.required]],
    incomeEndDate: [, [Validators.required]],
    nextAppraisal: [],
    description: []
  })
  @Output() previousStep = new EventEmitter();
  @Input() set FinalIncomeList(data) {
    if(data==undefined)
    {
      return;
    }
    this.addMoreFlag = false;
    this.incomeOption = "2"
    console.log(data)
    data.forEach(element => {
      if (element.selected) {
        element.incomeTypeList.forEach(checkedData => {
          if (checkedData.checked) {
            element['finalIncomeList'] = checkedData;
            this.finalIncomeAddList.push(element)
          }
        })
      }
    });
    console.log(this.finalIncomeAddList)
    this.individualIncomeData = data
    this.singleIndividualIncome = this.finalIncomeAddList[this.incomePosition];
    console.log(this.singleIncomeType)
  }
  cancel() {
    const obj =
    {
      data: this.individualIncomeData,
      stpeNo: 2,
      flag: "individualIncome"
    }
    this.previousStep.emit(obj)
  }
  showOptional() {
    (this.addMoreFlag) ? this.addMoreFlag = false : this.addMoreFlag = true;
  }
  chngIncomeOption(data) {
    this.incomeOption = data.value;
    this.addMoreFlag = false;
  }
  submitIncomeForm() {
    // console.log(this.incomeNetForm.get('incomeStartDate,').value._d)
    let obj =
    {
      "clientId": this.advisorId,
      "advisorId": this.clientId,
      "familyMemberId": this.singleIndividualIncome.id,
      "ownerName": this.singleIndividualIncome.userName,
      "monthlyIncome": this.incomeNetForm.get('monthlyAmount').value,
      "incomeStartDate": this.incomeNetForm.get('incomeStartDate').value._d,
      "incomeEndDate": this.incomeNetForm.get('incomeEndDate').value._d,
      "incomeGrowthRateId": 20,
      "growthRate": 20,
      "incomeStyleId": 20,
      "continueTill": "2000-01-20",
      "nextAppraisalOrNextRenewal":this.incomeNetForm.get('nextAppraisal').value._d,
      "incomeTypeId": this.singleIndividualIncome.finalIncomeList.id,
      "realEstateId": 20,
      "basicIncome": this.incomeNetForm.get('basicIncome').value,
      "standardDeduction": this.incomeNetForm.get('standardDeduction').value,
      "deamessAlowance": this.incomeNetForm.get('dearnessAllowance').value,
      "hraRecieved": this.incomeNetForm.get('hraRecieved').value,
      "totalRentPaid": this.incomeNetForm.get('totalRentPaid').value,
      "description": this.incomeNetForm.get('description').value,
      "bonusOrInflows": [
        {
          "id": 1,
          "bonusOrInflow": 1,
          "amount": 7000,
          "receivingDate": "2000-07-07"

        }
      ]
    }
    if (this.incomePosition < this.finalIncomeAddList.length) {
      this.planService.addIncomeData(obj).subscribe(
        data=>this.submitIncomeFormRes(data),
        err=>this.eventService.openSnackBar(err)
      )
    }
  }
  submitIncomeFormRes(data)
  {
    this.incomePosition++;
      this.singleIndividualIncome = this.finalIncomeAddList[this.incomePosition]
      if (this.incomePosition == this.finalIncomeAddList.length) {
        this.subInjectService.changeNewRightSliderState({ state: 'close' });
      }
    }
  
}
