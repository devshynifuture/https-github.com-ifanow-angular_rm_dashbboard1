import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { element } from 'protractor';

@Component({
  selector: 'app-add-income-source',
  templateUrl: './add-income-source.component.html',
  styleUrls: ['./add-income-source.component.scss']
})
export class AddIncomeSourceComponent implements OnInit {
  incomeSourceDataSelectedFamily = [];
  stepOneData: any;
  selectedFamilyIncome = [];
  countIncomeType:number=0;
  constructor() { }
  @Output() IncomeSourceDetailsData = new EventEmitter();
  @Output() previousStep = new EventEmitter();
  @Input() set selectedFamilyList(data) {
    if(data.flag!="addIncome")
    {
      this.stepOneData = data.data;
      this.stepOneData.forEach(element=>
        {
          if(element.selected)
          {
            element.incomeTypeList.forEach(checkedData=>
              {
                if(checkedData.checked)
                {
                  this.countIncomeType++;
                }
              })
          }
        })
      return;
    }
    else{
      data.data.forEach(element => {
        const obj = [
          { name: "Salaried", checked: false, id: 1 },
          { name: "Business", checked: false, id: 2 },
          { name: 'Profession', checked: false, id: 3 },
          { name: "Rental", checked: false, id: 5 },
          { name: "Others", checked: false, id: 6 }
        ]
        if (element.selected) {
          element['incomeTypeList'] = obj
        }
      });
      this.stepOneData = data.data
    }
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
      stpeNo: 1,
      flag:'incomeSource'
    }
    this.previousStep.emit(obj);
  }
  select(data) {
    (data.checked)?this.unselectIncomeType(data):this.selectIncomeType(data);
  }
  selectIncomeType(data) {
    data.checked=true;
    this.countIncomeType++;
  }
  unselectIncomeType(data) {
    data.checked=false;
    this.countIncomeType--;
  }
}
