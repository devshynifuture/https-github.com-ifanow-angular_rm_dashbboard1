import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-add-income-source',
  templateUrl: './add-income-source.component.html',
  styleUrls: ['./add-income-source.component.scss']
})
export class AddIncomeSourceComponent implements OnInit {
  incomeSourceDataSelectedFamily = [];
  stepOneData: any;
  selectedFamilyIncome = [];
  constructor() { }
  @Output() IncomeSourceDetailsData = new EventEmitter();
  @Output() previousStep = new EventEmitter();
  @Input() set selectedFamilyList(data) {
    this.stepOneData = data
    data.forEach(element => {
      const obj =
      {
        isSalaried: false,
        isBuisness: false,
        isProfession: false,
        isRental: false,
        isOther: false
      }
      if (element.selected) {
        this.selectedFamilyIncome.push(obj)
      }
    });
  }
  ngOnInit() {
  }
  nextStep() {
    const obj =
    {
      data: this.stepOneData,
      stpeNo: 3
    }
    this.IncomeSourceDetailsData.emit(obj)
  }
  cancel() {
    const obj =
    {
      data: this.stepOneData,
      stpeNo: 1
    }
    this.previousStep.emit(obj);
  }
  called(data)
  {
    console.log(data)
  }
}
