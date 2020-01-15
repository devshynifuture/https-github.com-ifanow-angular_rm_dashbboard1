import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
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
  editApiData: any;
  finalBonusList: any[];
  bonusList: any;
  showDateError: string;
  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject, private planService: PlanService, private eventService: EventService) { }
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
  }
  incomeNetForm = this.fb.group({
    incomeOption: [, [Validators.required]],
    monthlyAmount: [, [Validators.required]],
    incomeStyle: [, [Validators.required]],
    continousTill: [String(1), [Validators.required]],
    continousTillYear: [, [Validators.required]],
    incomeGrowthRate: [, [Validators.required]],
    basicIncome: [, [Validators.required]],
    standardDeduction: [, [Validators.required]],
    deamessAlowance: [, [Validators.required]],
    hraRecieved: [, [Validators.required]],
    totalRentPaid: [, [Validators.required]],
    incomeStartDate: [, [Validators.required]],
    incomeEndDate: [, [Validators.required]],
    expectingBonusValue: [, [Validators.required]],
    nextAppraisal: [],
    description: []
  })
  @Output() previousStep = new EventEmitter();
  @Input() set FinalIncomeList(data) {
    if (data == undefined) {
      this.incomeNetForm.controls.inc
      return;
    }
    this.addMoreFlag = false;
    this.incomeOption = "2"
    console.log(data)
    data.forEach(element => {
      if (element.selected) {
        element.incomeTypeList.forEach(checkedData => {
          let cloneElement = Object.assign({}, element)
          if (checkedData.checked) {
            cloneElement['finalIncomeList'] = checkedData;
            this.finalIncomeAddList.push(cloneElement)
          }
        })
      }
    });
    console.log(this.finalIncomeAddList)
    this.individualIncomeData = data
    this.singleIndividualIncome = this.finalIncomeAddList[this.incomePosition];
    console.log(this.singleIncomeType)
  }
  @Input() set editIncomeData(data) {
    if (data == undefined) {
      this.incomeNetForm.controls.incomeOption.setValue('2')
      return;
    }
    else {
      this.editApiData = data;
      this.singleIndividualIncome = data;
      this.singleIndividualIncome['userName'] = data.ownerName;
      this.singleIndividualIncome["finalIncomeList"] = { incomeTypeId: data.incomeTypeId }
      this.addMoreFlag = false;
      this.incomeOption = String(data.incomeTypeId);
      this.incomeNetForm.controls.incomeOption.setValue((data.incomeTypeId) ? String(data.incomeTypeId) : '2');
      this.incomeNetForm.controls.monthlyAmount.setValue(data.monthlyIncome);
      this.incomeNetForm.controls.incomeStyle.setValue(data.incomeStyleId);
      this.incomeNetForm.controls.continousTill.setValue(String(data.continueTill));
      this.incomeNetForm.controls.incomeGrowthRate.setValue(data.growthRate);
      this.incomeNetForm.controls.basicIncome.setValue((data.basicIncome == 0) ? '' : data.basicIncome);
      this.incomeNetForm.controls.standardDeduction.setValue((data.standardDeduction == 0) ? '' : data.standardDeduction);
      this.incomeNetForm.controls.deamessAlowance.setValue((data.deamessAlowance == 0) ? '' : data.deamessAlowance);
      this.incomeNetForm.controls.hraRecieved.setValue((data.hraRecieved == 0) ? '' : data.hraRecieved);
      this.incomeNetForm.controls.totalRentPaid.setValue((data.totalRentPaid == 0) ? '' : data.totalRentPaid);
      this.incomeNetForm.controls.incomeStartDate.setValue(new Date(data.incomeStartDate));
      this.incomeNetForm.controls.incomeEndDate.setValue(new Date(data.incomeEndDate));
      this.incomeNetForm.controls.nextAppraisal.setValue(new Date(data.nextAppraisalOrNextRenewal));
      this.incomeNetForm.controls.description.setValue(data.description);
      data.bonusOrInflows.forEach(element => {
        this.getBonusList.push(this.fb.group({
          id: [element.id, [Validators.required]],
          bonusOrInflow: [element.bonusOrInflow, [Validators.required]],
          receivingDate: [new Date(element.receivingDate), [Validators.required]],
          amount: [element.amount, [Validators.required]],
        }))
      });
    }
    this.bonusList = data.bonusOrInflows;
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
    if (this.bonusList) {
      return;
    }
    this.getBonusList.push(this.fb.group({
      receivingDate: [, [Validators.required]],
      amount: [, [Validators.required]],
    }))
  }
  chngIncomeOption(data) {
    this.incomeOption = data.value;
    this.addMoreFlag = false;
    this.incomeNetForm.controls.continousTill.setValue('1');
    console.log(data.value)
  }
  checkDateDiff(event) {
    let incomeStartDate;
    let incomeEndDate;

    if (this.incomeNetForm.get('incomeStartDate').value !== null && this.incomeNetForm.get('incomeEndDate').value !== null) {
      incomeStartDate = new Date((this.incomeNetForm.get('incomeStartDate').value._d) ? this.incomeNetForm.get('incomeStartDate').value._d : this.incomeNetForm.get('incomeStartDate').value).getTime();
      incomeEndDate = new Date((this.incomeNetForm.get('incomeEndDate').value._d) ? this.incomeNetForm.get('incomeEndDate').value._d : this.incomeNetForm.get('incomeEndDate').value).getTime();
      (incomeStartDate == undefined && incomeEndDate == undefined) ? ''
        : (incomeEndDate <= incomeStartDate)
          ? this.showDateError = "Due date should be greater than invoice date" :
          this.showDateError = undefined;
    }
  }
  submitIncomeForm() {
    if (this.getBonusList) {
      this.finalBonusList = []
      this.getBonusList.controls.forEach(element => {
        let obj =
        {
          // "id":0,
          // "bonusOrInflow":0,
          "amount": element.get('amount').value,
          "receivingMonth": new Date(element.get('receivingDate').value).getMonth(),
          "receivingYear": new Date(element.get('receivingDate').value).getFullYear(),
        }
        this.finalBonusList.push(obj)
      })

    }
    if (this.singleIndividualIncome.finalIncomeList.incomeTypeId == 1) {
      if (this.incomeOption == '1') {
        if (this.incomeNetForm.get('basicIncome').invalid) {
          this.incomeNetForm.get('basicIncome').markAsTouched();
          return;
        }
        else if (this.incomeNetForm.get('standardDeduction').invalid) {
          this.incomeNetForm.get('standardDeduction').markAsTouched();

          return;
        }
        else if (this.incomeNetForm.get('deamessAlowance').invalid) {
          this.incomeNetForm.get('deamessAlowance').markAsTouched();
          return;
        }
        else if (this.incomeNetForm.get('hraRecieved').invalid) {
          this.incomeNetForm.get('hraRecieved').markAsTouched();
          return;
        }
        else if (this.incomeNetForm.get('totalRentPaid').invalid) {
          this.incomeNetForm.get('totalRentPaid').markAsTouched();
          return;
        }
      }
      else {
        if (this.incomeNetForm.get('monthlyAmount').invalid) {
          this.incomeNetForm.get('monthlyAmount').markAsTouched();
          return;
        }
      }
    }
    if (this.singleIndividualIncome.finalIncomeList.incomeTypeId != 1) {
      if (this.incomeNetForm.get('monthlyAmount').invalid) {
        this.incomeNetForm.get('monthlyAmount').markAsTouched();
        return;
      }

    }
    if (this.incomeNetForm.get('incomeGrowthRate').invalid) {
      this.incomeNetForm.get('incomeGrowthRate').markAsTouched();
      return;
    }
    if (this.incomeNetForm.get('incomeStartDate').invalid) {
      this.incomeNetForm.get('incomeStartDate').markAsTouched();
      return;
    }
    if (this.incomeNetForm.get('incomeEndDate').invalid) {
      this.incomeNetForm.get('incomeEndDate').markAsTouched();
      return;
    }
    if (this.showDateError) {
      return
    }
    let obj =
    {
      "familyMemberId": this.singleIndividualIncome.id,
      "clientId": this.clientId,
      "advisorId": this.advisorId,
      "ownerName": this.singleIndividualIncome.userName,
      "monthlyIncome": this.incomeNetForm.get('monthlyAmount').value,
      "incomeStartMonth": new Date(this.incomeNetForm.get('incomeStartDate').value).getMonth(),
      "incomeStartYear": new Date(this.incomeNetForm.get('incomeStartDate').value).getFullYear(),
      "incomeEndMonth": new Date(this.incomeNetForm.get('incomeEndDate').value).getMonth(),
      "incomeEndYear": new Date(this.incomeNetForm.get('incomeEndDate').value).getFullYear(),
      "incomeGrowthRateId": 50,
      "growthRate": (this.incomeNetForm.get('incomeGrowthRate').value) ? this.incomeNetForm.get('incomeGrowthRate').value : 0,
      "incomeStyleId": 20,
      "continueTill": parseInt(this.incomeNetForm.get("continousTill").value),
      "nextAppraisalOrNextRenewal": this.incomeNetForm.get('nextAppraisal').value,
      "incomeTypeId": this.singleIndividualIncome.finalIncomeList.incomeTypeList,
      "realEstateId": 20,
      "basicIncome": (this.incomeNetForm.get('basicIncome').value) ? (this.incomeNetForm.get('basicIncome').value) : 0,
      "standardDeduction": (this.incomeNetForm.get('standardDeduction').value) ? this.incomeNetForm.get('standardDeduction').value : 0,
      "deamessAlowance": (this.incomeNetForm.get('deamessAlowance').value) ? this.incomeNetForm.get('deamessAlowance').value : 0,
      "hraRecieved": (this.incomeNetForm.get('hraRecieved').value) ? this.incomeNetForm.get('hraRecieved').value : 0,
      "totalRentPaid": (this.incomeNetForm.get('totalRentPaid').value) ? this.incomeNetForm.get('totalRentPaid').value : 0,
      "description": this.incomeNetForm.get('description').value,
      "monthlyContributions": this.finalBonusList
    }

    console.log(obj)
    if (this.editApiData) {
      obj['id'] = this.editApiData.id;
      this.planService.editIncomeData(obj).subscribe(
        data => this.submitIncomeFormRes(data),
        error => this.eventService.showErrorMessage(error)
      )
    }
    else {
      this.planService.addIncomeData(obj).subscribe(
        data => this.submitIncomeFormRes(data),
        error => this.eventService.showErrorMessage(error)
      )
    }
  }
  submitIncomeFormRes(data) {
    this.incomePosition++;
    if (this.incomePosition < this.finalIncomeAddList.length) {
      this.singleIndividualIncome = this.finalIncomeAddList[this.incomePosition]
    }
    else {
      (this.editApiData) ? this.eventService.openSnackBar("Income is edited") : this.eventService.openSnackBar("Income is added")
      this.subInjectService.changeNewRightSliderState({ state: 'close' });
    }
  }
  //  expected bonus array logic
  expectedBonusForm = this.fb.group({
    bonusList: new FormArray([])
  })

  get getExpectedBonusForm() { return this.expectedBonusForm.controls };
  get getBonusList() { return this.getExpectedBonusForm.bonusList as FormArray };

  addExpectedBonus() {
    this.getBonusList.push(this.fb.group({
      id: [, [Validators.required]],
      bonusOrInflow: [, [Validators.required]],
      receivingDate: [, [Validators.required]],
      amount: [, [Validators.required]],
    }))
    console.log(this.getBonusList)
  }
  removeExpectedBonus(index) {
    // this.expectedBonusForm.controls.bonusList.remove
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
