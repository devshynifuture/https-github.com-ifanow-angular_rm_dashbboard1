import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';

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

  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject) { }
  ngOnInit() {
  }
  incomeNetForm=this.fb.group({
   monthlyAmount:[,[Validators.required]],
   incomeStyle:[,[Validators.required]],
   continousTill:[,[Validators.required]],
   continousTillYear:[,[Validators.required]],
   incomeGrowthRate:[,[Validators.required]]
  })
  @Output() previousStep = new EventEmitter();
  @Input() set FinalIncomeList(data) {
    this.addMoreFlag = false;
    console.log(data)
    data.forEach(element => {
      if (element.selected) {
        element.incomeTypeList.forEach(checkedData => {
          if (checkedData.checked) {
            element['finalIncomeList'] = checkedData
            this.finalIncomeAddList.push(element)
          }
        })
      }
    });
    console.log(this.finalIncomeAddList)
    this.individualIncomeData = data
  }
  submitIncomeForm() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
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
}
